import React, { useEffect, useState, useRef } from "react";
import { Users, Zap, Clock, CheckCircle, Star, Crown, Flame } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const App = () => {
  const { user, userProfile } = useAuth();
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
  const [loadedCount, setLoadedCount] = useState(10);
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
  
  // Check if current user exists in leaderboard data
  const userExistsInData = leaderboardData.some(u => 
    namesMatch(u.name, currentUserName)
  );
  
  // Initialize rows with ALL ranks (including 1, 2, 3), marking current user
  const [rows, setRows] = useState(() => {
    const filteredData = leaderboardData; // Show all ranks now
    
    // If user doesn't exist in data and is logged in, add them
    let dataToShow = [...filteredData];
    if (user && !userExistsInData) {
      dataToShow.push({
        rank: 12,
        name: currentUserName,
        location: "Your Location",
        points: 3247,
        today: "+89 today",
        sessions: 45,
        time: "28h 45m",
        streak: 3,
        badge: { label: "Rising Star", color: "blue" },
        img: currentUserPhoto,
        you: true,
      });
    }
    
    return dataToShow
      .slice(0, visibleCount)
      .map((u, idx) => ({
        ...u,
        _id: idx + 1,
        you: (user && namesMatch(u.name, currentUserName))
      }));
  });

  // Badge color mapping function
  const getBadgeColor = (color) => {
    const colors = {
      green: "bg-green-600",
      blue: "bg-blue-600",
      purple: "bg-purple-600",
      orange: "bg-orange-600",
      slate: "bg-slate-600",
      gray: "bg-gray-600",
    };
    return colors[color] || "bg-gray-600";
  };

  // Load more handler function - shows all remaining data
  const handleLoadMore = () => {
    const filteredData = leaderboardData; // Load from all ranks
    setRows(filteredData.map((u, idx) => ({
        ...u,
        _id: idx + 1,
        you: (user && namesMatch(u.name, currentUserName))
      })));
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

  // Update rows when user login state changes
  useEffect(() => {
    if (user && currentUserName) {
      setRows((prevRows) => {
        // Check if user already exists in rows
        const userExists = prevRows.some(row => namesMatch(row.name, currentUserName));
        
        // If user doesn't exist, add them
        if (!userExists) {
          const newUserRow = {
            _id: idRef.current++,
            rank: 12,
            name: currentUserName,
            location: "Your Location",
            points: 3247,
            today: "+89 today",
            sessions: 45,
            time: "28h 45m",
            streak: 3,
            badge: { label: "Rising Star", color: "blue" },
            img: currentUserPhoto,
            you: true,
          };
          return [...prevRows, newUserRow];
        }
        
        // Otherwise just mark the matching row
        return prevRows.map((row) => ({
          ...row,
          you: namesMatch(row.name, currentUserName),
          img: namesMatch(row.name, currentUserName) ? currentUserPhoto : row.img
        }));
      });
    }
  }, [user, currentUserName, currentUserPhoto]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 pt-24">
      {/* ===== Hero Section ===== */}
      <section className="pb-12 text-center bg-gradient-to-b from-[#111827] to-[#0b0f19] border-b border-gray-800">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-md">
            <Star className="w-6 h-6" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-white">
          Leaderboard
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
          Track your progress and compete with focused learners worldwide
        </p>
      </section>

      {/* ===== Platform Statistics ===== */}
      <section className="py-12 px-6 md:px-20 bg-[#0b0f19] text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
          Platform Statistics
        </h2>
        <p className="text-gray-400 mb-10">
          See how our global community is performing
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-[#141a2a] p-8 rounded-2xl shadow-lg hover:shadow-cyan-600/30 transition-all">
            <div className="flex justify-center mb-4 text-blue-500">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-blue-400">
              {stats.users.toLocaleString()}
            </h3>
            <p className="text-gray-400 mt-2">Active Users</p>
          </div>
          <div className="bg-[#141a2a] p-8 rounded-2xl shadow-lg hover:shadow-pink-600/30 transition-all">
            <div className="flex justify-center mb-4 text-pink-500">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-pink-400">{stats.points}K</h3>
            <p className="text-gray-400 mt-2">Points Today</p>
          </div>
          <div className="bg-[#141a2a] p-8 rounded-2xl shadow-lg hover:shadow-yellow-600/30 transition-all">
            <div className="flex justify-center mb-4 text-yellow-400">
              <Clock className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-400">
              {stats.sessions.toLocaleString()}
            </h3>
            <p className="text-gray-400 mt-2">Focus Sessions</p>
          </div>
          <div className="bg-[#141a2a] p-8 rounded-2xl shadow-lg hover:shadow-green-600/30 transition-all">
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-green-400">
              {stats.goalRate}%
            </h3>
            <p className="text-gray-400 mt-2">Goal Rate</p>
          </div>
        </div>
      </section>

      {/* ===== Hall of Champions ===== */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#071019] to-[#0b0f19]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <Star className="w-6 h-6" />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Hall of Champions</h2>
          <p className="text-gray-400 mb-10">This month's top performers</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* Reorder to show: 2nd, 1st (center/tallest), 3rd, with safety guard */}
            {(leaderboardData.length >= 3
              ? [leaderboardData[1], leaderboardData[0], leaderboardData[2]]
              : leaderboardData.slice(0, 3)
            ).map((u, displayIdx) => {
              if (!u) return null;
              const isChampion = displayIdx === 1; // Middle position is champion
              const actualRank = u.rank;
              
              return (
                <div
                  key={`${u.name}-${displayIdx}`}
                  className={`rounded-2xl p-8 shadow-lg transition-all duration-500 ease-out transform hover:scale-110 hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] hover:-translate-y-3 hover:z-50 relative ${
                    isChampion
                      ? 'scale-105 border-4 border-blue-600 bg-gradient-to-b from-blue-900 to-blue-800 hover:border-blue-400 hover:from-blue-800 hover:to-blue-700'
                      : 'bg-[#111827] hover:bg-gradient-to-br hover:from-[#1a2840] hover:to-[#1a2332] hover:border-2 hover:border-blue-500/30'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {isChampion && (
                      <div className="mb-3 text-yellow-300">
                        <Crown className="w-10 h-10" />
                      </div>
                    )}

                    <div className={`w-28 h-28 rounded-full overflow-hidden border-4 ${isChampion ? 'border-blue-400' : 'border-gray-600'} mb-4`}>
                      <img src={u.img} alt={u.name} className="w-full h-full object-cover" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">{u.name}</h3>

                    <p className={`text-3xl font-extrabold ${isChampion ? 'text-blue-300' : 'text-blue-400'}`}>
                      {u.points.toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">{u.sessions} sessions • {u.time}</p>

                    <div className="flex gap-2 mt-4">
                      <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm">
                        {actualRank === 1 ? 'Champion' : actualRank === 2 ? '2nd' : '3rd'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-700 text-white text-sm">
                        {u.streak} day streak
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== Complete Rankings Table ===== */}
      <section className="py-20 px-6 md:px-20 bg-[#0b0f19] border-t border-gray-800">
        <div className="rounded-t-2xl overflow-hidden bg-[#111b2f]">
          <div className="bg-blue-700 text-white py-4 px-6 text-left text-lg font-semibold">
            Complete Rankings
            <p className="text-sm text-gray-200 font-normal">
              Track your progress among all users
            </p>
          </div>
          
          <div className="overflow-x-auto bg-[#141a2a]">
            <table className="min-w-full text-left text-sm text-gray-300">
              <thead className="bg-[#1e263b] text-gray-200 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Points</th>
                  <th className="px-6 py-3">Sessions</th>
                  <th className="px-6 py-3">Focus Time</th>
                  <th className="px-6 py-3">Streak</th>
                  <th className="px-6 py-3">Badge</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-t border-gray-700 hover:bg-[#1b243a] transition ${
                      user.you ? "bg-[#13213a]" : ""
                    }`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-200">
                      {user.rank}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.img}
                        alt={user.name}
                        className="w-9 h-9 rounded-full border border-gray-600"
                      />
                      <div>
                        <p className="font-medium text-gray-100">
                          {user.name}{" "}
                          {user.you && (
                            <span className="text-xs text-blue-400 font-semibold ml-1">
                              YOU
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{user.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-blue-400 font-semibold">
                      {user.points.toLocaleString()}
                      <span className="text-xs text-green-400 ml-1">
                        {user.today}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user.sessions}</td>
                    <td className="px-6 py-4">{user.time}</td>
                    <td className="px-6 py-4 flex items-center gap-1">
                      <Flame className="text-orange-400 w-4 h-4" />
                      {user.streak} days
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-white text-xs px-2 py-1 rounded-full ${getBadgeColor(
                          user.badge.color
                        )}`}
                      >
                        {user.badge.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Load More Button */}
          <div className="flex justify-center gap-4 py-6 bg-[#141a2a] rounded-b-2xl">
            <button
              onClick={handleLoadMore}
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              className="text-white font-semibold px-8 py-3 rounded-xl hover:brightness-110 transform hover:scale-105 transition-all duration-300"
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.5), 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
            >
              Load More Rankings
            </button>
            {leaderboardData.length > loadedCount && (
              <button
                onClick={handleLoadMore}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-md transition"
              >
                Load More Rankings
              </button>
            )}
          </div>
        </div>

        {/* ===== How to Earn Points ===== */}
        <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-[#0b0f19] to-[#071019]">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
              How to Earn Points
            </h2>
            <p className="text-gray-400 mb-10">
              Understanding the point system to climb the leaderboard
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Focus Sessions */}
              <div className="bg-[#0f1724] rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-[#121b2a] relative hover:z-50">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#0b141b] flex items-center justify-center text-yellow-400">
                    <Clock className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Focus Sessions</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between items-center bg-[#07121a] rounded-md px-4 py-3 text-gray-300">
                    <span>25min session</span>
                    <span className="text-blue-300 font-semibold">+10 pts</span>
                  </li>
                  <li className="flex justify-between items-center bg-[#07121a] rounded-md px-4 py-3 text-gray-300">
                    <span>50min session</span>
                    <span className="text-blue-300 font-semibold">+15 pts</span>
                  </li>
                  <li className="flex justify-between items-center bg-gradient-to-r from-cyan-900 to-transparent rounded-md px-4 py-3 text-gray-300">
                    <span>4 sessions/day</span>
                    <span className="text-teal-300 font-semibold">+50 bonus</span>
                  </li>
                </ul>
              </div>

              {/* Task Completion */}
              <div className="bg-[#0f1724] rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-[#121b2a] relative hover:z-50">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#0b141b] flex items-center justify-center text-teal-300">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Task Completion</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between items-center bg-[#07121a] rounded-md px-4 py-3 text-gray-300">
                    <span>Per task completed</span>
                    <span className="text-cyan-200 font-semibold">+5 pts</span>
                  </li>
                  <li className="flex justify-between items-center bg-[#07121a] rounded-md px-4 py-3 text-gray-300">
                    <span>Daily goal achieved</span>
                    <span className="text-cyan-200 font-semibold">+20 pts</span>
                  </li>
                  <li className="flex justify-between items-center bg-gradient-to-r from-purple-900 to-transparent rounded-md px-4 py-3 text-gray-300">
                    <span>Weekly goals met</span>
                    <span className="text-pink-300 font-semibold">+100 bonus</span>
                  </li>
                </ul>
              </div>

              {/* Streaks */}
              <div className="bg-[#0f1724] rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:bg-[#121b2a] relative hover:z-50">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#0b141b] flex items-center justify-center text-red-400">
                    <Zap className="w-8 h-8" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Streaks</h3>
                <ul className="space-y-3 text-left">
                  <li className="flex justify-between items-center bg-[#07121a] rounded-md px-4 py-3 text-gray-300">
                    <span>Daily streak bonus</span>
                    <span className="text-yellow-300 font-semibold">+25 pts</span>
                  </li>
                  <li className="flex justify-between items-center bg-[#2b1a10] rounded-md px-4 py-3 text-gray-300 border border-orange-700">
                    <span>7-day streak</span>
                    <span className="text-orange-300 font-semibold">+100 pts</span>
                  </li>
                  <li className="flex justify-between items-center bg-gradient-to-r from-pink-900 to-transparent rounded-md px-4 py-3 text-gray-300">
                    <span>30-day streak</span>
                    <span className="text-pink-300 font-semibold">+500 bonus</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default App;
