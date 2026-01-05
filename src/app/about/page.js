"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Users, Target, Heart, Zap } from "lucide-react";


export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Building meaningful connections between professionals worldwide."
    },
    {
      icon: Target,
      title: "Innovation",
      description: "Constantly evolving to meet the needs of modern professionals."
    },
    {
      icon: Heart,
      title: "Authenticity",
      description: "Creating a space for genuine professional relationships."
    },
    {
      icon: Zap,
      title: "Growth",
      description: "Empowering careers through knowledge sharing and networking."
    },
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* ✅ DARK MODE: Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white py-20">
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
            About ProConnect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 dark:text-blue-200"
          >
            Building the future of professional networking
          </motion.p>
        </div>
      </div>


      {/* ✅ DARK MODE: Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            ProConnect is dedicated to connecting professionals worldwide, fostering meaningful relationships, 
            and creating opportunities for career growth. We believe that everyone deserves access to a powerful 
            network that can help them achieve their professional goals.
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            Our platform brings together millions of professionals from diverse industries, backgrounds, and 
            experiences to share knowledge, discover opportunities, and build lasting connections.
          </p>
        </motion.div>


        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 mb-8 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
              >
                <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-3 border border-transparent dark:border-blue-800">
                  <value.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Join Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 md:p-12 border border-transparent dark:border-gray-700 transition-colors duration-300"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Join Our Community</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
            Whether your looking to advance your career, find new opportunities, or connect with 
            like-minded professionals, ProConnect is here to support your journey.
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg dark:shadow-xl"
          >
            Get Started Today
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
