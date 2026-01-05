"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  BookOpen,
  Award,
  Target,
  Briefcase,
  Code,
  Lightbulb,
  TrendingUp,
  Users,
  Hash,
  Bell,
  Plus,
  Check,
} from "lucide-react";


export default function RecommendationsPage() {
  const [followedItems, setFollowedItems] = useState([]);


  const recommendations = [
    {
      id: "tech-learning-hub",
      name: "Tech Learning Hub",
      type: "Company",
      category: "Technology",
      icon: BookOpen,
      gradient: "from-blue-500 to-purple-500",
      followers: "125K",
      description:
        "Learn the latest in web development, AI, and software engineering with expert-led courses and tutorials.",
    },
    {
      id: "startup-success",
      name: "Startup Success",
      type: "Newsletter",
      category: "Business",
      icon: Award,
      gradient: "from-green-500 to-blue-500",
      followers: "89K",
      description:
        "Weekly insights on building successful startups, fundraising strategies, and entrepreneurship tips.",
    },
    {
      id: "career-growth-tips",
      name: "Career Growth Tips",
      type: "Hashtag",
      category: "Career",
      icon: Target,
      gradient: "from-orange-500 to-red-500",
      followers: "210K",
      description:
        "Expert advice on advancing your career, negotiating salaries, and professional development strategies.",
    },
    {
      id: "web-developers-community",
      name: "Web Developers Community",
      type: "Group",
      category: "Technology",
      icon: Code,
      gradient: "from-cyan-500 to-blue-500",
      followers: "156K",
      description:
        "Connect with fellow web developers, share projects, and stay updated on the latest frameworks and tools.",
    },
    {
      id: "innovation-digest",
      name: "Innovation Digest",
      type: "Newsletter",
      category: "Innovation",
      icon: Lightbulb,
      gradient: "from-yellow-500 to-orange-500",
      followers: "94K",
      description:
        "Daily updates on breakthrough innovations, emerging technologies, and disruptive ideas shaping the future.",
    },
    {
      id: "product-management-pro",
      name: "Product Management Pro",
      type: "Company",
      category: "Product",
      icon: Briefcase,
      gradient: "from-purple-500 to-pink-500",
      followers: "78K",
      description:
        "Master product management with case studies, frameworks, and insights from top product leaders.",
    },
    {
      id: "ai-ml-revolution",
      name: "AI & ML Revolution",
      type: "Hashtag",
      category: "Technology",
      icon: TrendingUp,
      gradient: "from-indigo-500 to-purple-500",
      followers: "187K",
      description:
        "Stay ahead in artificial intelligence and machine learning with cutting-edge research and applications.",
    },
    {
      id: "leadership-excellence",
      name: "Leadership Excellence",
      type: "Newsletter",
      category: "Leadership",
      icon: Users,
      gradient: "from-rose-500 to-red-500",
      followers: "112K",
      description:
        "Develop leadership skills with actionable insights from executives and organizational psychology experts.",
    },
  ];


  const handleFollow = (itemId) => {
    if (followedItems.includes(itemId)) {
      setFollowedItems(followedItems.filter((id) => id !== itemId));
    } else {
      setFollowedItems([...followedItems, itemId]);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Feed Recommendations
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discover content tailored to your interests
              </p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>


      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {followedItems.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {recommendations.length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Recommendations</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">8</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
            </CardContent>
          </Card>
        </div>


        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((item) => {
            const IconComponent = item.icon;
            const isFollowed = followedItems.includes(item.id);


            return (
              <Card
                key={item.id}
                className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>


                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.type} • {item.category}
                          </p>
                        </div>
                      </div>


                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {item.description}
                      </p>


                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          {item.followers} followers
                        </div>


                        <Button
                          size="sm"
                          variant={isFollowed ? "default" : "outline"}
                          className={
                            isFollowed
                              ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-md"
                              : "hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 dark:border-gray-600"
                          }
                          onClick={() => handleFollow(item.id)}
                        >
                          {isFollowed ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Following
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Follow
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
