import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Press = () => {
  const { darkMode } = useTheme();

  const pressReleases = [
    {
      date: "January 15, 2025",
      title: "FocusoraHQ Reaches 10,000 Active Users Milestone",
      excerpt: "Platform growth accelerates as students worldwide embrace focused productivity tools during exam season.",
      category: "Company News"
    },
    {
      date: "December 10, 2024",
      title: "New Collaboration Features Launch for Study Groups",
      excerpt: "Real-time screen sharing and group timers now available for team study sessions.",
      category: "Product Update"
    },
    {
      date: "November 5, 2024",
      title: "FocusoraHQ Raises $2M in Seed Funding",
      excerpt: "Investment will fuel product development and international expansion.",
      category: "Funding"
    },
    {
      date: "October 20, 2024",
      title: "Platform Launches Mobile Apps for iOS and Android",
      excerpt: "Students can now access focus tools and study rooms on any device.",
      category: "Product Update"
    }
  ];

  const mediaKit = [
    {
      icon: "🖼️",
      title: "Brand Assets",
      description: "Logos, colors, and brand guidelines",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "📸",
      title: "Product Screenshots",
      description: "High-resolution app images",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "👥",
      title: "Team Photos",
      description: "Headshots and team images",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "📊",
      title: "Company Stats",
      description: "Latest metrics and data",
      color: "from-orange-500 to-red-500"
    }
  ];

  const coverage = [
    {
      outlet: "TechCrunch",
      logo: "📰",
      headline: "FocusoraHQ is the Productivity Tool Students Actually Want to Use",
      date: "January 2025",
      color: "from-green-500 to-emerald-500"
    },
    {
      outlet: "Product Hunt",
      logo: "🚀",
      headline: "Product of the Day - Revolutionary Study Platform",
      date: "December 2024",
      color: "from-orange-500 to-red-500"
    },
    {
      outlet: "EdTech Magazine",
      logo: "📚",
      headline: "How FocusoraHQ is Changing the Way Students Study Online",
      date: "November 2024",
      color: "from-blue-500 to-cyan-500"
    },
    {
      outlet: "The Verge",
      logo: "⚡",
      headline: "This App Helped Me Focus Better Than Any Technique",
      date: "October 2024",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pt-20 pb-16`}>
      {}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Press & Media
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed mb-8">
            Latest news, announcements, and media resources for journalists and content creators.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Contact Press Team
          </Link>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Press Releases</h2>
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-12 max-w-2xl mx-auto`}>
          Official announcements and company news
        </p>

        <div className="max-w-4xl mx-auto space-y-6">
          {pressReleases.map((release, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
              } rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold mb-3 md:mb-0 w-fit ${
                  darkMode ? "bg-cyan-900/50 text-cyan-400" : "bg-cyan-100 text-cyan-700"
                }`}>
                  {release.category}
                </span>
                <span className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                  {release.date}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3 hover:text-transparent hover:bg-gradient-to-r hover:from-cyan-400 hover:to-pink-400 hover:bg-clip-text transition-all">
                {release.title}
              </h3>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-4`}>
                {release.excerpt}
              </p>
              <button className="text-cyan-500 font-semibold hover:text-cyan-400 transition-colors flex items-center gap-2">
                Read Full Release
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className={`${darkMode ? "bg-gray-800/50" : "bg-gray-100"} py-24`}>
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">In The News</h2>
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-12 max-w-2xl mx-auto`}>
            What people are saying about FocusoraHQ
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {coverage.map((item, index) => (
              <div
                key={index}
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl mb-4`}>
                  {item.logo}
                </div>
                <div className="font-bold text-sm text-cyan-500 mb-2">{item.outlet}</div>
                <h3 className="text-xl font-bold mb-3 leading-snug">
                  {item.headline}
                </h3>
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                  {item.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6 py-24">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Media Kit</h2>
        <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-12 max-w-2xl mx-auto`}>
          Everything you need to write about FocusoraHQ
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mediaKit.map((item, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-6 shadow-lg text-center transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group`}
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                {item.description}
              </p>
              <button className="text-cyan-500 text-sm font-semibold hover:text-cyan-400">
                Download →
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1">
            Download Complete Press Kit
          </button>
        </div>
      </div>

      {}
      <div className="container mx-auto px-6">
        <div className={`${
          darkMode ? "bg-gray-800" : "bg-white"
        } rounded-2xl p-12 shadow-2xl text-center max-w-4xl mx-auto`}>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Press Inquiries</h3>
          <p className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-6 text-lg`}>
            For media inquiries, interview requests, or press materials:
          </p>
          <div className={`${darkMode ? "bg-gray-900" : "bg-gray-50"} rounded-xl p-6 mb-6`}>
            <p className="text-lg mb-2">
              <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Email:</span>{" "}
              <a href="mailto:focusorahq@gmail.com" className="text-cyan-500 hover:text-cyan-400 font-semibold">
                focusorahq@gmail.com
              </a>
            </p>
            <p className="text-lg">
              <span className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>Response Time:</span>{" "}
              <span className="font-semibold">Within 24 hours</span>
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Press;
