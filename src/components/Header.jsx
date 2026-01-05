"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { getInitials } from "@/lib/utils";
import { SearchResults } from "./SearchResults";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Menu,
  X,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Plus,
} from "lucide-react";


export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [currentProfile, setCurrentProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasMessages, setHasMessages] = useState(true);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);


  const debouncedSearchQuery = useDebounce(searchQuery, 300);


  useEffect(() => {
    const fetchCurrentProfile = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/users/${user.uid}`);
          if (response.ok) {
            const userData = await response.json();
            setCurrentProfile(userData);
          }
        } catch (error) {
          console.error("Error fetching current profile:", error);
        }
      }
    };


    fetchCurrentProfile();
  }, [user]);


  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setSearchResults(null);
        setShowSearchResults(false);
        setSearchLoading(false);
        return;
      }


      setSearchLoading(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        if (response.ok) {
          const results = await response.json();
          setSearchResults(results);
          setShowSearchResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults(null);
      } finally {
        setSearchLoading(false);
      }
    };


    performSearch();
  }, [debouncedSearchQuery]);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };


    if (isProfileDropdownOpen || showSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }


    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileDropdownOpen, showSearchResults]);


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };


    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowSearchResults(false);
        setSearchQuery("");
      }
    };


    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);


  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const handleSettingsClick = () => {
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push('/settings');
  };


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };


  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);


    if (value.trim().length >= 2) {
      setSearchLoading(true);
    }
  };


  const handleSearchFocus = () => {
    if (searchQuery.trim().length >= 2 && searchResults) {
      setShowSearchResults(true);
    }
  };


  const closeSearchResults = () => {
    setShowSearchResults(false);
  };


  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };


  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Users, label: "My Network", href: "/network" },
    { icon: Briefcase, label: "Jobs", href: "/jobs" },
    {
      icon: MessageSquare,
      label: "Messaging",
      href: "/messages",
      hasIndicator: hasMessages,
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      hasIndicator: hasNotifications,
      hasBlinking: true,
    },
  ];


  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };


  return (
    <>
      {/* ✅ DARK MODE: Header with dark background and border */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/95 dark:bg-gray-900/95 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* ✅ DARK MODE: Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="hidden sm:block font-bold text-xl text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  ProConnect
                </span>
              </Link>
            </div>


            {/* ✅ DARK MODE: Search Bar */}
            <div
              className="flex-1 max-w-2xl mx-4 lg:mx-8 relative"
              ref={searchRef}
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5 transition-colors duration-200 ${
                      searchLoading
                        ? "text-blue-500 dark:text-blue-400 animate-pulse"
                        : "text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search for people, jobs, companies..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchFocus}
                  className="block w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border-0 rounded-full text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg text-gray-900 dark:text-white"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>


              <SearchResults
                results={searchResults}
                isVisible={showSearchResults}
                onClose={closeSearchResults}
                searchQuery={searchQuery}
                loading={searchLoading}
              />
            </div>


            {/* ✅ DARK MODE: Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {user && (
                <>
                  {/* Navigation Items */}
                  {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link key={item.label} href={item.href}>
                        <div
                          className={`relative group rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                            active ? "bg-blue-50 dark:bg-blue-900/30" : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              <div className="relative">
                                <item.icon
                                  className={`h-4 w-4 mr-2 ${
                                    active
                                      ? "text-blue-600 dark:text-blue-400"
                                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                                  } transition-colors duration-200`}
                                />


                                {item.hasIndicator && (
                                  <div className="absolute -top-1 -right-0.5 flex items-center justify-center">
                                    <span className="relative h-2 w-2 bg-red-500 rounded-full z-10"></span>


                                    {item.hasBlinking && (
                                      <>
                                        <span className="absolute h-2 w-2 rounded-full animate-ping bg-red-400 opacity-75"></span>
                                        <span className="absolute h-2.5 w-2.5 rounded-full animate-pulse bg-red-500 opacity-50"></span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>


                              <span
                                className={`text-xs font-medium ${
                                  active
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
                                } transition-colors duration-200`}
                              >
                                {item.label}
                              </span>
                            </Button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}


                  {/* ✅ DARK MODE: Profile Dropdown */}
                  <div className="relative ml-3" ref={dropdownRef}>
                    <button
                      onClick={toggleProfileDropdown}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-300 dark:group-hover:border-blue-600 transition-colors duration-200">
                        {currentProfile?.profilePicture ? (
                          <img
                            src={currentProfile.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                            {getInitials(
                              currentProfile?.name ||
                                user?.displayName ||
                                user?.email ||
                                "U"
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors duration-200">
                          Me
                        </span>
                        <ChevronDown className="h-3 w-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
                      </div>
                    </button>


                    {/* ✅ DARK MODE: Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-3 z-50 animate-in fade-in duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                              {currentProfile?.profilePicture ? (
                                <img
                                  src={currentProfile.profilePicture}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                                  {getInitials(
                                    currentProfile?.name ||
                                      user?.displayName ||
                                      user?.email ||
                                      "U"
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                {currentProfile?.name ||
                                  user?.displayName ||
                                  "User"}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {currentProfile?.headline || "Professional"}
                              </p>
                            </div>
                          </div>
                        </div>


                        <div className="py-2">
                          <Link href={`/profile/${user.uid}`}>
                            <button 
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                            >
                              <User className="h-5 w-5 mr-3" />
                              View Profile
                            </button>
                          </Link>
                          <button 
                            onClick={handleSettingsClick}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200"
                          >
                            <Settings className="h-5 w-5 mr-3" />
                            Settings & Privacy
                          </button>
                        </div>


                        <div className="border-t border-gray-100 dark:border-gray-700 py-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                          >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}


              {!user && (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-6 py-2 rounded-full transition-all duration-200"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl">
                      Join now
                    </Button>
                  </Link>
                </div>
              )}
            </nav>


            {/* ✅ DARK MODE: Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>


      {/* ✅ DARK MODE: Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />


          <div className="fixed inset-y-0 right-0 flex flex-col w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>


            <div className="flex-1 overflow-y-auto">
              {user ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-white dark:border-gray-700 shadow-lg">
                        {currentProfile?.profilePicture ? (
                          <img
                            src={currentProfile.profilePicture}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                            {getInitials(
                              currentProfile?.name ||
                                user?.displayName ||
                                user?.email ||
                                "U"
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                          {currentProfile?.name || user?.displayName || "User"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {currentProfile?.headline || "Professional"}
                        </p>
                        <Link href={`/profile/${user.uid}`}>
                          <span 
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer"
                          >
                            View Profile
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>


                  <div className="py-4">
                    {navItems.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <item.icon
                                  className={`h-6 w-6 ${
                                    active ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
                                  }`}
                                />


                                {item.hasIndicator && (
                                  <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
                                    <span className="relative h-2.5 w-2.5 bg-red-500 rounded-full z-10"></span>


                                    {item.hasBlinking && (
                                      <>
                                        <span className="absolute h-2.5 w-2.5 rounded-full animate-ping bg-red-400 opacity-75"></span>
                                        <span className="absolute h-3 w-3 rounded-full animate-pulse bg-red-500 opacity-50"></span>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                              <span
                                className={`text-base font-medium ${
                                  active ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"
                                }`}
                              >
                                {item.label}
                              </span>
                            </div>
                            {active && (
                              <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>


                  <div className="py-4 border-t border-gray-200 dark:border-gray-800">
                    <button 
                      onClick={handleSettingsClick}
                      className="flex items-center w-full px-6 py-4 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-4" />
                      Settings & Privacy
                    </button>


                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-6 py-4 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all duration-200"
                    >
                      <LogOut className="h-6 w-6 mr-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-6 space-y-4">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="w-full justify-center font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 py-3 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button
                      className="w-full justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded-xl"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Join now
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
