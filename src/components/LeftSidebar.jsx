"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "./Card";
import { Button } from "./Button";
import {
  User,
  Eye,
  BarChart3,
  Bookmark,
  Users,
  Mail,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function LeftSidebar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    profileViews: 0,
    postImpressions: 0,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      // Generate some random stats for demo
      setStats({
        profileViews: Math.floor(Math.random() * 100) + 50,
        postImpressions: Math.floor(Math.random() * 500) + 200,
      });
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user || !profile) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ✅ FIXED: Profile Card with User's Banner Image */}
      <Card className="overflow-hidden">
        {/* ✅ NEW: Display user's banner image or fallback to gradient */}
        <div className="h-16 relative">
          {profile.bannerImage ? (
            <Image
              src={profile.bannerImage}
              alt="Profile Banner"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-500 dark:to-cyan-500"></div>
          )}
        </div>

        <CardContent className="p-6 -mt-8">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                  {getInitials(profile.name)}
                </div>
              )}
            </div>
            <Link href={`/profile/${user.uid}`} className="hover:underline">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {profile.name}
              </h3>
            </Link>
            {profile.headline && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{profile.headline}</p>
            )}
          </div>

          {/* ✅ DARK MODE: Stats Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Profile viewers
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.profileViews}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Post impressions
              </span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.postImpressions}
              </span>
            </div>
          </div>

          {/* ✅ DARK MODE: Saved Items Link */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <Link href="/saved">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white p-2 transition-colors"
              >
                <Bookmark className="h-4 w-4 mr-3" />
                Saved items
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ✅ DARK MODE: Recent Links Card */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Recent</h4>
          <div className="space-y-2">
            <Link href="/groups" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white p-2 transition-colors"
              >
                <Users className="h-4 w-4 mr-3" />
                Groups
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/newsletters" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white p-2 transition-colors"
              >
                <Mail className="h-4 w-4 mr-3" />
                Newsletters
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
            <Link href="/events" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white p-2 transition-colors"
              >
                <Calendar className="h-4 w-4 mr-3" />
                Events
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* ✅ DARK MODE: Discover More Card */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Discover</h4>
          <div className="space-y-2">
            <Link href="https://www.w3schools.com/js/" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 transition-colors font-medium"
              >
                # JavaScript
              </Button>
            </Link>
            <Link href="https://www.w3schools.com/REACT/DEFAULT.ASP" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 transition-colors font-medium"
              >
                # React
              </Button>
            </Link>
            <Link href="https://www.w3schools.com/whatis/" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-2 transition-colors font-medium"
              >
                # WebDevelopment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}