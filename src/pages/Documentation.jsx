import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";

const Documentation = () => {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState("getting-started");

  const sidebar = [
    {
      title: "Getting Started",
      id: "getting-started",
      icon: "🚀",
      items: [
        { name: "Introduction", id: "intro" },
        { name: "Quick Start", id: "quickstart" },
        { name: "Installation", id: "installation" }
      ]
    },
    {
      title: "Features",
      id: "features",
      icon: "✨",
      items: [
        { name: "Study Rooms", id: "study-rooms" },
        { name: "Pomodoro Timer", id: "pomodoro" },
        { name: "Task Management", id: "tasks" },
        { name: "Focus Playlist", id: "playlist" }
      ]
    },
    {
      title: "Collaboration",
      id: "collaboration",
      icon: "👥",
      items: [
        { name: "Create Space", id: "create-space" },
        { name: "Join Space", id: "join-space" },
        { name: "Team Features", id: "team-features" }
      ]
    },
    {
      title: "Advanced",
      id: "advanced",
      icon: "⚡",
      items: [
        { name: "Keyboard Shortcuts", id: "shortcuts" },
        { name: "Integrations", id: "integrations" },
        { name: "API Reference", id: "api" }
      ]
    }
  ];

  const content = {
    intro: {
      title: "Introduction to FocusoraHQ",
      content: (
        <>
          <p className="mb-4">
            Welcome to FocusoraHQ, your ultimate productivity companion designed to help you focus, collaborate, and achieve your goals.
          </p>
          <p className="mb-4">
            FocusoraHQ combines powerful study tools with collaborative features to create an environment where you can maximize your productivity and minimize distractions.
          </p>
          <div className={`${darkMode ? "bg-cyan-900/30" : "bg-cyan-50"} border-l-4 border-cyan-500 p-4 rounded mb-4`}>
            <p className="font-semibold mb-2">✨ Key Benefits:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Customizable study environments</li>
              <li>Built-in Pomodoro timer with notifications</li>
              <li>Real-time collaboration spaces</li>
              <li>Progress tracking and analytics</li>
              <li>Focus-enhancing ambient sounds</li>
            </ul>
          </div>
        </>
      )
    },
    quickstart: {
      title: "Quick Start Guide",
      content: (
        <>
          <p className="mb-4">Get up and running with FocusoraHQ in just a few minutes:</p>
          <div className="space-y-6 mb-6">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">1</span>
                <div>
                  <h4 className="font-bold mb-2">Create Your Account</h4>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>Sign up using your email or Google account. It takes less than 30 seconds.</p>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">2</span>
                <div>
                  <h4 className="font-bold mb-2">Set Up Your Profile</h4>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>Customize your profile, set study goals, and choose your preferences.</p>
                </div>
              </div>
            </div>
            
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-lg shadow-md`}>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">3</span>
                <div>
                  <h4 className="font-bold mb-2">Start Your First Session</h4>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>Enter a study room, set your Pomodoro timer, and begin your focused work session.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    },
    "study-rooms": {
      title: "Study Rooms",
      content: (
        <>
          <p className="mb-4">
            Study Rooms are immersive environments designed to help you maintain focus and productivity.
          </p>
          <h4 className="text-xl font-bold mb-3">Features:</h4>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>Multiple background themes (library, cafe, nature, space)</li>
            <li>Ambient sound options with volume control</li>
            <li>Customizable study tools (notes, todo list, timer)</li>
            <li>Invite friends for collaborative study sessions</li>
            <li>Screen-sharing capabilities</li>
          </ul>
          
          <div className={`${darkMode ? "bg-purple-900/30" : "bg-purple-50"} border-l-4 border-purple-500 p-4 rounded mb-4`}>
            <p className="font-semibold mb-2">💡 Pro Tip:</p>
            <p>Use keyboard shortcuts (Ctrl+T for timer, Ctrl+N for notes) to maximize efficiency without breaking focus.</p>
          </div>
        </>
      )
    },
    pomodoro: {
      title: "Pomodoro Timer",
      content: (
        <>
          <p className="mb-4">
            The Pomodoro Technique helps you work in focused intervals with short breaks in between.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg text-center shadow-md`}>
              <div className="text-4xl mb-2">⏱️</div>
              <h4 className="font-bold mb-1">25 Minutes</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Focus Session</p>
            </div>
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg text-center shadow-md`}>
              <div className="text-4xl mb-2">☕</div>
              <h4 className="font-bold mb-1">5 Minutes</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Short Break</p>
            </div>
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} p-4 rounded-lg text-center shadow-md`}>
              <div className="text-4xl mb-2">🎯</div>
              <h4 className="font-bold mb-1">15-30 Minutes</h4>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Long Break</p>
            </div>
          </div>
          <p className="mb-4">
            Customize timer durations in your settings to match your personal productivity rhythm.
          </p>
        </>
      )
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} pt-20`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-white mb-4">Documentation</h1>
          <p className="text-xl text-white/90">Everything you need to master FocusoraHQ</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-6 shadow-lg h-fit lg:sticky lg:top-24`}>
            <div className="space-y-6">
              {sidebar.map((section) => (
                <div key={section.id}>
                  <h3 className="font-bold text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span>{section.icon}</span>
                    {section.title}
                  </h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            activeSection === item.id
                              ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                              : darkMode
                              ? "hover:bg-gray-700 text-gray-300"
                              : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-8 shadow-lg`}>
              <h2 className="text-3xl font-bold mb-6">
                {content[activeSection]?.title || "Welcome"}
              </h2>
              <div className={`prose ${darkMode ? "prose-invert" : ""} max-w-none`}>
                {content[activeSection]?.content || (
                  <p>Select a topic from the sidebar to view documentation.</p>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-700">
                <Link
                  to="/help-center"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Help Center
                </Link>
                <Link
                  to="/community"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  } transition-colors`}
                >
                  Community
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
