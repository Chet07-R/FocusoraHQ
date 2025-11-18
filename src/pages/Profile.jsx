import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user, userProfile } = useAuth();
  const { darkMode } = useTheme();

  const display = useMemo(() => {
    const name = userProfile?.displayName || user?.displayName || "John Doe";
    const bio = userProfile?.bio || "Focus. Study. Thrive. 🎯";
    const photo = userProfile?.photoURL || user?.photoURL || "/images/Profile_Icon.png";
    const totalMinutes = Number(userProfile?.totalStudyTime || 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    const sessions = Number(userProfile?.studySessions || 0);
    const points = Number(userProfile?.points || 0);
    const pomodoros = Math.max(0, Math.floor(totalMinutes / 25));
    return { name, bio, photo, totalHours, sessions, points, pomodoros };
  }, [userProfile, user]);

  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300 pt-16">
      <div className="p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-300 relative">
          {}
          <div className="relative">
            <div className="relative h-48 md:h-64 overflow-hidden">
              {}
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400'}`}>
                <div className={`absolute inset-0 ${darkMode ? 'bg-black/20' : 'bg-white/10'}`} />
              </div>

              <div className="absolute inset-0 opacity-30">
                <div className={`absolute top-10 left-10 w-32 h-32 rounded-full mix-blend-screen opacity-20 animate-pulse ${darkMode ? 'bg-white' : 'bg-white'}`} />
                <div className={`absolute bottom-10 right-20 w-40 h-40 rounded-full mix-blend-screen opacity-20 animate-pulse ${darkMode ? 'bg-white' : 'bg-white'}`} style={{ animationDelay: "0.5s" }} />
                <div className={`absolute top-1/2 left-1/2 w-24 h-24 rounded-full mix-blend-screen opacity-20 animate-pulse ${darkMode ? 'bg-white' : 'bg-white'}`} style={{ animationDelay: "1s" }} />
              </div>

              <svg className={`absolute inset-0 w-full h-full ${darkMode ? 'opacity-10' : 'opacity-20'}`} viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke={darkMode ? "white" : "white"} strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  {}
                  <div className="absolute top-8 left-12 animate-bounce" style={{ animationDuration: "3s" }}>
                    <svg className={`w-12 h-12 opacity-60 ${darkMode ? 'text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute top-12 right-16 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
                    <svg className={`w-10 h-10 opacity-60 ${darkMode ? 'text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-8 left-1/4 animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>
                    <svg className={`w-11 h-11 opacity-60 ${darkMode ? 'text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-12 right-1/4 animate-bounce" style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}>
                    <svg className={`w-10 h-10 opacity-60 ${darkMode ? 'text-white' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" transform="rotate(-45)" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
              </div>

              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-5 ${darkMode ? 'to-black/20' : 'to-white/20'}`} />
            </div>

            {}
            <div className="relative px-6 pb-8 -mt-20 text-center">
              <img src={display.photo} alt="Profile" className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-xl mx-auto object-cover" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4">{display.name}</h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg mt-2">{display.bio}</p>

              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold mt-4 shadow-lg" style={{ animation: "pulse-slow 2s infinite" }}>
                {}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.001 2c.6 2.4-.3 3.9-1.2 4.9-.9 1-1.7 2.1-.6 3.9.9-1.1 2.4-1.6 3.6-1.2 2 .7 3.1 3 2.3 5.1-.9 2.3-3.5 3.5-6 2.7-2.2-.7-3.7-2.7-3.7-5 0-3.6 2.7-5.7 3.6-6.8C10.6 4.1 11.2 3.2 12 2z" />
                </svg>
                <span>7 Day Streak</span>
              </div>
            </div>
          </div>

          {}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 py-8 bg-gray-50 dark:bg-gray-900/50">
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-600">
              {}
              <svg className="w-10 h-10 mx-auto text-indigo-600 dark:text-indigo-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{display.totalHours}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Total Hours</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-600">
              {}
              <svg className="w-10 h-10 mx-auto text-green-600 dark:text-green-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{display.sessions}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Study Sessions</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-600">
              {}
              <svg className="w-10 h-10 mx-auto text-yellow-600 dark:text-yellow-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17a4 4 0 0 0 4-4V5H8v8a4 4 0 0 0 4 4z"/><path d="M7 5H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5"/><path d="M17 5h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5"/></svg>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{display.points}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Points</p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center border border-gray-100 dark:border-gray-600">
              {}
              <svg className="w-10 h-10 mx-auto text-red-600 dark:text-red-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><path d="M10 2h4"/><path d="M4.93 4.93l2.83 2.83"/><circle cx="12" cy="13" r="8"/></svg>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{display.pomodoros}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">Pomodoros</p>
            </div>
          </div>

          {}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17a4 4 0 0 0 4-4V5H8v8a4 4 0 0 0 4 4z"/><path d="M7 5H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5"/><path d="M17 5h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5"/></svg>
              Achievements
            </h2>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 border-2 border-indigo-500 dark:border-indigo-400 rounded-2xl p-4 text-center hover:scale-105 transition-transform">
                <svg className="w-10 h-10 mx-auto text-indigo-600 dark:text-indigo-300 mb-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 2c.6 2.4-.3 3.9-1.2 4.9-.9 1-1.7 2.1-.6 3.9.9-1.1 2.4-1.6 3.6-1.2 2 .7 3.1 3 2.3 5.1-.9 2.3-3.5 3.5-6 2.7-2.2-.7-3.7-2.7-3.7-5 0-3.6 2.7-5.7 3.6-6.8C10.6 4.1 11.2 3.2 12 2z"/></svg>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">7-Day Streak</p>
              </div>

              <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/50 dark:to-purple-800/50 border-2 border-purple-500 dark:border-purple-400 rounded-2xl p-4 text-center hover:scale-105 transition-transform">
                <svg className="w-10 h-10 mx-auto text-purple-600 dark:text-purple-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">100 Hours</p>
              </div>

              <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900/50 dark:to-pink-800/50 border-2 border-pink-500 dark:border-pink-400 rounded-2xl p-4 text-center hover:scale-105 transition-transform">
                <svg className="w-10 h-10 mx-auto text-pink-600 dark:text-pink-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3"/><path d="M12 7v5l3 3"/></svg>
                <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">Night Owl</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-center opacity-50">
                <svg className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15 10 23 10 17 14 19 22 12 18 5 22 7 14 1 10 9 10 12 2"/></svg>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">30-Day Streak</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-center opacity-50">
                <svg className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17a4 4 0 0 0 4-4V5H8v8a4 4 0 0 0 4 4z"/><path d="M7 5H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5"/><path d="M17 5h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5"/></svg>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Top 100</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-2xl p-4 text-center opacity-50">
                <svg className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 22l6-20 6 20"/></svg>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">500 Hours</p>
              </div>
            </div>
          </div>

          {}
          <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-7"/></svg>
              This Week's Activity
            </h2>

            {[
              { day: "Monday", hours: "3.5h", width: "70%" },
              { day: "Tuesday", hours: "4.2h", width: "79%" },
              { day: "Wednesday", hours: "2.8h", width: "56%" },
              { day: "Thursday", hours: "5.0h", width: "85%" },
              { day: "Friday", hours: "3.0h", width: "60%" },
              { day: "Saturday", hours: "4.5h", width: "82%" },
              { day: "Sunday", hours: "6.0h", width: "100%" },
            ].map((row) => (
              <div key={row.day} className="space-y-2 mb-4 last:mb-0">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{row.day}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{row.hours}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full transition-all duration-500 bg-indigo-500 dark:bg-indigo-400 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400"
                    style={{ width: row.width, minWidth: '4%' }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16 20V4"/><path d="M8 20h9"/><path d="M12 20V10"/></svg>
              Recent Activity
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl hover:shadow-md transition-shadow border border-green-100 dark:border-green-800">
                <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Completed "Java Assignment"</p>
                  <span className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl hover:shadow-md transition-shadow border border-blue-100 dark:border-blue-800">
                <div className="w-12 h-12 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/><path d="M7 14a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"/><path d="M5 20a7 7 0 0 1 7-7"/><path d="M16 21a5 5 0 0 1 5-5"/></svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Joined "Data Structures Study Room"</p>
                  <span className="text-sm text-gray-600 dark:text-gray-400">5 hours ago</span>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl hover:shadow-md transition-shadow border border-yellow-100 dark:border-yellow-800">
                <div className="w-12 h-12 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17a4 4 0 0 0 4-4V5H8v8a4 4 0 0 0 4 4z"/><path d="M7 5H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5"/><path d="M17 5h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5"/></svg>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">Earned "Night Owl" badge</p>
                  <span className="text-sm text-gray-600 dark:text-gray-400">1 day ago</span>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="px-6 py-8 bg-gray-50 dark:bg-gray-900/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.28 1.32.73 1.77.45.45 1.08.73 1.77.73"/></svg>
              Study Preferences
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Pomodoro Timer</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">25 min / 5 min</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Favorite Playlist</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Lo-fi Beats</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11a7 7 0 0 1-7 7"/><path d="M5 19a7 7 0 0 1 7-7"/><path d="M5 5v14"/><path d="M19 5v14"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Theme</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Forest Zen</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Most Productive</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">9 PM - 12 AM</p>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="px-6 py-8 flex flex-col sm:flex-row gap-4">
            <Link
              to="/edit-profile"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
