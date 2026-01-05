"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, Shield, Users, Scale, AlertCircle, ArrowLeft } from "lucide-react";


export default function TermsPage() {
  const sections = [
    {
      icon: FileText,
      title: "Acceptance of Terms",
      content: "By accessing and using ProConnect, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service."
    },
    {
      icon: Users,
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
    },
    {
      icon: Shield,
      title: "User Content",
      content: "You retain all rights to the content you post on ProConnect. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in connection with the service."
    },
    {
      icon: AlertCircle,
      title: "Prohibited Activities",
      content: "You may not use ProConnect to post spam, engage in harassment, impersonate others, violate intellectual property rights, or engage in any illegal activities. We reserve the right to remove content and suspend accounts that violate these terms."
    },
    {
      icon: Scale,
      title: "Limitation of Liability",
      content: "ProConnect is provided 'as is' without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service."
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white py-20 shadow-lg">
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
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 dark:text-blue-200"
          >
            Last updated: December 30, 2025
          </motion.p>
        </div>
      </div>


      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Welcome to ProConnect. These Terms of Service govern your use of our platform and services. Please read them carefully before using our platform.
          </p>


          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-2"
              >
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-2 mr-3">
                    <section.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>


          {/* Additional Important Sections */}
          <div className="mt-12 space-y-8">
            <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Termination
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the service will immediately cease.
              </p>
            </div>


            <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Changes to Terms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the service after any changes constitutes acceptance of the new Terms.
              </p>
            </div>


            <div className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 py-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Governing Law
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these Terms will be subject to the exclusive jurisdiction of the courts located in your jurisdiction.
              </p>
            </div>
          </div>


          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <a 
              href="mailto:legal@proconnect.com" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              legal@proconnect.com
            </a>
          </div>


          {/* Agreement Section */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Important:</strong> By using ProConnect, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
