"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Linkedin,
  Twitter,
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowUp,
  Users,
} from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ Real, working social links
  const socialLinks = [
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/company/proconnect", 
      label: "LinkedIn", 
      color: "hover:bg-blue-600" 
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/proconnect", 
      label: "Twitter", 
      color: "hover:bg-sky-500" 
    },
    { 
      icon: Github, 
      href: "https://github.com/proconnect", 
      label: "GitHub", 
      color: "hover:bg-gray-700" 
    },
    { 
      icon: Mail, 
      href: "mailto:contact@proconnect.com?subject=Hello%20ProConnect&body=Hi%2C%0A%0AI%20would%20like%20to%20get%20in%20touch%20with%20you.", 
      label: "Email", 
      color: "hover:bg-red-600" 
    },
  ];

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <Link href="/" className="inline-block">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2.5 shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    ProConnect
                  </span>
                </div>
              </Link>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
                Building the future of professional networking. Connect, share,
                and grow with our vibrant community of professionals worldwide.
              </p>

              {/* Social Links - Now fully interactive */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-slate-800 ${social.color} rounded-lg p-3 transition-all duration-300 group hover:shadow-lg`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Contact Information - Now interactive */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <motion.a
                  href="mailto:contact@proconnect.com?subject=Inquiry%20from%20Website&body=Hello%20ProConnect%20Team%2C%0A%0A"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-slate-800 rounded-lg p-2 group-hover:bg-blue-600 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <span className="text-sm">contact@proconnect.com</span>
                </motion.a>
                
                <motion.a
                  href="tel:+919999900000"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-slate-800 rounded-lg p-2 group-hover:bg-blue-600 transition-colors">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-sm">+91 99999 00000</span>
                </motion.a>
                
                <motion.a
                  href="https://maps.google.com/?q=Delhi,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-slate-800 rounded-lg p-2 group-hover:bg-blue-600 transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <span className="text-sm">Delhi, India</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Stats - Now with hover effects */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <h3 className="text-lg font-semibold mb-6 text-white">
                Our Impact
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl font-bold text-blue-400 mb-1">1M+</div>
                  <div className="text-xs text-gray-400">Active Users</div>
                </motion.div>
                <motion.div 
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl font-bold text-blue-400 mb-1">50K+</div>
                  <div className="text-xs text-gray-400">Companies</div>
                </motion.div>
                <motion.div 
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl font-bold text-blue-400 mb-1">100K+</div>
                  <div className="text-xs text-gray-400">Daily Posts</div>
                </motion.div>
                <motion.div 
                  className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-blue-500 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl font-bold text-blue-400 mb-1">5M+</div>
                  <div className="text-xs text-gray-400">Connections</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 bg-slate-950/50">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-gray-400 text-sm text-center md:text-left"
              >
                <span>© 2025 ProConnect. All rights reserved.</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 text-sm text-gray-400"
              >
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Terms
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Contact
                </Link>
              </motion.div>

              <motion.button
                onClick={scrollToTop}
                className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
