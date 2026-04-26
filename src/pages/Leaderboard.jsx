import React, { useEffect, useMemo, useState } from "react";
import { Users, Zap, Clock, CheckCircle, Star, Crown, Flame, Trophy, Rocket, Target, Medal } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getLeaderboard } from "../utils/firestoreUtils";
import { POINT_RULES } from "../constants/pointsSystem";

const getBadgeMeta = (points, streak, sessions) => {
  if (points <= 0) return { label: "Newcomer", color: "slate" };
  if (streak >= 30) return { label: "Legend", color: "purple" };
  if (streak >= 10) return { label: "Hot Streak", color: "green" };
  if (sessions >= 10) return { label: "Rising Star", color: "blue" };
  return { label: "Steady", color: "gray" };
};

const LEAGUES = [
  { name: "Bronze", minPoints: 0, color: "from-amber-600 to-orange-700" },
  { name: "Silver", minPoints: 500, color: "from-slate-400 to-slate-600" },
  { name: "Gold", minPoints: 1200, color: "from-yellow-300 to-yellow-500" },
  { name: "Platinum", minPoints: 2500, color: "from-cyan-300 to-blue-500" },
  { name: "Diamond", minPoints: 5000, color: "from-fuchsia-400 to-violet-600" },
];

const getLeagueByPoints = (points = 0) => {
  const safePoints = Number(points) || 0;
  const league = [...LEAGUES].reverse().find((entry) => safePoints >= entry.minPoints);
  return league || LEAGUES[0];
};

const getNextLeague = (points = 0) => {
  const safePoints = Number(points) || 0;
  return LEAGUES.find((entry) => safePoints < entry.minPoints) || null;
};

const getQuestProgress = (value, target) => {
  const safeValue = Math.max(0, Number(value) || 0);
  const safeTarget = Math.max(1, Number(target) || 1);
  return Math.min(100, Math.round((safeValue / safeTarget) * 100));
};

