"use client";
import Link from "next/link";


export function SidebarFooter() {
  const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Help Center", href: "/help" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];


  return (
    <div className="mt-auto pt-4 pb-2">
      {/* ✅ DARK MODE: Footer Links */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
        {footerLinks.map((link, index) => (
          <span key={link.href} className="flex items-center">
            <Link
              href={link.href}
              className="hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors"
            >
              {link.label}
            </Link>
            {index < footerLinks.length - 1 && (
              <span className="ml-3 text-gray-400 dark:text-gray-600">•</span>
            )}
          </span>
        ))}
      </div>
      
      {/* ✅ DARK MODE: Copyright */}
      <div className="text-center text-xs text-gray-500 dark:text-gray-500">
        ProConnect © {new Date().getFullYear()}
      </div>
    </div>
  );
}
