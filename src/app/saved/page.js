"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { ArrowLeft, Bookmark, Trash2, Heart, MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


export default function SavedItemsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});


  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }


    fetchSavedPosts();
  }, [user]);


  const fetchSavedPosts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/saved/${user.uid}`);
      if (response.ok) {
        const posts = await response.json();
        setSavedPosts(posts);
        
        // Fetch user details for each post
        const userIds = [...new Set(posts.map(p => p.userId))];
        await fetchUsers(userIds);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };


  const fetchUsers = async (userIds) => {
    const usersData = {};
    for (const userId of userIds) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`);
        if (response.ok) {
          const userData = await response.json();
          usersData[userId] = userData;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }
    setUsers(usersData);
  };


  const handleUnsave = async (postId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid }),
      });


      if (response.ok) {
        setSavedPosts(savedPosts.filter(post => post._id !== postId));
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };


  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading saved items...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center space-x-3">
            <Bookmark className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {savedPosts.length} {savedPosts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>


        {/* Saved Posts */}
        {savedPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Bookmark className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No saved items yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Save posts you would like to revisit later
              </p>
              <Link href="/">
                <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                  Explore Feed
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post) => {
              const postUser = users[post.userId];
              return (
                <Card key={post._id} className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Link href={`/profile/${post.userId}`}>
                          {postUser?.profilePicture ? (
                            <Image
                              src={postUser.profilePicture}
                              alt={postUser.name}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white font-semibold shadow-lg">
                              {getInitials(postUser?.name || 'User')}
                            </div>
                          )}
                        </Link>
                        <div>
                          <Link href={`/profile/${post.userId}`}>
                            <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                              {postUser?.name || 'User'}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {postUser?.headline || 'Professional'}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnsave(post._id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>


                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>


                    {/* Post Media */}
                    {post.mediaUrl && post.mediaType === 'image' && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={post.mediaUrl}
                          alt="Post media"
                          width={600}
                          height={400}
                          className="w-full object-cover"
                        />
                      </div>
                    )}


                    {/* Post Actions */}
                    <div className="flex items-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Heart className="h-5 w-5" />
                        <span className="text-sm">{post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-sm">{post.comments?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        <Share2 className="h-5 w-5" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
