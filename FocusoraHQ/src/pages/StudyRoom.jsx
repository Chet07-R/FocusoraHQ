import React from "react";
import { Link } from "react-router-dom";

const StudyRoom = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Navbar */}
      <nav className="navbar"></nav>

      {/* Hero Section */}
      <main className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-16 pt-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <svg
                  className="w-9 h-9 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 dark:text-white">
                Study Rooms
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-800 dark:text-blue-200 leading-relaxed">
              Join a public room or create your own private focus space.
              Collaborate, compete, or just vibe with focused learners worldwide!
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Create Space */}
            <Link to="/create-space" className="group">
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-11 h-11 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900 dark:text-white mb-3 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Create Space
                  </h2>
                  <p className="text-blue-700 dark:text-blue-300 text-center mb-6 leading-relaxed">
                    Start a private or group study room with custom settings and
                    invite your friends
                  </p>
                  <div className="space-y-3">
                    {[
                      "Customize room settings",
                      "Invite team members",
                      "Set focus goals together",
                    ].map((text, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-300">
                      Get Started
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Join Space */}
            <Link to="/join-space" className="group">
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-transparent hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 opacity-50"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-11 h-11 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-cyan-900 dark:text-white mb-3 text-center group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    Join Space
                  </h2>
                  <p className="text-cyan-700 dark:text-cyan-300 text-center mb-6 leading-relaxed">
                    Browse and join active study rooms from learners around the
                    world
                  </p>
                  <div className="space-y-3">
                    {[
                      "Find active study rooms",
                      "Connect with learners",
                      "Boost productivity together",
                    ].map((text, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="w-5 h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-3 transition-all duration-300">
                      Browse Rooms
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Feature Image */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
              <img
                src="../images/study_room.png"
                alt="Study Room Illustration"
                className="relative w-80 md:w-[32rem] rounded-2xl shadow-2xl border-4 border-white dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer"></footer>
    </div>
  );
};

export default StudyRoom;
