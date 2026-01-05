'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquare, 
  Search,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Star,
  Archive,
  Trash2,
  Check,
  CheckCheck,
  Circle,
  Mic,
  Image as ImageIcon,
  File,
  X,
  Filter,
  Sparkles,
  Clock,
  Pin,
  Zap,
  TrendingUp,
  Users,
  Bot,
  Loader2
} from 'lucide-react';

export default function MessagingPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // ✅ FIX: Track if we've handled URL params
  const [urlParamsHandled, setUrlParamsHandled] = useState(false);

  // Get URL parameters
  const urlUserId = searchParams.get('userId');
  const urlUserName = searchParams.get('userName');

  // Helper function
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ FIX: Handle URL parameters IMMEDIATELY when they exist
  useEffect(() => {
    if (urlUserId && urlUserName && !urlParamsHandled && user) {
      console.log('🎯 URL params detected:', { urlUserId, urlUserName });
      
      // Create new conversation immediately
      const newConv = {
        id: `new_${urlUserId}`,
        userId: urlUserId,
        name: decodeURIComponent(urlUserName),
        avatar: getInitials(decodeURIComponent(urlUserName)),
        lastMessage: 'Start a conversation',
        timestamp: 'Now',
        unread: 0,
        online: true,
        category: 'professional',
        isNew: true,
      };
      
      console.log('✅ Creating new conversation:', newConv);
      
      setConversations([newConv]);
      setActiveConversation(newConv);
      setMessages([]);
      setUrlParamsHandled(true);
      setLoading(false);
      
      // Generate AI suggestions
      generateAISuggestions();
    }
  }, [urlUserId, urlUserName, user, urlParamsHandled]);

  // Load existing conversations (only if no URL params)
  useEffect(() => {
    if (user && !urlUserId && !urlUserName) {
      loadConversations();
    }
  }, [user, urlUserId, urlUserName]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log('📨 Loading conversations for user:', user.uid);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/conversations/${user.uid}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Conversations loaded:', data);
        
        const formattedConversations = data.map(conv => ({
          id: conv._id,
          userId: conv.lastMessage.senderId === user.uid 
            ? conv.lastMessage.receiverId 
            : conv.lastMessage.senderId,
          name: conv.lastMessage.senderName,
          avatar: getInitials(conv.lastMessage.senderName),
          lastMessage: conv.lastMessage.content,
          timestamp: formatTimestamp(conv.lastMessage.createdAt),
          unread: conv.unreadCount || 0,
          online: false,
          category: 'professional',
        }));

        setConversations(formattedConversations);
      } else {
        console.log('📭 No conversations yet');
        setConversations([]);
      }
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString();
  };

  const loadMessages = async (conversation) => {
    if (!user || !conversation.userId) return;

    try {
      console.log('💬 Loading messages with:', conversation.userId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/messages/conversation/${user.uid}/${conversation.userId}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Messages loaded:', data.length);
        
        const formattedMessages = data.map(msg => ({
          id: msg._id,
          senderId: msg.senderId === user.uid ? 'me' : msg.senderId,
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: msg.status || 'sent',
          reactions: [],
        }));

        setMessages(formattedMessages);
      } else {
        console.log('📭 No messages yet');
        setMessages([]);
      }
    } catch (error) {
      console.error('❌ Error loading messages:', error);
      setMessages([]);
    }

    scrollToBottom();
  };

  const handleConversationClick = (conversation) => {
    console.log('🎯 Opening conversation with:', conversation.name);
    setActiveConversation(conversation);
    loadMessages(conversation);
    
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversation.id ? { ...conv, unread: 0 } : conv
    ));

    generateAISuggestions();
  };

  const generateAISuggestions = () => {
    const suggestions = [
      "Hi! How are you?",
      "Thanks for connecting!",
      "Let's discuss this further.",
    ];
    setAiSuggestions(suggestions);
  };

  const handleSendMessage = async (content = newMessage) => {
    if (!content.trim() || !activeConversation || !user) return;

    setSendingMessage(true);

    try {
      console.log('📤 Sending message to:', activeConversation.userId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.uid,
          senderName: user.displayName || user.email,
          receiverId: activeConversation.userId,
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Message sent:', data);

        const newMsg = {
          id: data.data._id,
          senderId: 'me',
          content: content.trim(),
          timestamp: new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: 'sent',
          reactions: [],
        };

        setMessages(prev => [...prev, newMsg]);
        setNewMessage('');
        setAiSuggestions([]);

        // Update conversation last message
        setConversations(prev => prev.map(conv => 
          conv.id === activeConversation?.id 
            ? { ...conv, lastMessage: content.trim(), timestamp: 'Just now' }
            : conv
        ));

        scrollToBottom();
      } else {
        const error = await response.json();
        console.error('❌ Send failed:', error);
        alert(error.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r => 
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            ),
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }],
          };
        }
      }
      return msg;
    }));
  };

  const filterCategories = [
    { id: 'all', label: 'All Chats', icon: MessageSquare },
    { id: 'professional', label: 'Professional', icon: Users },
    { id: 'pinned', label: 'Pinned', icon: Pin },
  ];

  const filteredConversations = conversations.filter(conv => {
    if (searchQuery && !conv.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (activeFilter === 'all') return true;
    if (activeFilter === 'pinned') return conv.isPinned;
    return conv.category === activeFilter;
  });

  const quickReplies = [
    'Thank you!',
    "I'll get back to you soon",
    'Sounds good!',
    'Can we schedule a call?',
  ];

  const emojis = ['😊', '👍', '❤️', '🎉', '🔥', '👏', '💯', '🚀'];

  if (!user) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-gray-400">Please log in to access messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 flex flex-col transition-colors duration-300">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Professional Messaging</h1>
          <p className="text-slate-600 dark:text-gray-400 mt-1">Connect and collaborate with your network</p>
        </div>

        {/* Main Container */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-slate-200 dark:border-gray-700 overflow-hidden flex">
          {/* Conversations List */}
          <div className="w-80 border-r border-slate-200 dark:border-gray-700 flex flex-col bg-slate-50 dark:bg-gray-900">
            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-gray-900 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filterCategories.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      activeFilter === filter.id
                        ? 'bg-blue-600 dark:bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <filter.icon className="w-3.5 h-3.5" />
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-gray-400">Loading conversations...</p>
                </div>
              ) : filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className={`p-4 border-b border-slate-200 dark:border-gray-700 cursor-pointer transition-all hover:bg-white dark:hover:bg-gray-800 ${
                      activeConversation?.id === conversation.id ? 'bg-white dark:bg-gray-800 border-l-4 border-l-blue-600 dark:border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                          {conversation.avatar}
                        </div>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-900 rounded-full"></div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                              {conversation.name}
                            </h3>
                            {conversation.isPinned && <Pin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                          </div>
                          <span className="text-xs text-slate-500 dark:text-gray-500">{conversation.timestamp}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600 dark:text-gray-400 truncate pr-2">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread > 0 && (
                            <span className="flex-shrink-0 bg-blue-600 dark:bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                              {conversation.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-slate-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-gray-400">No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                          {activeConversation.avatar}
                        </div>
                        {activeConversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h2 className="font-semibold text-slate-900 dark:text-white">{activeConversation.name}</h2>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {activeConversation.online ? 'Active now' : `Last seen ${activeConversation.timestamp}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-slate-300 dark:text-gray-600 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-gray-400">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-md ${message.senderId === 'me' ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`group relative px-4 py-3 rounded-2xl ${
                              message.senderId === 'me'
                                ? 'bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white'
                                : 'bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 text-slate-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            
                            {message.reactions.length > 0 && (
                              <div className="absolute -bottom-2 right-2 flex gap-1">
                                {message.reactions.map((reaction, index) => (
                                  <span
                                    key={index}
                                    className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 shadow-sm"
                                  >
                                    {reaction.emoji} {reaction.count}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-1 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg p-1 shadow-lg">
                                {['👍', '❤️', '😊'].map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => handleReaction(message.id, emoji)}
                                    className="hover:scale-125 transition-transform text-base"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className={`flex items-center gap-2 mt-1 text-xs ${
                            message.senderId === 'me' ? 'justify-end' : 'justify-start'
                          }`}>
                            <span className="text-slate-500 dark:text-gray-500">{message.timestamp}</span>
                            {message.senderId === 'me' && (
                              <span>
                                {message.status === 'read' ? (
                                  <CheckCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                ) : message.status === 'delivered' ? (
                                  <CheckCheck className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                ) : (
                                  <Check className="w-4 h-4 text-slate-400 dark:text-gray-500" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}

                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-gray-500">typing...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* AI Suggestions */}
                {aiSuggestions.length > 0 && (
                  <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-t border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-medium text-purple-900 dark:text-purple-300">AI Smart Replies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {aiSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          disabled={sendingMessage}
                          className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 rounded-lg text-sm text-slate-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-600 transition-all disabled:opacity-50"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700">
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleSendMessage(reply)}
                        disabled={sendingMessage}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-lg text-xs text-slate-700 dark:text-gray-300 whitespace-nowrap transition-colors disabled:opacity-50"
                      >
                        <Zap className="w-3 h-3" />
                        {reply}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-end gap-3">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ImageIcon className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                      </button>
                    </div>

                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !sendingMessage && handleSendMessage()}
                        placeholder="Type your message..."
                        disabled={sendingMessage}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-gray-900 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 pr-10 disabled:opacity-50"
                      />
                      <button
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                      >
                        <Smile className="w-5 h-5 text-slate-400 dark:text-gray-500" />
                      </button>

                      {showEmojiPicker && (
                        <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl p-3 z-50">
                          <div className="grid grid-cols-4 gap-2">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => {
                                  setNewMessage(newMessage + emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="text-2xl hover:scale-125 transition-transform"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {newMessage.trim() ? (
                      <button
                        onClick={() => handleSendMessage()}
                        disabled={sendingMessage}
                        className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {sendingMessage ? (
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 text-white" />
                        )}
                      </button>
                    ) : (
                      <button className="p-3 bg-slate-100 dark:bg-gray-700 hover:bg-slate-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                        <Mic className="w-5 h-5 text-slate-600 dark:text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Select a conversation</h3>
                  <p className="text-slate-600 dark:text-gray-400">Choose from your existing conversations or start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
