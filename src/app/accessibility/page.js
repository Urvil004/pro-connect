"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Eye, Keyboard, Volume2, MousePointer } from "lucide-react";


export default function AccessibilityPage() {
  const features = [
    {
      icon: Eye,
      title: "Screen Reader Support",
      description: "Full compatibility with popular screen readers for visually impaired users."
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Complete keyboard accessibility for users who cannot use a mouse."
    },
    {
      icon: Volume2,
      title: "Audio Descriptions",
      description: "Audio descriptions for visual content and multimedia elements."
    },
    {
      icon: MousePointer,
      title: "High Contrast Mode",
      description: "Enhanced visibility options for users with visual impairments."
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* ✅ DARK MODE: Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-700 dark:to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Accessibility
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-green-100 dark:text-green-200"
          >
            Making ProConnect accessible to everyone
          </motion.p>
        </div>
      </div>


      {/* ✅ DARK MODE: Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Commitment Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Commitment</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            ProConnect is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant 
            accessibility standards.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            We believe that everyone should have equal access to professional networking opportunities, 
            regardless of their abilities.
          </p>
        </motion.div>


        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Accessibility Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors duration-200"
              >
                <div className="bg-green-100 dark:bg-green-900/50 rounded-lg p-3 border border-transparent dark:border-green-800">
                  <feature.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Feedback Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Feedback</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            We welcome your feedback on the accessibility of ProConnect. Please let us know if you 
            encounter accessibility barriers.
          </p>
          <a
            href="mailto:accessibility@proconnect.com"
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium hover:underline text-lg transition-colors"
          >
            accessibility@proconnect.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}
