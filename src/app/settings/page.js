"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDarkMode } from "@/context/DarkModeContext"; // ✅ Import dark mode context
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Globe,
  Shield,
  Smartphone,
  Mail,
  UserCheck,
  Download,
  Trash2,
  LogOut,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  Key,
  Database,
  Users,
  MessageSquare,
  Zap,
  Monitor,
  Briefcase,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode(); // ✅ Use dark mode context
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [messageRequests, setMessageRequests] = useState("everyone");
  const [searchEngineIndexing, setSearchEngineIndexing] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const showSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    showSaveSuccess();
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Delete account");
    }
  };

  const handleDownloadData = () => {
    console.log("Download data");
  };

  const tabs = [
    { id: "account", label: "Account", icon: UserCheck },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display", icon: Monitor },
    { id: "security", label: "Security", icon: Shield },
    { id: "data", label: "Data & Privacy", icon: Database },
  ];

  if (!user) {
    router.push("/auth/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-5 duration-300">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Settings saved successfully!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="dark:text-gray-300 dark:hover:bg-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <SettingsIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  Settings & Privacy
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              {loading ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeTab === tab.id
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <IconComponent className="h-5 w-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="public">Public</option>
                        <option value="connections">Connections Only</option>
                        <option value="private">Private</option>
                      </select>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Control who can see your profile information
                      </p>
                    </div>

                    {/* Activity Status */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Show Activity Status
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Let others see when your online
                        </p>
                      </div>
                      <button
                        onClick={() => setActivityStatus(!activityStatus)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          activityStatus ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            activityStatus ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Search Engine Indexing */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Search Engine Indexing
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Allow search engines to show your profile
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setSearchEngineIndexing(!searchEngineIndexing)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          searchEngineIndexing ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            searchEngineIndexing
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Email Settings */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            Email Address
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {user.email}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                          >
                            Change Email
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Settings */}
            {activeTab === "privacy" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Privacy Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Who can send messages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Who can send you messages?
                      </label>
                      <select
                        value={messageRequests}
                        onChange={(e) => setMessageRequests(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="everyone">Everyone</option>
                        <option value="connections">
                          Connections and 2nd-degree connections
                        </option>
                        <option value="connections-only">
                          Connections Only
                        </option>
                      </select>
                    </div>

                    {/* Read Receipts */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          Read Receipts
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Let others know when you have read their messages
                        </p>
                      </div>
                      <button
                        onClick={() => setReadReceipts(!readReceipts)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          readReceipts ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            readReceipts ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Blocking & Hiding */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Blocking and Hiding
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage blocked accounts and hidden content
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                          <Users className="h-4 w-4 mr-2" />
                          Manage Blocked Accounts (0)
                        </Button>
                        <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hidden Content (0)
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </h2>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive updates via email
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setEmailNotifications(!emailNotifications)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailNotifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          Push Notifications
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Receive notifications on your device
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setPushNotifications(!pushNotifications)
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          pushNotifications ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            pushNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Notification Types */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                        Notification Types
                      </h3>
                      <div className="space-y-3">
                        {[
                          {
                            label: "Connection requests",
                            icon: Users,
                            enabled: true,
                          },
                          {
                            label: "Messages",
                            icon: MessageSquare,
                            enabled: true,
                          },
                          {
                            label: "Post interactions",
                            icon: Zap,
                            enabled: true,
                          },
                          {
                            label: "Job alerts",
                            icon: Briefcase,
                            enabled: false,
                          },
                        ].map((item, idx) => {
                          const IconComponent = item.icon;
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <IconComponent className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                {item.label}
                              </div>
                              <input
                                type="checkbox"
                                defaultChecked={item.enabled}
                                className="w-4 h-4 text-blue-600 rounded"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Display Settings */}
            {activeTab === "display" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Display Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Dark Mode - Main Feature */}
                    <div className="p-6 bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-800 dark:to-blue-800 rounded-xl text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                            {darkMode ? (
                              <Moon className="h-5 w-5" />
                            ) : (
                              <Sun className="h-5 w-5" />
                            )}
                            {darkMode ? "Dark Mode" : "Light Mode"}
                          </h3>
                          <p className="text-sm text-gray-300">
                            {darkMode
                              ? "Switch to light mode for a brighter interface"
                              : "Switch to dark mode to reduce eye strain"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            toggleDarkMode();
                            showSaveSuccess();
                          }}
                          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                            darkMode ? "bg-blue-500" : "bg-gray-400"
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform flex items-center justify-center ${
                              darkMode ? "translate-x-7" : "translate-x-1"
                            }`}
                          >
                            {darkMode ? (
                              <Moon className="h-3 w-3 text-gray-900" />
                            ) : (
                              <Sun className="h-3 w-3 text-gray-900" />
                            )}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Theme Preview */}
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        onClick={() => !darkMode ? null : toggleDarkMode()}
                        className={`p-4 border-2 rounded-lg transition cursor-pointer ${
                          !darkMode 
                            ? 'border-blue-500 dark:border-blue-400' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                        }`}
                      >
                        <div className="aspect-video bg-white rounded-md mb-2 border dark:border-gray-600 flex items-center justify-center">
                          <Sun className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-center dark:text-gray-300">
                          Light Mode
                        </p>
                      </div>
                      <div 
                        onClick={() => darkMode ? null : toggleDarkMode()}
                        className={`p-4 border-2 rounded-lg transition cursor-pointer ${
                          darkMode 
                            ? 'border-blue-500 dark:border-blue-400' 
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                        }`}
                      >
                        <div className="aspect-video bg-gray-900 rounded-md mb-2 border dark:border-gray-700 flex items-center justify-center">
                          <Moon className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-medium text-center dark:text-gray-300">
                          Dark Mode
                        </p>
                      </div>
                    </div>

                    {/* Display Density */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Display Density
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                        <option>Comfortable (Default)</option>
                        <option>Compact</option>
                        <option>Spacious</option>
                      </select>
                    </div>

                    {/* Font Size */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Font Size
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="18"
                        defaultValue="14"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="p-4 border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Key className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <button
                          onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            twoFactorAuth ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              twoFactorAuth ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                      {twoFactorAuth && (
                        <Button size="sm" variant="outline" className="mt-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                          Configure 2FA
                        </Button>
                      )}
                    </div>

                    {/* Change Password */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Change Password
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Update your password regularly to keep your account secure
                      </p>
                      <Button variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
                        <Key className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>

                    {/* Active Sessions */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Active Sessions
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Manage devices where your currently logged in
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Monitor className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <div>
                              <p className="text-sm font-medium dark:text-white">
                                Current Device
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                Last active: Now
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Active
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        Sign out all other sessions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Data & Privacy */}
            {activeTab === "data" && (
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data & Privacy
                  </h2>

                  <div className="space-y-6">
                    {/* Download Data */}
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Download Your Data
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Request a copy of all your data on ProConnect
                      </p>
                      <Button
                        variant="outline"
                        onClick={handleDownloadData}
                        className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Request Data Download
                      </Button>
                    </div>

                    {/* Data Retention */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                        Data Retention
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your data is stored securely and retained according to our privacy policy
                      </p>
                    </div>

                    {/* Delete Account */}
                    <div className="p-4 border-2 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-900 dark:text-red-400 mb-2">
                            Delete Account
                          </h3>
                          <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          <Button
                            variant="outline"
                            onClick={handleDeleteAccount}
                            className="border-red-600 dark:border-red-500 text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-500"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete My Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
