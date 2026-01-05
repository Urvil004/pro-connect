"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import { getInitials } from "@/lib/utils";
import {
  Users,
  FileText,
  Search,
  X,
  MessageSquare,
  Heart,
  User,
  Clock,
} from "lucide-react";


export function SearchResults({
  results,
  isVisible,
  onClose,
  searchQuery,
  loading,
}) {
  if (!isVisible && !loading) return null;


  const hasResults =
    results && (results.users?.length > 0 || results.posts?.length > 0);


  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInMs = now - postTime;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);


    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    return "Just now";
  };


  return (
    <AnimatePresence>
      {(isVisible || loading) && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-2 z-50"
        >
          <Card className="shadow-xl border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm max-h-96 overflow-hidden">
            <CardContent className="p-0">
              {/* ✅ DARK MODE: Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {loading ? "Searching..." : `Results for "${searchQuery}"`}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>


              {/* ✅ DARK MODE: Loading State */}
              {loading ? (
                <div className="p-8 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Searching for users and posts...
                  </p>
                </div>
              ) : !hasResults ? (
                /* ✅ DARK MODE: Empty State */
                <div className="p-8 text-center">
                  <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                    Try searching for different names or keywords
                  </p>
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {/* ✅ DARK MODE: Users Section */}
                  {results.users?.length > 0 && (
                    <div className="p-2">
                      <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                          People
                        </span>
                        <span className="text-xs text-blue-500 dark:text-blue-400 ml-auto">
                          {results.users.length} found
                        </span>
                      </div>
                      {results.users.map((user, index) => (
                        <motion.div
                          key={user.firebaseUid || user._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={`/profile/${user.firebaseUid}`}
                            onClick={onClose}
                          >
                            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-blue-200 dark:hover:border-blue-700">
                              {user.profilePicture ? (
                                <img
                                  src={user.profilePicture}
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-blue-300 dark:group-hover:ring-blue-600 transition-all duration-200">
                                  {getInitials(user.name)}
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors duration-200">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                  {user.headline || user.bio || "Professional"}
                                </p>
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <User className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}


                  {/* ✅ DARK MODE: Posts Section */}
                  {results.posts?.length > 0 && (
                    <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-2 px-3 py-2 mb-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                          Posts
                        </span>
                        <span className="text-xs text-green-500 dark:text-green-400 ml-auto">
                          {results.posts.length} found
                        </span>
                      </div>
                      {results.posts.map((post, index) => (
                        <motion.div
                          key={post.postId || post._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 + 0.1 }}
                        >
                          <Link href={`/post/${post.postId}`} onClick={onClose}>
                            <div className="p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-200 cursor-pointer group border border-transparent hover:border-green-200 dark:hover:border-green-700">
                              <div className="flex items-start gap-3">
                                {post.authorProfilePicture ? (
                                  <img
                                    src={post.authorProfilePicture}
                                    alt={post.authorName}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-green-300 dark:group-hover:ring-green-600 transition-all duration-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-500 dark:to-teal-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-green-300 dark:group-hover:ring-green-600 transition-all duration-200">
                                    {getInitials(post.authorName)}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors duration-200">
                                      {post.authorName}
                                    </p>
                                    <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                                    <p className="text-xs text-gray-400 dark:text-gray-500">
                                      {formatTimeAgo(post.timestamp)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-200">
                                    {post.content}
                                  </p>
                                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Heart className="h-3 w-3" />
                                      {post.likeCount || 0}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MessageSquare className="h-3 w-3" />
                                      {post.commentCount || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}


                  {/* ✅ DARK MODE: View All Results Link */}
                  {hasResults && (
                    <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        onClick={onClose}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          View all results ({results.total})
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
