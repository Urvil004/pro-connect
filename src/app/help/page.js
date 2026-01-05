"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Search, MessageCircle, Book } from "lucide-react";
import { useState } from "react";


export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");


  const helpTopics = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using ProConnect",
      articles: 12
    },
    {
      icon: MessageCircle,
      title: "Account & Settings",
      description: "Manage your profile and preferences",
      articles: 8
    },
    {
      icon: HelpCircle,
      title: "Privacy & Security",
      description: "Keep your account safe and secure",
      articles: 15
    },
    {
      icon: Search,
      title: "Using ProConnect",
      description: "Tips and tricks for making the most of the platform",
      articles: 20
    },
  ];


  const faqs = [
    {
      question: "How do I create an account?",
      answer: "Click on 'Join Now' or 'Sign Up' and follow the registration process. You'll need to provide your email, name, and create a password."
    },
    {
      question: "How do I connect with other professionals?",
      answer: "Visit a user's profile and click the 'Connect' button. You can also search for people using the search bar at the top of the page."
    },
    {
      question: "Can I edit my profile after creating it?",
      answer: "Yes! Visit your profile page and click 'Edit Profile' to update your information, bio, headline, and profile picture anytime."
    },
    {
      question: "Is ProConnect free to use?",
      answer: "Yes, ProConnect offers a free tier with all essential features for professional networking."
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white py-20 shadow-lg">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/" 
            className="inline-flex items-center text-white/80 hover:text-white dark:text-white/90 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Help Center
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-purple-100 dark:text-purple-200 mb-8"
          >
            Find answers and get support
          </motion.p>


          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 dark:focus:ring-purple-500 transition-colors duration-300"
            />
          </motion.div>
        </div>
      </div>


      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Help Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Browse by Topic
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-6 hover:shadow-xl dark:hover:shadow-3xl transition-shadow duration-300 cursor-pointer border border-transparent dark:border-gray-700"
              >
                <div className="bg-purple-100 dark:bg-purple-900/40 rounded-lg p-3 w-fit mb-4">
                  <topic.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {topic.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {topic.description}
                </p>
                <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                  {topic.articles} articles
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-start">
                  <HelpCircle className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 ml-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </motion.div>


        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-purple-100 dark:text-purple-200 mb-6">
            Our support team is here to assist you with any questions or issues.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white dark:bg-gray-100 text-purple-600 dark:text-purple-700 font-medium px-6 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-white transition-colors duration-300 shadow-md"
          >
            Contact Support
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
