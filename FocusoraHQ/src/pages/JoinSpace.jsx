import React, { useState } from "react";

const JoinSpace = () => {
  const allRooms = [
    {
      icon: "💻",
      title: "Math Study Group",
      tags: ["Calculus Revision", "3/12 users"],
      color: "blue",
      borderColor: "border-blue-600 dark:border-blue-400",
    },
    {
      icon: "📚",
      title: "Focus & Flow",
      tags: ["Study", "Host: Alex C.", "5/10 users"],
      color: "cyan",
      borderColor: "border-cyan-600 dark:border-cyan-400",
    },
    {
      icon: "✍️",
      title: "Writers' Retreat",
      tags: ["Writing", "Host: Mike R.", "3/8 users"],
      color: "purple",
      borderColor: "border-purple-600 dark:border-purple-400",
    },
    {
      icon: "🌅",
      title: "Morning Motivation",
      tags: ["Accountability", "Host: Jessica Y.", "12/20 users"],
      color: "yellow",
      borderColor: "border-yellow-500 dark:border-yellow-400",
    },
    {
      icon: "🧠",
      title: "AI Learners Hub",
      tags: ["Machine Learning", "Host: Neha P.", "6/15 users"],
      color: "pink",
      borderColor: "border-pink-600 dark:border-pink-400",
    },
    {
      icon: "🧩",
      title: "Puzzle Masters",
      tags: ["Critical Thinking", "Host: Riya K.", "2/10 users"],
      color: "indigo",
      borderColor: "border-indigo-600 dark:border-indigo-400",
    },
    {
      icon: "🚀",
      title: "Startup Think Tank",
      tags: ["Innovation", "Host: Arjun V.", "8/20 users"],
      color: "orange",
      borderColor: "border-orange-600 dark:border-orange-400",
    },
    {
      icon: "🎨",
      title: "Art & Design Studio",
      tags: ["Creativity", "Host: Mira D.", "5/12 users"],
      color: "rose",
      borderColor: "border-rose-600 dark:border-rose-400",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);

  // Filter rooms by title, host, or tags
  const filteredRooms = allRooms.filter((room) => {
    const text = searchTerm.toLowerCase();
    return (
      room.title.toLowerCase().includes(text) ||
      room.tags.some((tag) => tag.toLowerCase().includes(text))
    );
  });

  // Rooms currently visible
  const visibleRooms = filteredRooms.slice(0, visibleCount);

  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Navbar Placeholder */}
      <nav className="navbar"></nav>

      <main className="max-w-5xl mx-auto px-4 py-16 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
            Join a Study Room
          </h1>
          <p className="text-lg text-blue-800 dark:text-blue-200 mb-6">
            Find your perfect focus group and join a thriving community!
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <input
            type="text"
            placeholder="Search rooms by name, topic, or host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-4 rounded-xl border-0 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-all"
          >
            Clear
          </button>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleRooms.length > 0 ? (
            visibleRooms.map((room, i) => (
              <div
                key={i}
                className={`bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border-t-4 ${room.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{room.icon}</span>
                  <span className="font-bold text-lg text-blue-900 dark:text-blue-200">
                    {room.title}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {room.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={`px-3 py-1 rounded-full ${
                        tag.includes("Host")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : tag.includes("users")
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all w-full">
                  Join
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-400 col-span-2 py-10">
              No rooms found. Try another search!
            </p>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredRooms.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount(visibleCount + 2)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-all text-lg flex items-center gap-2"
            >
              <span>Load More</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Footer Placeholder */}
      <footer className="footer"></footer>
    </div>
  );
};

export default JoinSpace;
