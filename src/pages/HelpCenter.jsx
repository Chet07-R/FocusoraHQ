import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const HelpCenter = () => {
  const { darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      icon: "🚀",
      title: "Getting Started",
      description: "Learn the basics of FocusoraHQ",
      articles: 12,
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: "⚙️",
      title: "Account Settings",
      description: "Manage your profile and preferences",
      articles: 8,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "🎯",
      title: "Study Features",
      description: "Master study rooms and tools",
      articles: 15,
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "🔧",
      title: "Troubleshooting",
      description: "Fix common issues",
      articles: 10,
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "👥",
      title: "Collaboration",
      description: "Work with teams effectively",
      articles: 7,
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: "🔒",
      title: "Security & Privacy",
      description: "Keep your data safe",
      articles: 6,
      color: "from-pink-500 to-rose-500"
    }
  ];

  const faqs = [
    {
      question: "How do I create a study room?",
      answer: "Navigate to the Study Room page and click 'Create New Room'. You can customize settings like background, music, and invite friends to join your focused study session."
    },
    {
      question: "Can I use FocusoraHQ offline?",
      answer: "While most features require internet connection, certain features like the Pomodoro timer and notes can work offline. Your progress will sync once you're back online."
    },
    {
      question: "How does the leaderboard work?",
      answer: "The leaderboard tracks your study time and productivity. Points are earned through consistent study sessions, completing tasks, and maintaining focus streaks."
    },
    {
      question: "Is my data secure?",
      answer: "Yes! We use industry-standard encryption and Firebase security rules to protect your data. Your privacy is our top priority."
    },
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the sign-in page. Enter your email and we'll send you a reset link within minutes."
    },
    {
      question: "Can I customize my study environment?",
      answer: "Absolutely! You can choose from various backgrounds, ambient sounds, and customize your dashboard layout to match your study preferences."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pt-20 pb-16`}>
      {}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-6">
            How can we help you?
          </h1>
          <p className="text-xl text-white/90 text-center mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse categories below
          </p>
          
          {}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className={`w-full px-6 py-4 rounded-xl ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                } shadow-2xl focus:outline-none focus:ring-4 focus:ring-cyan-400/50 transition-all`}
              />
              <svg
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-10 relative z-20">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
            >
              <div className={`w-16 h-16 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
                {category.description}
              </p>
              <div className="flex items-center text-sm">
                <span className={`${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                  {category.articles} articles
                </span>
                <svg
                  className="w-5 h-5 ml-auto text-cyan-500 group-hover:translate-x-2 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className={`text-center ${darkMode ? "text-gray-400" : "text-gray-600"} mb-12`}>
            Quick answers to common questions
          </p>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className={`${
                  darkMode ? "bg-gray-800" : "bg-white"
                } rounded-xl shadow-md overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between hover:bg-opacity-80 transition-colors"
                >
                  <span className="font-semibold text-left">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-cyan-500 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {expandedFaq === index && (
                  <div className={`px-6 pb-5 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {}
        <div className={`${
          darkMode ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-gray-100 to-gray-200"
        } rounded-2xl p-12 text-center`}>
          <h3 className="text-3xl font-bold mb-4">Still need help?</h3>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mb-6 max-w-2xl mx-auto`}>
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Contact Support
            </Link>
            <Link
              to="/community"
              className={`px-8 py-3 ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-50"
              } rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 shadow-md`}
            >
              Join Community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
