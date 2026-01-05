import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { DarkModeProvider } from "@/context/DarkModeContext";
import { Header } from "@/components/Header";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "ProConnect - Professional Networking Platform",
    template: "%s | ProConnect",
  },
  description:
    "Connect with industry leaders, share your expertise, and discover opportunities that shape your career journey.",
  keywords: [
    "professional networking",
    "career development",
    "industry connections",
    "job opportunities",
  ],
  authors: [{ name: "ProConnect Team" }],
  creator: "ProConnect",
  metadataBase: new URL("https://ProConnect-platform.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ProConnect-platform.vercel.app",
    title: "ProConnect - Professional Networking Platform",
    description:
      "Connect with industry leaders, share your expertise, and discover opportunities that shape your career journey.",
    siteName: "ProConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProConnect - Professional Networking Platform",
    description:
      "Connect with industry leaders, share your expertise, and discover opportunities.",
    creator: "@proconnect",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <DarkModeProvider>
            <SmoothScrollProvider>
              <Suspense fallback={<LoadingScreen />}>
                <Header />
                <main className="min-h-screen">{children}</main>
              </Suspense>
            </SmoothScrollProvider>
          </DarkModeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
