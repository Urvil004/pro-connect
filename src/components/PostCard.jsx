"use client";
import Link from "next/link";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { Input } from "./Input";
import { MediaCarousel } from "./MediaCarousel";
import { formatDate, getInitials } from "@/lib/utils";
import { createPollingInterval, clearPollingInterval } from "@/lib/realtime";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ThumbsUp,
  MessageCircle,
  Share,
  MoreHorizontal,
  Globe,
  Play,
  Download,
  Heart,
  Trash2,
  X,
  FileText,
  Image,
  Video,
  Send,
  Edit3,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";


export function PostCard({
  post,
  isDetailView = false,
  onPostUpdate,
  enableRealtime = true,
}) {
  const [authorProfile, setAuthorProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [commentCount, setCommentCount] = useState(post.commentCount || 0);
  const [shareCount, setShareCount] = useState(post.shareCount || 0);
  const [saved, setSaved] = useState(false);
  const [savedCount, setSavedCount] = useState(post.savedCount || 0);
  const [loadingSave, setLoadingSave] = useState(false);
  const [showComments, setShowComments] = useState(isDetailView);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content || "");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const pollingIntervalRef = useRef(null);
  const dropdownRef = useRef(null);
  const { user } = useAuth();

  // [Keep all useEffect hooks and handler functions the same - they don't need dark mode changes]
  // ... (all the existing logic remains unchanged)

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (post.authorId) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${post.authorId}`);
          if (response.ok) {
            const userData = await response.json();
            setAuthorProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching author profile:", error);
        }
      }
    };
    fetchAuthorProfile();
  }, [post.authorId]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setUserProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && showMediaModal) {
        closeMediaModal();
      }
    };
    if (showMediaModal) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [showMediaModal]);

  useEffect(() => {
    if (post.likes && user) {
      const userLike = post.likes.find((like) => like.userId === user.uid);
      setLiked(!!userLike);
    }
    if (post.savedBy && user) {
      const userSave = post.savedBy.find((save) => save.userId === user.uid);
      setSaved(!!userSave);
    }
  }, [post.likes, post.savedBy, user]);

  useEffect(() => {
    if (!enableRealtime || !post.postId || isDetailView) return;
    const handleRealtimeUpdate = (updatedPost) => {
      if (
        updatedPost.likeCount !== likeCount ||
        updatedPost.commentCount !== commentCount ||
        updatedPost.shareCount !== shareCount ||
        updatedPost.savedCount !== savedCount
      ) {
        setLikeCount(updatedPost.likeCount || 0);
        setCommentCount(updatedPost.commentCount || 0);
        setShareCount(updatedPost.shareCount || 0);
        setSavedCount(updatedPost.savedCount || 0);
        setComments(updatedPost.comments || []);
        if (updatedPost.likes && user) {
          const userLike = updatedPost.likes.find((like) => like.userId === user.uid);
          setLiked(!!userLike);
        }
        if (updatedPost.savedBy && user) {
          const userSave = updatedPost.savedBy.find((save) => save.userId === user.uid);
          setSaved(!!userSave);
        }
        if (onPostUpdate) {
          onPostUpdate(updatedPost);
        }
      }
    };
    pollingIntervalRef.current = createPollingInterval(post.postId, handleRealtimeUpdate, 15000);
    return () => {
      if (pollingIntervalRef.current) {
        clearPollingInterval(pollingIntervalRef.current);
      }
    };
  }, [post.postId, enableRealtime, isDetailView, user, onPostUpdate, likeCount, commentCount, shareCount, savedCount]);

  const handleLike = async () => {
    if (!user || loadingLike || !post.postId) return;
    setLoadingLike(true);
    const wasLiked = liked;
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName || user.email,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(data.likeCount);
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            likes: data.likes,
            likeCount: data.likeCount,
          }));
        }
      } else {
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      }
    } catch (error) {
      setLiked(wasLiked);
      setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    } finally {
      setLoadingLike(false);
    }
  };

  const handleSave = async () => {
    if (!user || loadingSave || !post.postId) return;
    setLoadingSave(true);
    const wasSaved = saved;
    setSaved(!saved);
    setSavedCount((prev) => (saved ? prev - 1 : prev + 1));
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName || user.email,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setSaved(data.isSaved);
        setSavedCount(data.savedCount);
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            savedBy: data.post.savedBy,
            savedCount: data.savedCount,
          }));
        }
      } else {
        setSaved(wasSaved);
        setSavedCount((prev) => (wasSaved ? prev + 1 : prev - 1));
      }
    } catch (error) {
      setSaved(wasSaved);
      setSavedCount((prev) => (wasSaved ? prev + 1 : prev - 1));
    } finally {
      setLoadingSave(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user || !newComment.trim() || loadingComment || !post.postId) return;
    setLoadingComment(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment.trim(),
          authorId: user.uid,
          authorName: user.displayName || user.email,
          authorAvatar: userProfile?.profilePicture,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setComments((prev) => [...prev, data.comment]);
        setCommentCount(data.commentCount);
        setNewComment("");
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            comments: [...prev.comments, data.comment],
            commentCount: data.commentCount,
          }));
        }
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleShare = async () => {
    if (!user || !post.postId) return;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          userName: user.displayName || user.email,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setShareCount(data.shareCount);
        const shareUrl = `${window.location.origin}/post/${post.postId}`;
        if (navigator.share) {
          await navigator.share({
            title: `Post by ${post.authorName}`,
            text: post.content.substring(0, 100) + "...",
            url: shareUrl,
          });
        } else {
          await navigator.clipboard.writeText(shareUrl);
          alert("Post URL copied to clipboard!");
        }
        if (onPostUpdate) {
          onPostUpdate((prev) => ({ ...prev, shareCount: data.shareCount }));
        }
      }
    } catch (error) {
      const shareUrl = `${window.location.origin}/post/${post.postId}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Post URL copied to clipboard!");
      } catch (clipboardError) {
        console.error("Clipboard access denied");
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (!user || !post.postId) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setComments((prev) => prev.filter((comment) => comment._id !== commentId));
        setCommentCount(data.commentCount);
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            comments: prev.comments.filter((comment) => comment._id !== commentId),
            commentCount: data.commentCount,
          }));
        }
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!user || !post.postId || loadingDelete) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This action cannot be undone.");
    if (!confirmDelete) return;
    setLoadingDelete(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });
      if (response.ok) {
        if (onPostUpdate) {
          onPostUpdate(null);
        } else {
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to delete post. Please try again.");
      }
    } catch (error) {
      alert("Failed to delete post. Please try again.");
    } finally {
      setLoadingDelete(false);
      setShowDropdown(false);
    }
  };

  const handleEditPost = async () => {
    if (!user || !post.postId || loadingEdit || !editContent.trim()) return;
    setLoadingEdit(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          content: editContent.trim(),
        }),
      });
      if (response.ok) {
        const updatedPost = await response.json();
        if (onPostUpdate) {
          onPostUpdate((prev) => ({
            ...prev,
            content: updatedPost.content,
            updatedAt: updatedPost.updatedAt,
          }));
        }
        setIsEditing(false);
        setShowDropdown(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update post. Please try again.");
      }
    } catch (error) {
      alert("Failed to update post. Please try again.");
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(post.content || "");
    setShowDropdown(false);
  };

  const isPostOwner = user && user.uid === post.authorId;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const openMediaModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowMediaModal(true);
  };

  const closeMediaModal = () => {
    setShowMediaModal(false);
    setSelectedMedia(null);
  };

  const getAuthorAvatar = () => {
    if (authorProfile?.profilePicture) {
      return (
        <Link href={`/profile/${post.authorId}`}>
          <img
            src={authorProfile.profilePicture}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 dark:hover:ring-blue-400 transition-all"
          />
        </Link>
      );
    }
    return (
      <Link href={`/profile/${post.authorId}`}>
        <div className="h-12 w-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-medium text-lg cursor-pointer hover:ring-2 hover:ring-blue-600 dark:hover:ring-blue-400 transition-all">
          {getInitials(post.authorName)}
        </div>
      </Link>
    );
  };

  const getUserAvatar = () => {
    if (userProfile?.profilePicture) {
      return (
        <img
          src={userProfile.profilePicture}
          alt="Your profile"
          className="h-8 w-8 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="h-8 w-8 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
        {getInitials(user?.displayName || user?.email || "User")}
      </div>
    );
  };

  const getDocumentIcon = (fileName) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />;
      case "doc":
      case "docx":
        return <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />;
      case "txt":
        return <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />;
      default:
        return <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-0">
        {/* ✅ DARK MODE: Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{getAuthorAvatar()}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/profile/${post.authorId}`}>
                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                      {authorProfile?.firstName && authorProfile?.lastName
                        ? `${authorProfile.firstName} ${authorProfile.lastName}`
                        : post.authorName}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {authorProfile?.headline || "Professional"}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {post.postId ? (
                      <Link
                        href={`/post/${post.postId}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <span>{formatDate(post.createdAt)}</span>
                      </Link>
                    ) : (
                      <span>{formatDate(post.createdAt)}</span>
                    )}
                    {post.updatedAt && post.updatedAt !== post.createdAt && (
                      <>
                        <span className="mx-1">•</span>
                        <span className="text-gray-500 dark:text-gray-400">edited</span>
                      </>
                    )}
                    <span className="mx-1">•</span>
                    <Globe className="h-3 w-3 mr-1" />
                    {enableRealtime && !isDetailView && (
                      <>
                        <span className="mx-1">•</span>
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-400 dark:bg-green-500 mr-1" />
                          <span className="text-xs">Live</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {isPostOwner && (
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>

                    {showDropdown && (
                      <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 sm:z-10">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Edit3 className="h-4 w-4 mr-3" />
                          Edit post
                        </button>
                        <button
                          onClick={handleDeletePost}
                          disabled={loadingDelete}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 mr-3" />
                          {loadingDelete ? "Deleting..." : "Delete post"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ DARK MODE: Content */}
        <div className="px-4 pb-3">
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleCancelEdit();
                  } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    if (editContent.trim() && !loadingEdit) {
                      handleEditPost();
                    }
                  }
                }}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none"
                rows={4}
                placeholder="What's on your mind?"
                autoFocus
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Press Ctrl+Enter to save, Esc to cancel
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancelEdit}
                    disabled={loadingEdit}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEditPost}
                    disabled={loadingEdit || !editContent.trim()}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                  >
                    {loadingEdit ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </p>
          )}
        </div>

        {/* Media - Using MediaCarousel */}
        {post.media && post.media.length > 0 && (
          <div className="px-4 pb-3">
            <MediaCarousel
              media={post.media}
              onMediaClick={openMediaModal}
              className="rounded-lg overflow-hidden"
            />
          </div>
        )}

        {/* ✅ DARK MODE: Engagement Stats */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-1">
                  <ThumbsUp className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
                <span className="text-xs sm:text-sm">{likeCount} likes</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-xs sm:text-sm transition-colors"
              >
                {commentCount} comments
              </button>
              <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-xs sm:text-sm transition-colors">
                {shareCount} shares
              </span>
              {savedCount > 0 && (
                <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-xs sm:text-sm transition-colors">
                  {savedCount} saves
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ✅ DARK MODE: Action Buttons */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-around">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={loadingLike || !user}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 rounded-none ${
                liked
                  ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <ThumbsUp
                className={`h-4 w-4 sm:h-5 sm:w-5 ${liked ? "fill-current" : ""}`}
              />
              <span className="font-medium text-sm sm:text-base">Like</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-none"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Comment</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              disabled={!user}
              className="flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-none relative"
            >
              <Share className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base">Share</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={loadingSave || !user}
              className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-3 rounded-none ${
                saved
                  ? "text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {saved ? (
                <BookmarkCheck className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span className="font-medium text-sm sm:text-base">
                {saved ? "Saved" : "Save"}
              </span>
            </Button>
          </div>
        </div>

        {/* ✅ DARK MODE: Comments Section */}
        {showComments && (
          <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
            {user && (
              <form onSubmit={handleComment} className="mt-4 mb-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">{getUserAvatar()}</div>
                  <div className="flex-1 relative">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2 focus-within:bg-white dark:focus-within:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-all">
                      <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1 bg-transparent border-none outline-none ring-0 focus:ring-0 focus:border-none shadow-none px-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={loadingComment}
                      />
                      {newComment.trim() && (
                        <Button
                          type="submit"
                          size="sm"
                          disabled={loadingComment}
                          className="ml-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-full h-8 w-8 p-0 flex items-center justify-center"
                        >
                          {loadingComment ? (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {comment.authorAvatar ? (
                      <img
                        src={comment.authorAvatar}
                        alt={comment.authorName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-500 dark:bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(comment.authorName)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                          {comment.authorName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                          {user &&
                            (comment.authorId === user.uid ||
                              post.authorId === user.uid) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteComment(comment._id)}
                                className="h-6 w-6 p-0 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ DARK MODE: Full-Screen Media Modal */}
        {showMediaModal && selectedMedia && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 dark:bg-opacity-95 flex items-center justify-center z-50"
            onClick={closeMediaModal}
          >
            <div className="relative max-w-full max-h-full p-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={closeMediaModal}
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 hover:bg-opacity-70 dark:bg-opacity-70 dark:hover:bg-opacity-90 text-white rounded-full h-10 w-10 p-0"
              >
                <X className="h-6 w-6" />
              </Button>

              <div
                className="flex items-center justify-center max-w-screen-lg max-h-screen"
                onClick={(e) => e.stopPropagation()}
              >
                {selectedMedia.type === "image" && (
                  <div className="relative">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.name}
                      className="max-w-full max-h-[90vh] object-contain rounded-lg"
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 dark:bg-opacity-90 text-white px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">{selectedMedia.name}</p>
                    </div>
                  </div>
                )}

                {selectedMedia.type === "video" && (
                  <div className="relative">
                    <video
                      src={selectedMedia.url}
                      className="max-w-full max-h-[90vh] object-contain rounded-lg"
                      controls
                      autoPlay
                    />
                    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 dark:bg-opacity-90 text-white px-3 py-2 rounded-lg">
                      <p className="text-sm font-medium">{selectedMedia.name}</p>
                    </div>
                  </div>
                )}

                {selectedMedia.type === "document" && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        {getDocumentIcon(selectedMedia.name)}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedMedia.name}
                      </h3>
                      {selectedMedia.size && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Size: {(selectedMedia.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>

                    {selectedMedia.name.toLowerCase().endsWith(".pdf") ? (
                      <div className="mb-4">
                        <iframe
                          src={selectedMedia.url}
                          className="w-full h-96 border border-gray-300 dark:border-gray-600 rounded-lg"
                          title={selectedMedia.name}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-600 dark:text-gray-400 mb-4">
                        <p>Preview not available for this file type.</p>
                        <p>Click "Open Document" to view in a new tab.</p>
                      </div>
                    )}

                    <div className="flex space-x-3 justify-center">
                      <Button
                        onClick={() => window.open(selectedMedia.url, "_blank")}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 flex items-center space-x-2"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Open Document</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = selectedMedia.url;
                          link.download = selectedMedia.name;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
