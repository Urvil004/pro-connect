"use client";
import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Search,
} from "lucide-react";


export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");


  const categories = [
    { id: "all", label: "All News" },
    { id: "technology", label: "Technology" },
    { id: "business", label: "Business" },
    { id: "career", label: "Career" },
    { id: "startups", label: "Startups" },
  ];


  const allNews = [
    {
      id: 1,
      title: "Tech industry sees major growth in AI sector",
      description:
        "Artificial intelligence continues to drive innovation across multiple industries, with major companies investing billions in AI research and development.",
      category: "technology",
      timeAgo: "2 hours ago",
      readers: 1234,
      trending: true,
      image: "https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=AI+Growth",
    },
    {
      id: 2,
      title: "Remote work trends reshape office culture in 2026",
      description:
        "Companies worldwide are adopting hybrid work models, transforming traditional office spaces into collaborative hubs while embracing remote flexibility.",
      category: "business",
      timeAgo: "4 hours ago",
      readers: 892,
      trending: false,
      image: "https://via.placeholder.com/400x200/10B981/FFFFFF?text=Remote+Work",
    },
    {
      id: 3,
      title: "AI development accelerates with new breakthroughs",
      description:
        "Latest advancements in machine learning and neural networks are pushing the boundaries of what's possible with artificial intelligence technology.",
      category: "technology",
      timeAgo: "6 hours ago",
      readers: 2156,
      trending: true,
      image: "https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=AI+Tech",
    },
    {
      id: 4,
      title: "Startup funding reaches new highs in Q1 2026",
      description:
        "Venture capital investments surge as investors show renewed confidence in innovative startups across technology and healthcare sectors.",
      category: "startups",
      timeAgo: "8 hours ago",
      readers: 567,
      trending: false,
      image: "https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Funding",
    },
    {
      id: 5,
      title: "Green technology innovations drive sustainability",
      description:
        "New eco-friendly technologies are helping companies reduce carbon footprints while maintaining profitability and operational efficiency.",
      category: "technology",
      timeAgo: "12 hours ago",
      readers: 1445,
      trending: true,
      image: "https://via.placeholder.com/400x200/059669/FFFFFF?text=Green+Tech",
    },
    {
      id: 6,
      title: "Career development strategies for 2026",
      description:
        "Learn how professionals are navigating career growth in an evolving job market with new skills, networking, and personal branding strategies.",
      category: "career",
      timeAgo: "14 hours ago",
      readers: 978,
      trending: false,
      image: "https://via.placeholder.com/400x200/EF4444/FFFFFF?text=Career",
    },
    {
      id: 7,
      title: "Cloud computing transformation accelerates",
      description:
        "Enterprise adoption of cloud infrastructure reaches new levels as businesses prioritize scalability, security, and cost efficiency.",
      category: "technology",
      timeAgo: "16 hours ago",
      readers: 1122,
      trending: true,
      image: "https://via.placeholder.com/400x200/06B6D4/FFFFFF?text=Cloud",
    },
    {
      id: 8,
      title: "Leadership skills that matter in modern workplaces",
      description:
        "Top executives share insights on essential leadership qualities needed to build high-performing teams in today's dynamic business environment.",
      category: "career",
      timeAgo: "18 hours ago",
      readers: 834,
      trending: false,
      image: "https://via.placeholder.com/400x200/EC4899/FFFFFF?text=Leadership",
    },
  ];


  const filteredNews =
    selectedCategory === "all"
      ? allNews
      : allNews.filter((news) => news.category === selectedCategory);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm dark:shadow-xl transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ProConnect News
            </h1>
            <div className="w-24"></div>
          </div>


          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search news..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
            />
          </div>
        </div>
      </div>


      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Category Filters */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id
                  ? "bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>


        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNews.map((news) => (
            <Card
              key={news.id}
              className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow cursor-pointer"
            >
              <CardContent className="p-0">
                {/* News Image */}
                <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-t-lg overflow-hidden">
                  <image
                    src={news.image}
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  {news.trending && (
                    <div className="absolute top-3 right-3 bg-orange-500 dark:bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </div>
                  )}
                </div>


                {/* News Content */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                      {news.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {news.timeAgo}
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Eye className="h-3 w-3 mr-1" />
                      {news.readers.toLocaleString()} readers
                    </div>
                  </div>


                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {news.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {news.description}
                  </p>


                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 dark:border-gray-600"
                    >
                      Read More
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Load More Button */}
        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            className="px-8 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Load More News
          </Button>
        </div>
      </div>
    </div>
  );
}
