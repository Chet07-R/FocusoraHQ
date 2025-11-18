import React, { useEffect, useState, useRef } from "react";
import { Users, Zap, Clock, CheckCircle, Star, Crown, Flame } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getLeaderboard } from "../utils/firestoreUtils";

const App = () => {
  const { user, userProfile } = useAuth();
  const { theme } = useTheme();
  
  // Stats state for animated statistics
  const [stats, setStats] = useState({
    users: 0,
    points: 0,
    sessions: 0,
    goalRate: 0,
  });

  // Leaderboard data
  const leaderboardData = [
    {
      rank: 1,
      name: "Chetan Ajmani",
      location: "us New York",
      points: 9876,
      today: "+356 today",
      sessions: 156,
      time: "142h 30m",
      streak: 25,
      badge: { label: "Champion", color: "green" },
      img: "/images/People/5.jpg",
    },
    {
      rank: 2,
      name: "Tanish Mehta",
      location: "us San Francisco",
      points: 8245,
      today: "+298 today",
      sessions: 127,
      time: "89h 15m",
      streak: 12,
      badge: { label: "Hot Streak", color: "green" },
      img: "/images/People/4.jpg",
    },
    {
      rank: 3,
      name: "Vansh Thakur",
      location: "ru Moscow",
      points: 7892,
      today: "+267 today",
      sessions: 101,
      time: "76h 45m",
      streak: 8,
      badge: { label: "Rising Star", color: "blue" },
      img: "/images/People/6.jpeg",
    },
    {
      rank: 4,
      name: "Aryan Garg",
      location: "us San Francisco",
      points: 6543,
      today: "+245 today",
      sessions: 84,
      time: "67h 23m",
      streak: 12,
      badge: { label: "Hot Streak", color: "green" },
      img: "/images/People/7.jpg",
    },
    {
      rank: 5,
      name: "Arush Mittal",
      location: "us California",
      points: 6543,
      today: "+245 today",
      sessions: 84,
      time: "67h 23m",
      streak: 12,
      badge: { label: "Hot Streak", color: "green" },
      img: "/images/People/15.jpg",
    },
    {
      rank: 6,
      name: "Pratham Gupta",
      location: "gb London",
      points: 5987,
      today: "+189 today",
      sessions: 72,
      time: "58h 15m",
      streak: 8,
      badge: { label: "Bookworm", color: "blue" },
      img: "/images/People/8.png",
    },
    {
      rank: 7,
      name: "Pratibha",
      location: "ca Toronto",
      points: 5234,
      today: "+156 today",
      sessions: 65,
      time: "52h 8m",
      streak: 5,
      badge: { label: "Speed Demon", color: "purple" },
      img: "/images/People/9.enc",
    },
    {
      rank: 8,
      name: "Vaibhav Garg",
      location: "sg Singapore",
      points: 4892,
      today: "+134 today",
      sessions: 61,
      time: "48h 32m",
      streak: 15,
      badge: { label: "Consistent", color: "orange" },
      img: "/images/People/10.jpg",
    },
    {
      rank: 9,
      name: "Bhoomi Kataria",
      location: "us Mississippi",
      points: 4892,
      today: "+134 today",
      sessions: 61,
      time: "48h 32m",
      streak: 15,
      badge: { label: "Consistent", color: "orange" },
      img: "/images/People/16.jpg",
    },
    {
      rank: 10,
      name: "Bhavya Kaushal",
      location: "eng Manchester",
      points: 3120,
      today: "+78 today",
      sessions: 41,
      time: "25h 12m",
      streak: 3,
      badge: { label: "Newcomer", color: "slate" },
      img: "/images/People/12.enc",
    },
    {
      rank: 11,
      name: "Ishween",
      location: "br São Paulo",
      points: 3770,
      today: "+67 today",
      sessions: 48,
      time: "32h 15m",
      streak: 2,
      badge: { label: "Steady", color: "gray" },
      img: "/images/People/11.enc",
    },
    {
      rank: 12,
      name: "Arnav",
      location: "us California",
      points: 3247,
      today: "+89 today",
      sessions: 45,
      time: "28h 45m",
      streak: 3,
      badge: { label: "Rising Star", color: "blue" },
      img: "/images/People/13.enc",
    },
    {
      rank: 13,
      name: "Akaash Grover",
      location: "kr Seoul",
      points: 3156,
      today: "+78 today",
      sessions: 41,
      time: "25h 12m",
      streak: 0,
      badge: { label: "Newcomer", color: "slate" },
      img: "/images/People/14.enc",
    },
  ];

  // State management for load more functionality
  const [visibleCount] = useState(10);
  const idRef = useRef(leaderboardData.length + 1);

  // Get current user's info for matching
  const currentUserEmail = user?.email;
  const currentUserName = userProfile?.displayName || user?.displayName || "You";
  const currentUserPhoto = userProfile?.photoURL || user?.photoURL || "/images/People/default-avatar.png";

  // Helper function to check if names match (exact or partial)
  function namesMatch(name1, name2) {
    if (!name1 || !name2) return false;
    const n1 = name1.toLowerCase().trim();
    const n2 = name2.toLowerCase().trim();
    return n1 === n2 || n1.includes(n2) || n2.includes(n1);
  }

  // Dynamic users from Firestore (global)
  const [dynamicUsers, setDynamicUsers] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);

  // Badge color mapping function
  const getBadgeColor = (color) => {
    const colors = {
      green: "bg-green-600 dark:bg-green-500",
      blue: "bg-blue-600 dark:bg-blue-500",
      purple: "bg-purple-600 dark:bg-purple-500",
      orange: "bg-orange-600 dark:bg-orange-500",
      slate: "bg-slate-600 dark:bg-slate-500",
      gray: "bg-gray-600 dark:bg-gray-500",
    };
    return colors[color] || "bg-gray-600 dark:bg-gray-500";
  };

  // Load more handler function - shows all remaining data
  const handleLoadMore = () => {
    setHasLoadedMore(true);
    setRows(allRows);
  };

  // Animate statistics on component mount
  useEffect(() => {
    const animateValue = (key, end, duration) => {
      let start = 0;
      const increment = Math.ceil(end / 500);
      const stepTime = Math.floor(duration / 500);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setStats((prev) => ({ ...prev, [key]: end }));
          clearInterval(timer);
        } else {
          setStats((prev) => ({ ...prev, [key]: start }));
        }
      }, stepTime);
    };

    animateValue("users", 2847, 800);
    animateValue("points", 156, 800);
    animateValue("sessions", 8392, 800);
    animateValue("goalRate", 94, 800);
  }, []);

  // Subscribe to Firestore leaderboard (global users)
  useEffect(() => {
    const unsubscribe = getLeaderboard((users) => {
      const mapped = users.map((u) => ({
        id: u.id,
        name: u.displayName || "User",
        location: u.location || u.country || "Your Location",
        points: typeof u.points === 'number' ? u.points : 0,
        today: u.todayIncrement ? `+${u.todayIncrement} today` : "+0 today",
        sessions: u.studySessions || 0,
        time: (() => {
          const mins = u.totalStudyTime || 0;
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          return `${h}h ${m}m`;
        })(),
        streak: u.streak || 0,
        badge: {
          label: (u.points || 0) === 0 ? "Newcomer" : (u.streak || 0) >= 10 ? "Hot Streak" : "Steady",
          color: (u.points || 0) === 0 ? "slate" : (u.streak || 0) >= 10 ? "green" : "gray"
        },
        img: u.photoURL || "/images/People/default-avatar.png",
        you: user && u.id === user.uid,
      }));
      setDynamicUsers(mapped);
    }, 500);

    return () => unsubscribe && unsubscribe();
  }, [user]);

  // Build merged, sorted rows when dynamic or static data changes
  useEffect(() => {
    const staticNames = new Set(leaderboardData.map(u => (u.name || '').toLowerCase()));
    const filteredDynamic = dynamicUsers.filter(d => !staticNames.has((d.name || '').toLowerCase()));
    const merged = [...leaderboardData, ...filteredDynamic];

    // Sort by points desc, then sessions, then name
    merged.sort((a, b) =>
      (b.points || 0) - (a.points || 0) ||
      (b.sessions || 0) - (a.sessions || 0) ||
      String(a.name).localeCompare(String(b.name))
    );

    // Re-rank and add _id
    const ranked = merged.map((u, idx) => ({
      ...u,
      rank: idx + 1,
      _id: idx + 1
    }));

    setAllRows(ranked);
    setRows((prev) => hasLoadedMore ? ranked : ranked.slice(0, visibleCount));
  }, [dynamicUsers, hasLoadedMore]);

  // Initialize initial rows (before Firestore responds)
  useEffect(() => {
    const initial = leaderboardData.slice(0, visibleCount).map((u, idx) => ({
      ...u,
      _id: idx + 1
    }));
    setRows(initial);
    setAllRows(leaderboardData.map((u, idx) => ({
      ...u,
      _id: idx + 1
    })));
  }, []);

  return (
    <div className="min-h-screen bg-[#1a2332] dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section - Keep Original Dark Design */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Leaderboard
          </h1>
          <p className="text-gray-400 text-lg">
            Track your progress and compete with focused learners worldwide
          </p>
        </div>

        {/* Stats Section - Keep Original Dark Design with Colored Shadow Hover Effects */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-white mb-8">
            Platform Statistics
          </h2>
          <p className="text-center text-gray-400 mb-8">
            See how our global community is performing
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Users - Blue Glow */}
            <div className="bg-[#252f3f] dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-gray-800 dark:shadow-gray-950 hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 border border-[#2d3748] dark:border-gray-700 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-blue-400">
                  {stats.users.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400 font-medium">Active Users</p>
            </div>

            {/* Points Today - Pink/Magenta Glow */}
            <div className="bg-[#252f3f] dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-gray-800 dark:shadow-gray-950 hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 border border-[#2d3748] dark:border-gray-700 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-pink-900/30 rounded-lg">
                  <Zap className="w-6 h-6 text-pink-400" />
                </div>
                <span className="text-3xl font-bold text-pink-400">
                  {stats.points.toLocaleString()}K
                </span>
              </div>
              <p className="text-gray-400 font-medium">Points Today</p>
            </div>

            {/* Focus Sessions - Yellow Glow */}
            <div className="bg-[#252f3f] dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-gray-800 dark:shadow-gray-950 hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 border border-[#2d3748] dark:border-gray-700 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-3xl font-bold text-yellow-400">
                  {stats.sessions.toLocaleString()}
                </span>
              </div>
              <p className="text-gray-400 font-medium">Focus Sessions</p>
            </div>

            {/* Goal Rate - Green Glow */}
            <div className="bg-[#252f3f] dark:bg-gray-800 rounded-2xl p-6 shadow-lg shadow-gray-800 dark:shadow-gray-950 hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 border border-[#2d3748] dark:border-gray-700 transform hover:scale-105 hover:-translate-y-1 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-3xl font-bold text-green-400">
                  {stats.goalRate}%
                </span>
              </div>
              <p className="text-gray-400 font-medium">Goal Rate</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-200 mb-8">
            This month's top performers
          </h2>
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            {rows[1] && (
              <div className="w-full md:w-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-gray-300 dark:border-gray-600">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={rows[1].img}
                      alt={rows[1].name}
                      className="w-20 h-20 rounded-full border-4 border-gray-400 dark:border-gray-500 object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src.endsWith('Profile_Icon.png')) return;
                        e.currentTarget.src = '/images/Profile_Icon.png';
                      }}
                    />
                    <div className="absolute -top-2 -right-2 bg-gray-400 dark:bg-gray-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                      2
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
                  {rows[1].name}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {rows[1].location}
                </p>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {rows[1].points.toLocaleString()}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {rows[1].sessions} sessions • {rows[1].time}
                  </p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {rows[0] && (
              <div className="w-full md:w-72 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all duration-300 border-4 border-yellow-400 dark:border-yellow-600 md:mb-8">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={rows[0].img}
                      alt={rows[0].name}
                      className="w-24 h-24 rounded-full border-4 border-yellow-400 dark:border-yellow-600 object-cover shadow-lg"
                      onError={(e) => {
                        if (e.currentTarget.src.endsWith('Profile_Icon.png')) return;
                        e.currentTarget.src = '/images/Profile_Icon.png';
                      }}
                    />
                    <div className="absolute -top-2 -right-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
                      <Crown className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
                  {rows[0].name}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
                  {rows[0].location}
                </p>
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {rows[0].points.toLocaleString()}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {rows[0].sessions} sessions • {rows[0].time}
                  </p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {rows[2] && (
              <div className="w-full md:w-64 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-orange-300 dark:border-orange-600">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <img
                      src={rows[2].img}
                      alt={rows[2].name}
                      className="w-20 h-20 rounded-full border-4 border-orange-400 dark:border-orange-500 object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src.endsWith('Profile_Icon.png')) return;
                        e.currentTarget.src = '/images/Profile_Icon.png';
                      }}
                    />
                    <div className="absolute -top-2 -right-2 bg-orange-500 dark:bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
                      3
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
                  {rows[2].name}
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {rows[2].location}
                </p>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                    {rows[2].points.toLocaleString()}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {rows[2].sessions} sessions • {rows[2].time}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Full Leaderboard Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700">
            <h2 className="text-2xl font-bold text-white">
              Track your progress among all users
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Sessions
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Focus Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Streak
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {rows.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150
                      ${user.you ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}
                      ${index < 3 ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''}
                    `}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`
                          text-lg font-bold
                          ${index === 0 ? 'text-yellow-600 dark:text-yellow-400' : ''}
                          ${index === 1 ? 'text-gray-600 dark:text-gray-400' : ''}
                          ${index === 2 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-800 dark:text-gray-200'}
                        `}>
                          {user.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.img}
                          alt={user.name}
                          className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 object-cover mr-3"
                          onError={(e) => {
                            if (e.currentTarget.src.endsWith('Profile_Icon.png')) return;
                            e.currentTarget.src = '/images/Profile_Icon.png';
                          }}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              {user.name}
                            </span>
                            {user.you && (
                              <span className="px-2 py-1 text-xs font-bold bg-indigo-600 dark:bg-indigo-500 text-white rounded-full">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-800 dark:text-gray-200">
                        <div className="font-bold text-lg">
                          {user.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400">
                          {user.today}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                      {user.sessions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200 font-medium">
                      {user.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {user.streak > 0 && (
                          <Flame className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                        )}
                        <span className="font-bold text-gray-800 dark:text-gray-200">
                          {user.streak}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold text-white
                        ${getBadgeColor(user.badge.color)}
                      `}>
                        {user.badge.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!hasLoadedMore && rows.length < allRows.length && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleLoadMore}
                className="w-full py-3 px-6 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Load More Users
              </button>
            </div>
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Understanding the point system to climb the leaderboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
