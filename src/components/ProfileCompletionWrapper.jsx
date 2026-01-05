"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";


export function ProfileCompletionWrapper({ children }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [profileComplete, setProfileComplete] = useState(null);
  const [loading, setLoading] = useState(true);


  // Pages that don't require profile completion
  const allowedPaths = ["/auth/login", "/auth/register", "/profile/complete"];


  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }


    // Skip check for allowed paths
    if (allowedPaths.some((path) => pathname.startsWith(path))) {
      setLoading(false);
      return;
    }


    checkProfileCompletion();
  }, [user, pathname]);


  const checkProfileCompletion = async () => {
    try {
      const response = await fetch(`/api/users/${user.uid}`);
      if (response.ok) {
        const userData = await response.json();
        setProfileComplete(userData.isProfileComplete);


        // Redirect to profile completion if not complete
        if (!userData.isProfileComplete) {
          router.push("/profile/complete");
          return;
        }
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
    } finally {
      setLoading(false);
    }
  };


  // ✅ DARK MODE: Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          {/* Animated Spinner */}
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
            {/* Pulsing Center Dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading Text */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }


  return children;
}
