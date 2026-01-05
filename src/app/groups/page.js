"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ArrowLeft, Users, Search, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";


export default function GroupsPage() {
  const [searchQuery, setSearchQuery] = useState("");


  const myGroups = [
    {
      id: 1,
      name: "Web Developers Community",
      members: "45.2K members",
      description: "A community for web developers to share knowledge and collaborate",
      image: null,
      activity: "5 new posts today",
    },
    {
      id: 2,
      name: "React Developers",
      members: "32.8K members",
      description: "Everything about React.js, Next.js, and modern frontend development",
      image: null,
      activity: "12 new posts today",
    },
  ];


  const suggestedGroups = [
    {
      id: 3,
      name: "JavaScript Enthusiasts",
      members: "67.5K members",
      description: "For JavaScript lovers - from basics to advanced topics",
      image: null,
    },
    {
      id: 4,
      name: "Full Stack Engineers",
      members: "28.3K members",
      description: "Full stack development discussions and resources",
      image: null,
    },
    {
      id: 5,
      name: "Node.js Developers",
      members: "41.2K members",
      description: "Backend development with Node.js and related technologies",
      image: null,
    },
  ];


  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };


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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Groups</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>


        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>


        {/* My Groups */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            My Groups ({myGroups.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                      {getInitials(group.name)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {group.members}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        {group.description}
                      </p>
                      <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {group.activity}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      className="w-full" 
                      variant="outline"
                    >
                      View Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>


        {/* Suggested Groups */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Suggested for You
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedGroups.map((group) => (
              <Card key={group.id} className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 dark:from-green-400 dark:to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg">
                      {getInitials(group.name)}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {group.members}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      {group.description}
                    </p>
                    <Button 
                      className="w-full" 
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Join Group
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
