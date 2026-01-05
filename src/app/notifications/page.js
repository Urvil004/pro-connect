'use client';

import { useState, useEffect } from 'react';
import { 
  Bell,
  UserPlus,
  Heart,
  MessageCircle,
  Briefcase,
  Users,
  TrendingUp,
  Award,
  Calendar,
  CheckCircle2,
  X,
  Check,
  Trash2,
  Filter,
  Settings,
  Star,
  Eye,
  Share2,
  Bookmark,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const sampleNotifications = [
      {
        id: 1,
        type: 'profile_view',
        icon: Eye,
        iconColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        borderColor: 'border-blue-200 dark:border-blue-800',
        title: 'Profile View',
        message: 'Sarah Johnson viewed your profile',
        avatar: 'SJ',
        timestamp: '2 minutes ago',
        isRead: false,
        priority: 'high',
        actionable: true,
        link: '/profile/sarah-johnson',
      },
      {
        id: 2,
        type: 'connection',
        icon: UserPlus,
        iconColor: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-900/30',
        borderColor: 'border-green-200 dark:border-green-800',
        title: 'New Connection Request',
        message: 'Mike Chen wants to connect with you',
        avatar: 'MC',
        timestamp: '15 minutes ago',
        isRead: false,
        priority: 'high',
        actionable: true,
        actions: ['Accept', 'Decline'],
      },
      {
        id: 3,
        type: 'engagement',
        icon: Heart,
        iconColor: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        borderColor: 'border-red-200 dark:border-red-800',
        title: 'Post Engagement',
        message: 'Your post "Web Development Tips" received 25 new likes',
        count: 25,
        timestamp: '1 hour ago',
        isRead: false,
        priority: 'medium',
        link: '/posts/123',
      },
      {
        id: 4,
        type: 'comment',
        icon: MessageCircle,
        iconColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-900/30',
        borderColor: 'border-purple-200 dark:border-purple-800',
        title: 'New Comment',
        message: 'Emma Williams commented on your post',
        comment: 'Great insights! This really helped me.',
        avatar: 'EW',
        timestamp: '2 hours ago',
        isRead: false,
        priority: 'medium',
        actionable: true,
      },
      {
        id: 5,
        type: 'job_alert',
        icon: Briefcase,
        iconColor: 'text-orange-600 dark:text-orange-400',
        bgColor: 'bg-orange-50 dark:bg-orange-900/30',
        borderColor: 'border-orange-200 dark:border-orange-800',
        title: 'Job Match Alert',
        message: 'New job opening matches your profile: Senior Frontend Developer',
        company: 'Tech Innovators',
        timestamp: '3 hours ago',
        isRead: true,
        priority: 'high',
        actionable: true,
        link: '/jobs/456',
      },
      {
        id: 6,
        type: 'achievement',
        icon: Award,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
        borderColor: 'border-yellow-200 dark:border-yellow-800',
        title: 'Achievement Unlocked',
        message: 'You\'ve been featured in "Top Contributors" this month!',
        timestamp: '5 hours ago',
        isRead: true,
        priority: 'low',
        badge: '🏆',
      },
      {
        id: 7,
        type: 'event',
        icon: Calendar,
        iconColor: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-900/30',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
        title: 'Event Reminder',
        message: 'Tech Conference 2025 starts in 2 days',
        timestamp: '1 day ago',
        isRead: true,
        priority: 'medium',
        link: '/events/789',
      },
      {
        id: 8,
        type: 'share',
        icon: Share2,
        iconColor: 'text-cyan-600 dark:text-cyan-400',
        bgColor: 'bg-cyan-50 dark:bg-cyan-900/30',
        borderColor: 'border-cyan-200 dark:border-cyan-800',
        title: 'Content Shared',
        message: 'Your article was shared by 15 people',
        count: 15,
        timestamp: '2 days ago',
        isRead: true,
        priority: 'low',
      },
    ];

    setNotifications(sampleNotifications);
  };

  const tabs = [
    { id: 'all', label: 'All', icon: Bell, count: notifications.length },
    { id: 'unread', label: 'Unread', icon: Sparkles, count: notifications.filter(n => !n.isRead).length },
    { id: 'connections', label: 'Connections', icon: Users, count: notifications.filter(n => n.type === 'connection').length },
    { id: 'engagement', label: 'Engagement', icon: Heart, count: notifications.filter(n => ['engagement', 'comment'].includes(n.type)).length },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, count: notifications.filter(n => n.type === 'job_alert').length },
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'connections') return notification.type === 'connection';
    if (activeTab === 'engagement') return ['engagement', 'comment'].includes(notification.type);
    if (activeTab === 'jobs') return notification.type === 'job_alert';
    return true;
  });

  const handleMarkAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAction = (notificationId, action) => {
    console.log(`Action ${action} on notification ${notificationId}`);
    handleMarkAsRead(notificationId);
  };

  const toggleSelect = (id) => {
    setSelectedNotifications(prev => 
      prev.includes(id) ? prev.filter(nId => nId !== id) : [...prev, id]
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const priorityNotifications = notifications.filter(n => n.priority === 'high' && !n.isRead);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <div className="relative">
                  <Bell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </div>
                Notification Center
              </h1>
              <p className="text-slate-600 dark:text-gray-400 mt-2">Stay updated with your professional network</p>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Priority Alert */}
          {priorityNotifications.length > 0 && (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Priority Notifications</p>
                    <p className="text-sm text-slate-600 dark:text-gray-400">
                      You have {priorityNotifications.length} important notification{priorityNotifications.length !== 1 && 's'} requiring attention
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg'
                      : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 dark:bg-gray-900 dark:text-blue-400'
                        : 'bg-slate-200 dark:bg-gray-700 text-slate-700 dark:text-gray-300'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = notification.icon;
            const isSelected = selectedNotifications.includes(notification.id);

            return (
              <div
                key={notification.id}
                className={`bg-white dark:bg-gray-800 rounded-xl border-2 transition-all duration-300 hover:shadow-xl ${
                  notification.isRead 
                    ? 'border-slate-200 dark:border-gray-700 opacity-75' 
                    : `${notification.borderColor} shadow-lg`
                } ${isSelected ? 'ring-4 ring-blue-200 dark:ring-blue-800' : ''}`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 ${notification.bgColor} rounded-xl flex items-center justify-center ${
                      !notification.isRead && 'animate-pulse'
                    }`}>
                      <Icon className={`w-6 h-6 ${notification.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{notification.title}</h3>
                          {!notification.isRead && (
                            <span className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                          )}
                          {notification.priority === 'high' && (
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 text-xs font-bold rounded-full">
                              Priority
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 dark:text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {notification.timestamp}
                          </span>
                          <button className="p-1 hover:bg-slate-100 dark:hover:bg-gray-700 rounded transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                          </button>
                        </div>
                      </div>

                      <p className="text-slate-700 dark:text-gray-300 mb-3">{notification.message}</p>

                     {/* Comment Section */}
{notification.comment && (
  <div className="bg-slate-50 dark:bg-gray-900/50 rounded-lg p-3 mb-3 border-l-4 border-purple-400 dark:border-purple-600">
    <p className="text-sm text-slate-600 dark:text-gray-400 italic">&quot;{notification.comment}&quot;</p>
  </div>
)}

                      {/* Avatar */}
                      {notification.avatar && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-lg flex items-center justify-center text-white font-semibold text-xs">
                            {notification.avatar}
                          </div>
                        </div>
                      )}

                      {/* Badge */}
                      {notification.badge && (
                        <div className="text-3xl mb-3">{notification.badge}</div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {notification.actionable && notification.actions && (
                          <>
                            {notification.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleAction(notification.id, action)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                                  index === 0
                                    ? 'bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105'
                                    : 'bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600'
                                }`}
                              >
                                {action}
                              </button>
                            ))}
                          </>
                        )}

                        {notification.link && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-all text-sm"
                          >
                            View Details
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="ml-auto flex items-center gap-1.5 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all text-sm font-medium"
                          >
                            <Check className="w-4 h-4" />
                            Mark as read
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all text-sm font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-16 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Your all caught up! 🎉</h3>
            <p className="text-slate-600 dark:text-gray-400">No new notifications in this category</p>
          </div>
        )}

        {/* Activity Summary */}
        {notifications.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Activity Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Total Notifications</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{notifications.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Unread</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unreadCount}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Priority</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{priorityNotifications.length}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-slate-600 dark:text-gray-400 mb-1">Connections</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {notifications.filter(n => n.type === 'connection').length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