const App = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    points: 0,
    sessions: 0,
    goalRate: 0,
  });

  const [visibleCount] = useState(10);
  const [sortMode, setSortMode] = useState("points");

  const [dynamicUsers, setDynamicUsers] = useState([]);
  const [allRows, setAllRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [hasLoadedMore, setHasLoadedMore] = useState(false);
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

  const handleLoadMore = () => {
    setHasLoadedMore(true);
    setRows(allRows);
  };

  useEffect(() => {
    const unsubscribe = getLeaderboard((users) => {
      const mapped = users.map((u) => ({
        id: String(u.uid || u._id || u.id || ''),
        name: u.displayName || "User",
        location: u.location || u.country || "Your Location",
        points: typeof u.points === 'number' ? u.points : 0,
        today: u.todayIncrement ? `+${u.todayIncrement} today` : "",
        sessions: u.sessionsCount || u.studySessions || 0,
        time: (() => {
          const mins = u.totalStudyMinutes || u.totalStudyTime || 0;
          const h = Math.floor(mins / 60);
          const m = mins % 60;
          return `${h}h ${m}m`;
        })(),
        streak: u.focusStreak || u.streak || 0,
        badge: getBadgeMeta(
          typeof u.points === 'number' ? u.points : 0,
          u.focusStreak || u.streak || 0,
          u.sessionsCount || u.studySessions || 0
        ),
        img: u.photoURL || "/images/People/default-avatar.png",
        you: user && String(u.uid || u._id || u.id || '') === String(user.uid || user._id || ''),
      }));
      setDynamicUsers(mapped);
    }, 500);
    return () => unsubscribe && unsubscribe();
  }, [user]);

  useEffect(() => {
    const ranked = [...dynamicUsers]
      .sort((a, b) => {
        if (sortMode === "streak") {
          return (b.streak || 0) - (a.streak || 0) || (b.points || 0) - (a.points || 0) || String(a.name).localeCompare(String(b.name));
        }
        if (sortMode === "sessions") {
          return (b.sessions || 0) - (a.sessions || 0) || (b.points || 0) - (a.points || 0) || String(a.name).localeCompare(String(b.name));
        }

        return (b.points || 0) - (a.points || 0) || (b.sessions || 0) - (a.sessions || 0) || String(a.name).localeCompare(String(b.name));
      })
      .map((u, idx) => ({ ...u, rank: idx + 1, _id: String(u.id || idx + 1) }));
    setAllRows(ranked);
    setRows(hasLoadedMore ? ranked : ranked.slice(0, visibleCount));

    const usersCount = ranked.length;
    const pointsTotal = ranked.reduce((sum, row) => sum + (Number(row.points) || 0), 0);
    const sessionsTotal = ranked.reduce((sum, row) => sum + (Number(row.sessions) || 0), 0);
    const activeUsers = ranked.filter((row) => (Number(row.sessions) || 0) > 0).length;
    const goalRate = usersCount > 0 ? Math.round((activeUsers / usersCount) * 100) : 0;
    setStats({
      users: usersCount,
      points: pointsTotal,
      sessions: sessionsTotal,
      goalRate,
    });
  }, [dynamicUsers, hasLoadedMore, sortMode, visibleCount]);

  const currentUserRow = useMemo(() => {
    if (!user) return null;
    return allRows.find((row) => row.you) || null;
  }, [allRows, user]);

  const currentLeague = useMemo(() => getLeagueByPoints(currentUserRow?.points || 0), [currentUserRow]);
  const nextLeague = useMemo(() => getNextLeague(currentUserRow?.points || 0), [currentUserRow]);
  const pointsToNextLeague = Math.max(0, (nextLeague?.minPoints || 0) - (currentUserRow?.points || 0));
  const leagueProgress = useMemo(() => {
    if (!nextLeague) return 100;
    const currentFloor = currentLeague?.minPoints || 0;
    const currentPoints = Math.max(currentFloor, Number(currentUserRow?.points) || 0);
    const span = Math.max(1, nextLeague.minPoints - currentFloor);
    return Math.min(100, Math.round(((currentPoints - currentFloor) / span) * 100));
  }, [currentLeague, currentUserRow, nextLeague]);

  const questBoard = useMemo(() => {
    const sessions = currentUserRow?.sessions || 0;
    const streak = currentUserRow?.streak || 0;
    const totalStudyMinutes = (() => {
      const [hoursPart, minutesPart] = String(currentUserRow?.time || "0h 0m").split(" ");
      const hours = Number(String(hoursPart || "0").replace("h", "")) || 0;
      const minutes = Number(String(minutesPart || "0").replace("m", "")) || 0;
      return (hours * 60) + minutes;
    })();

    return [
      {
        id: "quest-sessions",
        label: "Complete 10 focus sessions",
        reward: 60,
        progress: getQuestProgress(sessions, 10),
        done: sessions >= 10,
      },
      {
        id: "quest-streak",
        label: "Reach a 7-day streak",
        reward: 120,
        progress: getQuestProgress(streak, 7),
        done: streak >= 7,
      },
      {
        id: "quest-minutes",
        label: "Accumulate 600 focus minutes",
        reward: 200,
        progress: getQuestProgress(totalStudyMinutes, 600),
        done: totalStudyMinutes >= 600,
      },
    ];
  }, [currentUserRow]);

  const rankingLabel = sortMode === "streak" ? "Streak Masters" : sortMode === "sessions" ? "Session Sprinters" : "Points Ranking";

  return (
    <div className={`min-h-screen pt-24 bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>

      <section className="pb-12 text-center border-b border-white/20 dark:border-gray-700/50">
        <div className="flex justify-center mb-6">
          <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-md">
            <Star className="w-6 h-6" />
          </div>
        </div>
        <h1 className={`text-4xl md:text-5xl font-extrabold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Leaderboard
        </h1>
        <p className={`text-base md:text-lg max-w-xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Track your progress and compete with focused learners worldwide
        </p>
      </section>

      <section className="px-6 md:px-20 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`lg:col-span-2 rounded-2xl p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border-gray-700/60' : 'bg-white/85 border-white/70 shadow-lg'}`}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className={`text-sm uppercase tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your League</p>
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentLeague.name}</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mt-1`}>
                  {currentUserRow
                    ? (nextLeague
                      ? `${pointsToNextLeague} points to ${nextLeague.name}`
                      : "You are at the highest league")
                    : "Sign in to track your personal progression"}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${currentLeague.color} text-white flex items-center justify-center shadow-xl`}>
                <Trophy className="w-7 h-7" />
              </div>
            </div>

            <div className={`mt-5 h-3 rounded-full ${darkMode ? 'bg-gray-700/70' : 'bg-gray-200'}`}>
              <div
                className={`h-full rounded-full bg-gradient-to-r ${currentLeague.color} transition-all duration-700`}
                style={{ width: `${leagueProgress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{currentLeague.name}</span>
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{nextLeague ? nextLeague.name : 'MAX'}</span>
            </div>
          </div>

          <div className={`rounded-2xl p-6 border backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border-gray-700/60' : 'bg-white/85 border-white/70 shadow-lg'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-cyan-400" />
              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Focus Quest Board</h3>
            </div>

            <div className="space-y-3">
              {questBoard.map((quest) => (
                <div key={quest.id} className={`rounded-xl p-3 border ${darkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50/80'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <p className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{quest.label}</p>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${quest.done ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                      {quest.done ? 'Done' : `+${quest.reward} XP`}
                    </span>
                  </div>
                  <div className={`mt-2 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full ${quest.done ? 'bg-green-500' : 'bg-cyan-500'} transition-all duration-500`}
                      style={{ width: `${quest.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-6 md:px-20 text-center">
        <h2 className={`text-2xl md:text-3xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Platform Statistics
        </h2>
        <p className={`mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          See how our global community is performing
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className={`p-8 rounded-2xl shadow-lg hover:shadow-cyan-600/30 transition-all backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-white/80 border border-white/50'}`}>
            <div className="flex justify-center mb-4 text-blue-500">
              <Users className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-blue-400">
              {stats.users.toLocaleString()}
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Users</p>
          </div>
          <div className={`p-8 rounded-2xl shadow-lg hover:shadow-pink-600/30 transition-all backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-white/80 border border-white/50'}`}>
            <div className="flex justify-center mb-4 text-pink-500">
              <Zap className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-pink-400">{stats.points.toLocaleString()}</h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Points</p>
          </div>
          <div className={`p-8 rounded-2xl shadow-lg hover:shadow-yellow-600/30 transition-all backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-white/80 border border-white/50'}`}>
            <div className="flex justify-center mb-4 text-yellow-400">
              <Clock className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-yellow-400">
              {stats.sessions.toLocaleString()}
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Focus Sessions</p>
          </div>
          <div className={`p-8 rounded-2xl shadow-lg hover:shadow-green-600/30 transition-all backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-white/80 border border-white/50'}`}>
            <div className="flex justify-center mb-4 text-green-500">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-green-400">
              {stats.goalRate}%
            </h3>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goal Rate</p>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-400 text-black w-12 h-12 rounded-full flex items-center justify-center shadow-md">
              <Star className="w-6 h-6" />
            </div>
          </div>

          <h2 className={`text-3xl md:text-4xl font-extrabold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Hall of Champions</h2>
          <p className={`mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rankingLabel}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {(allRows.length >= 3
              ? [allRows[1], allRows[0], allRows[2]]
              : allRows.slice(0, 3)
            ).map((u, displayIdx) => {
              if (!u) return null;
              const isChampion = displayIdx === 1; 
              const actualRank = u.rank;
              // CSS order for mobile: 1st, 2nd, 3rd
              const mobileOrder = actualRank === 1 ? 'order-1' : actualRank === 2 ? 'order-2' : 'order-3';
              
              return (
                <div
                  key={`${u.name}-${displayIdx}`}
                  className={`${mobileOrder} md:order-none rounded-2xl p-8 shadow-lg transition-all duration-500 ease-out transform hover:scale-110 hover:shadow-[0_20px_50px_rgba(59,130,246,0.5)] hover:-translate-y-3 hover:z-50 relative backdrop-blur-sm ${
                    isChampion
                      ? `scale-105 border-4 border-blue-600 ${darkMode ? 'bg-gradient-to-b from-blue-900/80 to-blue-800/80 hover:from-blue-800/90 hover:to-blue-700/90' : 'bg-gradient-to-b from-blue-100/80 to-blue-200/80 hover:from-blue-200/90 hover:to-blue-300/90'} hover:border-blue-400`
                      : `${darkMode ? 'bg-gray-800/70 hover:bg-gradient-to-br hover:from-gray-800/80 hover:to-gray-900/80 border border-gray-700/50' : 'bg-white/80 hover:bg-gradient-to-br hover:from-blue-50/90 hover:to-gray-50/90 border border-white/50'} hover:border-2 hover:border-blue-500/30`
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {isChampion && (
                      <div className="mb-3 text-yellow-300">
                        <Crown className="w-10 h-10" />
                      </div>
                    )}

                    <div className={`w-28 h-28 rounded-full overflow-hidden border-4 ${isChampion ? 'border-blue-400' : darkMode ? 'border-gray-600' : 'border-gray-300'} mb-4`}>
                      <img
                        src={u.img}
                        alt={u.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          if (e.currentTarget.src.endsWith('Profile_Icon.png')) return;
                          e.currentTarget.src = '/images/Profile_Icon.png';
                        }}
                      />
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{u.name}</h3>

                    <p className={`text-3xl font-extrabold ${isChampion ? (darkMode ? 'text-blue-300' : 'text-blue-600') : 'text-blue-400'}`}>
                      {u.points.toLocaleString()}
                    </p>

                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{u.sessions} sessions • {u.time}</p>

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
      <section className="py-20 px-6 md:px-20 border-t border-white/20 dark:border-gray-700/50">
        <div className={`rounded-t-2xl overflow-hidden backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 border border-gray-700/50' : 'bg-white/80 border border-white/50 shadow-lg'}`}>
          <div className={`py-4 px-6 text-left text-lg font-semibold ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'}`}>
            Complete Rankings
            <p className="text-sm text-gray-200 font-normal">
              Track your progress among all users
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[{ key: 'points', label: 'Points', icon: Star }, { key: 'streak', label: 'Streak', icon: Flame }, { key: 'sessions', label: 'Sessions', icon: Rocket }].map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => {
                    setSortMode(mode.key);
                    setHasLoadedMore(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${sortMode === mode.key ? 'bg-white text-blue-700 border-white' : 'bg-blue-800/40 text-blue-100 border-blue-300/30 hover:bg-blue-800/60'}`}
                >
                  <mode.icon className="w-3.5 h-3.5" />
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className={`overflow-x-auto ${darkMode ? 'bg-gray-900/40' : 'bg-white/60'}`}>
            <table className={`min-w-full text-left text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <thead className={`uppercase text-xs ${darkMode ? 'bg-[#1e263b] text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Points</th>
                  <th className="px-6 py-3">Sessions</th>
                  <th className="px-6 py-3">Focus Time</th>
                  <th className="px-6 py-3">Streak</th>
                  <th className="px-6 py-3">League</th>
                  <th className="px-6 py-3">Badge</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr
                    key={user._id}
                    className={`border-t transition ${
                      darkMode 
                        ? `border-gray-700 hover:bg-[#1b243a] ${user.you ? 'bg-[#13213a]' : ''}` 
                        : `border-gray-200 hover:bg-gray-50 ${user.you ? 'bg-blue-50' : ''}`
                    }`}
                  >
                    <td className={`px-6 py-4 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                      {user.rank}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={user.img}
                        alt={user.name}
                        className={`w-9 h-9 rounded-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                        onError={(e) => {
                          if (e.currentTarget.src.endsWith('Profile_Icon.png')) return;
                          e.currentTarget.src = '/images/Profile_Icon.png';
                        }}
                      />
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {user.name}
                          {user.you && (
                            <span className="text-xs text-blue-400 font-semibold ml-2">YOU</span>
                          )}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-blue-400 font-semibold">
                      {user.points.toLocaleString()}
                      {user.today && <span className="text-xs text-green-400 ml-1">{user.today}</span>}
                    </td>
                    <td className="px-6 py-4">{user.sessions}</td>
                    <td className="px-6 py-4">{user.time}</td>
                    <td className="px-6 py-4 flex items-center gap-1">
                      <Flame className="text-orange-400 w-4 h-4" />
                      {user.streak} days
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white bg-gradient-to-r ${getLeagueByPoints(user.points).color}`}>
                        {getLeagueByPoints(user.points).name}
                      </span>
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
          <div className={`flex justify-center gap-4 py-6 rounded-b-2xl ${darkMode ? 'bg-gray-900/40' : 'bg-white/60 border-t border-gray-200/50'}`}>
            <button
              onClick={handleLoadMore}
              disabled={hasLoadedMore || rows.length >= allRows.length}
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              className="text-white cursor-pointer font-semibold px-8 py-3 rounded-xl hover:brightness-110 transform hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:hover:scale-100"
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.5), 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
            >
              {hasLoadedMore || rows.length >= allRows.length ? 'All Rankings Loaded' : 'Load More Rankings'}
            </button>
          </div>
        </div>
        <section className="py-20 px-6 md:px-20">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              How Points Are Calculated
            </h2>
            <p className={`mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              These are the live scoring rules used for leaderboard updates
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative hover:z-50 backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/80 hover:bg-white/90 border border-white/50'}`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-yellow-400 ${darkMode ? 'bg-[#0b141b]' : 'bg-yellow-50'}`}>
                    <Clock className="w-8 h-8" />
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Focus Sessions</h3>
                <ul className="space-y-3 text-left">
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-[#07121a] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <span>Per focused minute</span>
                    <span className="text-blue-300 font-semibold">+{POINT_RULES.pomodoroPerMinute} pt</span>
                  </li>
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-[#07121a] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <span>25min session</span>
                    <span className="text-blue-300 font-semibold">+{25 * POINT_RULES.pomodoroPerMinute} pts</span>
                  </li>
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-gradient-to-r from-cyan-900 to-transparent text-gray-300' : 'bg-gradient-to-r from-cyan-100 to-transparent text-gray-700'}`}>
                    <span>50min session</span>
                    <span className="text-teal-300 font-semibold">+{50 * POINT_RULES.pomodoroPerMinute} pts</span>
                  </li>
                </ul>
              </div>

              <div className={`rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative hover:z-50 backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/80 hover:bg-white/90 border border-white/50'}`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-teal-300 ${darkMode ? 'bg-[#0b141b]' : 'bg-teal-50'}`}>
                    <CheckCircle className="w-8 h-8" />
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Tasks & Notes</h3>
                <ul className="space-y-3 text-left">
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-[#07121a] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <span>Notes save</span>
                    <span className="text-cyan-200 font-semibold">+{POINT_RULES.notesSave} pt</span>
                  </li>
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-[#07121a] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <span>Add new task</span>
                    <span className="text-cyan-200 font-semibold">+{POINT_RULES.taskAdded} pt</span>
                  </li>
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-gradient-to-r from-purple-900 to-transparent text-gray-300' : 'bg-gradient-to-r from-purple-100 to-transparent text-gray-700'}`}>
                    <span>Complete task</span>
                    <span className="text-pink-300 font-semibold">+{POINT_RULES.taskCompleted} pts</span>
                  </li>
                </ul>
              </div>

              <div className={`rounded-2xl p-8 shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative hover:z-50 backdrop-blur-sm ${darkMode ? 'bg-gray-800/60 hover:bg-gray-800/70 border border-gray-700/50' : 'bg-white/80 hover:bg-white/90 border border-white/50'}`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-red-400 ${darkMode ? 'bg-[#0b141b]' : 'bg-red-50'}`}>
                    <Zap className="w-8 h-8" />
                  </div>
                </div>
                <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Consistency & Rank</h3>
                <ul className="space-y-3 text-left">
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-[#07121a] text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                    <span>Any scoring action</span>
                    <span className="text-yellow-300 font-semibold">Updates streak</span>
                  </li>
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 border border-orange-700 ${darkMode ? 'bg-[#2b1a10] text-gray-300' : 'bg-orange-50 text-gray-700'}`}>
                    <span>Leaderboard refresh</span>
                    <span className="text-orange-300 font-semibold">Every 5 seconds</span>
                  </li>
                  <li className={`flex justify-between items-center rounded-md px-4 py-3 ${darkMode ? 'bg-gradient-to-r from-pink-900 to-transparent text-gray-300' : 'bg-gradient-to-r from-pink-100 to-transparent text-gray-700'}`}>
                    <span>Badges</span>
                    <span className="text-pink-300 font-semibold">Based on points/streak</span>
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
