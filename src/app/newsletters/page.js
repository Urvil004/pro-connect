"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ArrowLeft, Mail, Search, Check, Bell } from "lucide-react";
import Link from "next/link";


export default function NewslettersPage() {
  const [searchQuery, setSearchQuery] = useState("");


  const subscribedNewsletters = [
    {
      id: 1,
      name: "Tech Weekly",
      author: "Sarah Johnson",
      subscribers: "125K subscribers",
      description: "Weekly insights on the latest in technology and innovation",
      frequency: "Every Monday",
      subscribed: true,
    },
    {
      id: 2,
      name: "Startup Success",
      author: "Michael Chen",
      subscribers: "89K subscribers",
      description: "Stories and strategies from successful startup founders",
      frequency: "Twice a week",
      subscribed: true,
    },
  ];


  const recommendedNewsletters = [
    {
      id: 3,
      name: "Code & Coffee",
      author: "Emily Davis",
      subscribers: "67K subscribers",
      description: "Daily programming tips and best practices",
      frequency: "Daily",
      subscribed: false,
    },
    {
      id: 4,
      name: "Design Digest",
      author: "Alex Martinez",
      subscribers: "54K subscribers",
      description: "UI/UX design trends and inspiration",
      frequency: "Weekly",
      subscribed: false,
    },
    {
      id: 5,
      name: "Data Science Daily",
      author: "Dr. Lisa Wang",
      subscribers: "92K subscribers",
      description: "Latest in AI, ML, and data analytics",
      frequency: "Every weekday",
      subscribed: false,
    },
  ];


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Newsletters</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and subscribe to expert insights delivered to your inbox
          </p>
        </div>


        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search newsletters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>


        {/* Subscribed */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Your Subscriptions ({subscribedNewsletters.length})
          </h2>
          <div className="space-y-4">
            {subscribedNewsletters.map((newsletter) => (
              <Card key={newsletter.id} className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                        <Mail className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {newsletter.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          by {newsletter.author}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {newsletter.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{newsletter.subscribers}</span>
                          <span>•</span>
                          <span>{newsletter.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="ml-4 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Subscribed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        {/* Recommended */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Recommended for You
          </h2>
          <div className="space-y-4">
            {recommendedNewsletters.map((newsletter) => (
              <Card key={newsletter.id} className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-400 dark:to-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                        <Mail className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {newsletter.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          by {newsletter.author}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {newsletter.description}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <span>{newsletter.subscribers}</span>
                          <span>•</span>
                          <span>{newsletter.frequency}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="ml-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
