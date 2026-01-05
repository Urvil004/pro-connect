"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import {
  Info,
  Plus,
  TrendingUp,
  Briefcase,
  Calendar,
  Users,
  ArrowRight,
  BookOpen,
  Award,
  Target,
} from "lucide-react";


export function RightSidebar() {
  const router = useRouter();
  const [followedFeeds, setFollowedFeeds] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);


  const newsItems = [
    {
      title: "Tech industry sees major growth",
      subtitle: "2 hours ago • 1,234 readers",
      trending: true,
    },
    {
      title: "Remote work trends in 2025",
      subtitle: "4 hours ago • 892 readers",
      trending: false,
    },
    {
      title: "AI development accelerates",
      subtitle: "6 hours ago • 2,156 readers",
      trending: true,
    },
    {
      title: "Startup funding reaches new highs",
      subtitle: "8 hours ago • 567 readers",
      trending: false,
    },
    {
      title: "Green technology innovations",
      subtitle: "12 hours ago • 1,445 readers",
      trending: true,
    },
  ];


  const feedSuggestions = [
    {
      id: "tech-learning-hub",
      name: "Tech Learning Hub",
      type: "Company • Technology",
      icon: BookOpen,
      gradient: "from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600",
    },
    {
      id: "startup-success",
      name: "Startup Success",
      type: "Newsletter • Business",
      icon: Award,
      gradient: "from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600",
    },
    {
      id: "career-growth-tips",
      name: "Career Growth Tips",
      type: "Hashtag • Career",
      icon: Target,
      gradient: "from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600",
    },
  ];


  const suggestedConnections = [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      title: "Senior Developer at TechCorp",
      mutualConnections: 12,
      avatar: null,
    },
    {
      id: "michael-chen",
      name: "Michael Chen",
      title: "Product Manager at StartupXYZ",
      mutualConnections: 8,
      avatar: null,
    },
    {
      id: "emily-davis",
      name: "Emily Davis",
      title: "UX Designer at DesignStudio",
      mutualConnections: 15,
      avatar: null,
    },
  ];


  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };


  const handleShowMoreNews = () => {
    router.push("/news");
  };


  const handleViewAllRecommendations = () => {
    router.push("/feed/recommendations");
  };


  const handleShowAllConnections = () => {
    router.push("/mynetwork/grow");
  };


  const handleFollowFeed = (feedId, feedName) => {
    if (followedFeeds.includes(feedId)) {
      setFollowedFeeds(followedFeeds.filter((id) => id !== feedId));
      console.log(`✅ Unfollowed: ${feedName}`);
    } else {
      setFollowedFeeds([...followedFeeds, feedId]);
      console.log(`✅ Followed: ${feedName}`);
    }
  };


  const handleConnect = (personId, personName) => {
    if (connectionRequests.includes(personId)) {
      setConnectionRequests(connectionRequests.filter((id) => id !== personId));
      console.log(`✅ Connection request withdrawn: ${personName}`);
    } else {
      setConnectionRequests([...connectionRequests, personId]);
      console.log(`✅ Connection request sent to: ${personName}`);
    }
  };


  return (
    <div className="space-y-4">
      {/* ✅ DARK MODE: ProConnect News */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <Info className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
              ProConnect News
            </h4>
          </div>
          <div className="space-y-3">
            {newsItems.map((item, index) => (
              <div
                key={index}
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 -m-2 rounded transition-colors"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1 flex items-center">
                      {item.trending && (
                        <TrendingUp className="h-3 w-3 mr-1 text-orange-500 dark:text-orange-400" />
                      )}
                      {item.title}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handleShowMoreNews}
          >
            Show more
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>


      {/* ✅ DARK MODE: Add to your feed */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Add to your feed</h4>
          <div className="space-y-3">
            {feedSuggestions.map((feed) => {
              const IconComponent = feed.icon;
              const isFollowed = followedFeeds.includes(feed.id);


              return (
                <div key={feed.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${feed.gradient} rounded-full flex items-center justify-center mr-3 shadow-sm`}
                  >
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {feed.name}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feed.type}</p>
                  </div>
                  <Button
                    size="sm"
                    variant={isFollowed ? "default" : "outline"}
                    className={`ml-2 transition-colors ${
                      isFollowed
                        ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                        : "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                    onClick={() => handleFollowFeed(feed.id, feed.name)}
                  >
                    {isFollowed ? (
                      <span className="text-xs">Following</span>
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              );
            })}
          </div>


          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handleViewAllRecommendations}
          >
            View all recommendations
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>


      {/* ✅ DARK MODE: People you may know */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
            People you may know
          </h4>
          <div className="space-y-4">
            {suggestedConnections.map((person) => {
              const isPending = connectionRequests.includes(person.id);


              return (
                <div key={person.id} className="flex items-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3 flex-shrink-0 shadow-sm">
                    {getInitials(person.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {person.name}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 line-clamp-2">
                      {person.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {person.mutualConnections} mutual connections
                    </p>
                    <Button
                      size="sm"
                      variant={isPending ? "default" : "outline"}
                      className={`mt-2 w-full transition-colors ${
                        isPending
                          ? "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600"
                          : "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-600 dark:hover:border-blue-400"
                      }`}
                      onClick={() => handleConnect(person.id, person.name)}
                    >
                      <Users className="h-3 w-3 mr-1" />
                      {isPending ? "Pending" : "Connect"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>


          <Button
            variant="ghost"
            className="w-full mt-3 text-sm text-gray-600 dark:text-gray-400 justify-center hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={handleShowAllConnections}
          >
            Show all
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </CardContent>
      </Card>


      {/* ✅ DARK MODE: Footer */}
      <div className="text-center">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <Link
            href="/about"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            About
          </Link>
          <span>•</span>
          <Link
            href="/accessibility"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Accessibility
          </Link>
          <span>•</span>
          <Link
            href="/help"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Help Center
          </Link>
          <span>•</span>
          <Link
            href="/privacy"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Privacy
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
          >
            Terms
          </Link>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          ProConnect © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
