"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ArrowLeft, Calendar, Search, MapPin, Clock, Users, Plus } from "lucide-react";
import Link from "next/link";


export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, online, in-person


  const upcomingEvents = [
    {
      id: 1,
      title: "React Conference 2025",
      date: "2025-01-15",
      time: "10:00 AM - 5:00 PM IST",
      location: "Online",
      attendees: "2.5K attending",
      organizer: "React Community",
      description: "Join us for a day of learning about the latest in React and Next.js",
      type: "online",
    },
    {
      id: 2,
      title: "Tech Meetup - Web3 & Blockchain",
      date: "2025-01-20",
      time: "6:00 PM - 9:00 PM IST",
      location: "Bangalore, India",
      attendees: "150 attending",
      organizer: "Tech Community Bangalore",
      description: "Network with fellow developers and learn about Web3 technologies",
      type: "in-person",
    },
    {
      id: 3,
      title: "AI & Machine Learning Workshop",
      date: "2025-01-25",
      time: "2:00 PM - 6:00 PM IST",
      location: "Online",
      attendees: "1.2K attending",
      organizer: "AI Developers Hub",
      description: "Hands-on workshop on building ML models with Python",
      type: "online",
    },
  ];


  const filteredEvents = upcomingEvents.filter(event => {
    if (filter === "all") return true;
    return event.type === filter;
  });


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events</h1>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Discover and join professional events in your area
          </p>
        </div>


        {/* Search & Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              All Events
            </Button>
            <Button
              variant={filter === "online" ? "default" : "outline"}
              onClick={() => setFilter("online")}
            >
              Online
            </Button>
            <Button
              variant={filter === "in-person" ? "default" : "outline"}
              onClick={() => setFilter("in-person")}
            >
              In-Person
            </Button>
          </div>
        </div>


        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg dark:hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  {/* Date Badge */}
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-lg flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-2xl font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                      <span className="text-xs uppercase">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                  </div>


                  {/* Event Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.type === 'online' 
                          ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' 
                          : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400'
                      }`}>
                        {event.type === 'online' ? 'Online' : 'In-Person'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {event.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-500" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-500" />
                        {event.attendees}
                      </div>
                    </div>


                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Organized by <span className="font-medium text-gray-700 dark:text-gray-300">{event.organizer}</span>
                      </span>
                      <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
                        Attend Event
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {filteredEvents.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No events found
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
