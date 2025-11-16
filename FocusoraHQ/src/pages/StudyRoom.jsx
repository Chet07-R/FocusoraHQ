import React from "react";
import { Link, useNavigate } from "react-router-dom";

const StudyRoom = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Navbar */}
      <nav className="navbar"></nav>

      {/* Hero Section */}
      <main className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-16 pt-8 sm:pt-10 md:pt-12">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-white"
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-blue-900 dark:text-white">
                Study Rooms
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-800 dark:text-blue-200 leading-relaxed px-4">
              Join a public room or create your own private focus space.
              Collaborate, compete, or just vibe with focused learners worldwide!
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16 md:mb-20">
            {/* Create Space */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Create Space"
              onClick={() => navigate('/create-space')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/create-space');
                }
              }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 opacity-50"></div>
                <div className="relative p-5 sm:p-6 md:p-8">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-white"
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
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-white mb-2 sm:mb-3 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    Create Space
                  </h2>
                  <p className="text-sm sm:text-base text-blue-700 dark:text-blue-300 text-center mb-4 sm:mb-6 leading-relaxed px-2">
                    Start a private or group study room with custom settings and
                    invite your friends
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      "Customize room settings",
                      "Invite team members",
                      "Set focus goals together",
                    ].map((text, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
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
                  <div className="mt-4 sm:mt-6 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 text-sm sm:text-base text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 transition-all duration-300">
                      Get Started
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
            </div>

            {/* Join Space */}
            <Link to="/join-space" className="group">
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-transparent hover:border-cyan-500 dark:hover:border-cyan-400 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 opacity-50"></div>
                <div className="relative p-5 sm:p-6 md:p-8">
                  <div className="flex items-center justify-center mb-4 sm:mb-6">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                      <svg
                        className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 text-white"
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
                  <h2 className="text-xl sm:text-2xl font-bold text-cyan-900 dark:text-white mb-2 sm:mb-3 text-center group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    Join Space
                  </h2>
                  <p className="text-sm sm:text-base text-cyan-700 dark:text-cyan-300 text-center mb-4 sm:mb-6 leading-relaxed px-2">
                    Browse and join active study rooms from learners around the
                    world
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      "Find active study rooms",
                      "Connect with learners",
                      "Boost productivity together",
                    ].map((text, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600 dark:text-cyan-400 flex-shrink-0"
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
                  <div className="mt-4 sm:mt-6 flex items-center justify-center">
                    <span className="inline-flex items-center gap-2 text-sm sm:text-base text-cyan-600 dark:text-cyan-400 font-semibold group-hover:gap-3 transition-all duration-300">
                      Browse Rooms
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
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
          <div className="flex justify-center px-4">
            <div className="relative group max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl"></div>
              <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-pink-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                <div className="absolute top-0 right-0 w-1 bg-gradient-to-b from-pink-500 to-purple-500 h-0 group-hover:h-full transition-all duration-700 ease-out delay-300"></div>
                <div className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-purple-500 to-blue-500 w-0 group-hover:w-full transition-all duration-700 ease-out delay-700"></div>
                <div className="absolute bottom-0 left-0 w-1 bg-gradient-to-t from-blue-500 to-cyan-500 h-0 group-hover:h-full transition-all duration-700 ease-out delay-1000"></div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 relative transition-all duration-300 group-hover:shadow-3xl group-hover:shadow-cyan-500/20">
                <img 
                  src="/images/study_room.jpeg" 
                  alt="Study Room Illustration" 
                  className="relative w-64 sm:w-80 md:w-96 lg:w-[32rem] rounded-lg"
                  loading="lazy"
                />
              </div>
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
