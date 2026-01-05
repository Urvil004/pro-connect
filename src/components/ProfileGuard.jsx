"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";


export function useProfileGuard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);


  useEffect(() => {
    const checkProfile = async () => {
      if (!user || loading) return;


      try {
        const response = await fetch(`/api/users/${user.uid}`);


        if (response.ok) {
          const userData = await response.json();
          console.log("ProfileGuard - User data:", userData);


          // Check if profile is complete - all required fields must be present
          const isComplete = !!(
            userData.name &&
            userData.headline &&
            userData.profilePicture &&
            userData.isProfileComplete === true
          );


          console.log("ProfileGuard - Profile complete:", isComplete);
          setProfileComplete(isComplete);


          if (!isComplete) {
            console.log("ProfileGuard - Redirecting to profile completion");
            router.push("/profile/complete");
          }
        } else {
          console.log(
            "ProfileGuard - User not found, redirecting to profile completion"
          );
          router.push("/profile/complete");
        }
      } catch (error) {
        console.error("ProfileGuard - Error checking profile:", error);
        router.push("/profile/complete");
      } finally {
        setProfileLoading(false);
      }
    };


    if (user && !loading) {
      checkProfile();
    } else if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);


  return { profileLoading, profileComplete };
}


export function ProfileGuard({ children }) {
  const { profileLoading, profileComplete, user } = useProfileGuard();


  // ✅ DARK MODE: Loading State
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          {/* Enhanced Spinner with Center Dot */}
          <div className="relative inline-block mb-4">
            {/* Outer Ring */}
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400 mx-auto"></div>
            {/* Pulsing Center Dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading Text with Animation */}
          <p className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
            Verifying your profile...
          </p>
          
          {/* Additional Loading Indicator */}
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }


  if (!user) {
    return null; // Will redirect to login
  }


  if (!profileComplete) {
    return null; // Will redirect to profile completion
  }


  return children;
}
