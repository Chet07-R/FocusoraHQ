import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import api from "../api";
import { deleteBlog as deleteBlogApi, listMyBlogs } from "../utils/blogsApi";
import { getUserActivityEvents } from "../utils/activityLog";

const BADGE_DEFS = [
  { id: "first-session", label: "First Focus", icon: "🎯", metric: "sessions", target: 1 },
  { id: "session-10", label: "10 Sessions", icon: "📚", metric: "sessions", target: 10 },
  { id: "hours-25", label: "25 Hours", icon: "⏱️", metric: "totalMinutes", target: 25 * 60 },
  { id: "hours-100", label: "100 Hours", icon: "🏆", metric: "totalMinutes", target: 100 * 60 },
  { id: "streak-7", label: "7-Day Streak", icon: "🔥", metric: "streak", target: 7 },
  { id: "streak-30", label: "30-Day Streak", icon: "🌟", metric: "streak", target: 30 },
];

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RECENT_ACTIVITY_STYLES = [
  {
    card: "bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800",
    icon: "bg-green-500 dark:bg-green-600",
  },
  {
    card: "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
    icon: "bg-blue-500 dark:bg-blue-600",
  },
  {
    card: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800",
    icon: "bg-yellow-500 dark:bg-yellow-600",
  },
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getSessionDate = (session) => {
  const raw = session?.endTime || session?.startTime || session?.updatedAt || session?.createdAt;
  if (!raw) return null;

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getWeekStart = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  const dayIndex = date.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;
  date.setDate(date.getDate() + mondayOffset);
  return date;
};

const formatStudyTime = (minutes) => {
  const safeMinutes = Math.max(0, Math.floor(toNumber(minutes)));
  const hours = Math.floor(safeMinutes / 60);
  const remMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `0h ${remMinutes}mins`;
  }

  return remMinutes > 0 ? `${hours}h ${remMinutes}mins` : `${hours}h`;
};

const formatBadgeProgress = (badge, currentValue) => {
  const safeCurrent = Math.max(0, Math.floor(toNumber(currentValue)));
  const clamped = Math.min(safeCurrent, badge.target);

  if (badge.metric === "totalMinutes") {
    return `${formatStudyTime(clamped)} / ${formatStudyTime(badge.target)}`;
  }

  if (badge.metric === "streak") {
    return `${clamped}/${badge.target} days`;
  }

  return `${clamped}/${badge.target} sessions`;
};

const formatDuration = (minutes) => {
  const safeMinutes = Math.max(0, Math.floor(toNumber(minutes)));
  if (safeMinutes < 60) {
    return `${safeMinutes} min`;
  }

  const hours = Math.floor(safeMinutes / 60);
  const remMinutes = safeMinutes % 60;
  return remMinutes > 0 ? `${hours}h ${remMinutes}m` : `${hours}h`;
};

const formatRelativeTime = (dateValue) => {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

const Profile = () => {
  const { user, userProfile } = useAuth();
  const { darkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [myBlogs, setMyBlogs] = useState([]);
  const [myBlogsLoading, setMyBlogsLoading] = useState(false);
  const [myBlogsError, setMyBlogsError] = useState('');
  const [deletePendingBlogId, setDeletePendingBlogId] = useState('');

  const trackedUserId = userProfile?._id || userProfile?.uid || user?._id || user?.uid || null;
  const [taskActivityEvents, setTaskActivityEvents] = useState([]);

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  useEffect(() => {
    if (!trackedUserId) {
      setTaskActivityEvents([]);
      return undefined;
    }

    const syncTaskEvents = async () => {
      try {
        setTaskActivityEvents(await getUserActivityEvents(50));
      } catch (error) {
        console.error("Failed to load activity events", error);
        setTaskActivityEvents([]);
      }
    };

    syncTaskEvents();

    const onActivityUpdated = (event) => {
      const eventUserId = String(event?.detail?.userId || "").trim();
      if (!eventUserId || eventUserId === String(trackedUserId)) {
        syncTaskEvents();
      }
    };

    window.addEventListener("focusora-activity-updated", onActivityUpdated);

    return () => {
      window.removeEventListener("focusora-activity-updated", onActivityUpdated);
    };
  }, [trackedUserId]);

  useEffect(() => {
    if (!trackedUserId || !localStorage.getItem("token")) {
      setProfileData(null);
      setSessionData([]);
      setMyBlogs([]);
      return undefined;
    }

    let active = true;

    const fetchProfileInsights = async () => {
      try {
        setMyBlogsLoading(true);
        setMyBlogsError('');

        const [profileRes, sessionsRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/sessions?limit=50"),
        ]);

        const blogs = await listMyBlogs(100);

        if (!active) return;

        setProfileData(profileRes.data || null);
        setSessionData(Array.isArray(sessionsRes.data) ? sessionsRes.data : []);
        setMyBlogs(Array.isArray(blogs) ? blogs : []);
      } catch (error) {
        if (!active) return;
        console.error("Failed to load profile insights", error);
        setMyBlogsError('Unable to load your blogs right now.');
      } finally {
        if (active) {
          setMyBlogsLoading(false);
        }
      }
    };

    fetchProfileInsights();
    const intervalId = window.setInterval(fetchProfileInsights, 30000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [trackedUserId]);

  const handleDeleteBlog = async (blogId) => {
    const confirmed = window.confirm('Delete this blog post? This cannot be undone.');
    if (!confirmed) return;

    setDeletePendingBlogId(String(blogId));
    setMyBlogsError('');

    try {
      await deleteBlogApi(blogId);
      setMyBlogs((prev) => prev.filter((blog) => String(blog.id || blog._id) !== String(blogId)));
    } catch (error) {
      setMyBlogsError(error?.response?.data?.message || 'Unable to delete your blog right now.');
    } finally {
      setDeletePendingBlogId('');
    }
  };

  const display = useMemo(() => {
    const source = profileData || userProfile || user || {};
    const name = source.displayName || "John Doe";
    const bio = source.bio || "Focus. Study. Thrive. 🎯";
    const photo = source.photoURL || "/images/Profile_Icon.png";
    const completedSessions = sessionData.filter((session) => Math.max(0, toNumber(session?.duration, 0)) > 0);
    const totalMinutesFromSessions = completedSessions.reduce(
      (sum, session) => sum + Math.max(0, toNumber(session?.duration, 0)),
      0
    );
    const totalMinutes = Math.max(
      0,
      toNumber(source.totalStudyMinutes, toNumber(source.totalStudyTime, 0)),
      totalMinutesFromSessions
    );
    const totalHours = formatStudyTime(totalMinutes);
    const sessions = Math.max(
      0,
      toNumber(source.sessionsCount, toNumber(source.studySessions, 0)),
      completedSessions.length
    );
    const points = Math.max(0, toNumber(source.points, 0));
    const streak = Math.max(0, toNumber(source.focusStreak, 0));
    const bestStreak = Math.max(0, toNumber(source.bestFocusStreak, 0));
    const pomodoroSessions = completedSessions.filter((session) =>
      String(session?.subject || "").toLowerCase().includes("pomodoro")
    );
    const pomodoros =
      pomodoroSessions.length > 0
        ? pomodoroSessions.length
        : completedSessions.length > 0
          ? completedSessions.length
          : sessions;

    return { name, bio, photo, totalMinutes, totalHours, sessions, points, streak, bestStreak, pomodoros };
  }, [profileData, userProfile, user, sessionData]);

  const weeklyActivity = useMemo(() => {
    const weekStart = getWeekStart(new Date());
    const rows = WEEK_DAYS.map((day, index) => ({
      day,
      dayStart: new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + index),
      minutes: 0,
      taskCount: 0,
    }));

    sessionData.forEach((session) => {
      const sessionDate = getSessionDate(session);
      if (!sessionDate) return;

      const sessionDayStart = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
      const dayOffset = Math.floor((sessionDayStart.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));

      if (dayOffset < 0 || dayOffset >= 7) return;

      rows[dayOffset].minutes += Math.max(0, toNumber(session.duration, 0));
    });

    taskActivityEvents.forEach((event) => {
      const when = new Date(event?.createdAt || "");
      if (Number.isNaN(when.getTime())) return;

      const type = String(event?.type || "");
      const minutesFromEvent = Math.max(0, Math.floor(toNumber(event?.minutes, 0)));

      const eventDayStart = new Date(when.getFullYear(), when.getMonth(), when.getDate());
      const dayOffset = Math.floor((eventDayStart.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000));
      if (dayOffset < 0 || dayOffset >= 7) return;

      if (type === "task-completed" || type === "task-added") {
        // Use small weighted minutes so task actions are reflected in the weekly activity chart.
        const weightedMinutes = type === "task-completed" ? 15 : 8;
        rows[dayOffset].minutes += weightedMinutes;
        rows[dayOffset].taskCount += 1;
        return;
      }

      if (type === "pomodoro-completed" && minutesFromEvent > 0) {
        rows[dayOffset].minutes += minutesFromEvent;
      }
    });

    const maxMinutes = Math.max(...rows.map((row) => row.minutes), 1);

    return rows.map((row) => ({
      day: row.day,
      hours: formatStudyTime(row.minutes),
      taskCount: row.taskCount,
      summaryLabel:
        row.taskCount > 0
          ? `${formatStudyTime(row.minutes)} + ${row.taskCount} task${row.taskCount === 1 ? "" : "s"}`
          : formatStudyTime(row.minutes),
      width: row.minutes > 0 ? `${Math.max((row.minutes / maxMinutes) * 100, 4)}%` : "0%",
      hasValue: row.minutes > 0,
    }));
  }, [sessionData, taskActivityEvents]);

  const recentActivity = useMemo(() => {
    const sessionActivities = sessionData
      .map((session, index) => {
        const when = getSessionDate(session);
        if (!when) return null;

        const durationMinutes = Math.max(0, Math.floor(toNumber(session.duration, 0)));
        const subject = String(session.subject || "").trim();

        return {
          id: `session-${String(session._id || session.id || `${when.toISOString()}-${index}`)}`,
          type: 'session',
          when,
          durationMinutes,
          title:
            durationMinutes > 0
              ? `Completed ${formatDuration(durationMinutes)} focus session${subject ? ` on ${subject}` : ""}`
              : `Started a focus session${subject ? ` on ${subject}` : ""}`,
        };
      })
      .filter(Boolean);

    const blogActivities = myBlogs
      .map((blog, index) => {
        const rawDate = blog?.createdAt || blog?.updatedAt;
        if (!rawDate) return null;

        const when = new Date(rawDate);
        if (Number.isNaN(when.getTime())) return null;

        const title = String(blog?.title || '').trim() || 'Untitled blog';

        return {
          id: `blog-${String(blog.id || blog._id || `${when.toISOString()}-${index}`)}`,
          type: 'blog',
          when,
          durationMinutes: 0,
          title: `Published blog: ${title}`,
        };
      })
      .filter(Boolean);

    const taskActivities = taskActivityEvents
      .map((event, index) => {
        const when = new Date(event?.createdAt || "");
        if (Number.isNaN(when.getTime())) return null;

        const type = String(event?.type || "task");
        const title = String(event?.title || "Task activity").trim() || "Task activity";
        const minutes = Math.max(0, Math.floor(toNumber(event?.minutes, 0)));

        return {
          id: `task-${String(event?.id || `${when.toISOString()}-${index}`)}`,
          type,
          when,
          durationMinutes: minutes,
          title,
        };
      })
      .filter(Boolean);

    return [...sessionActivities, ...blogActivities, ...taskActivities]
      .sort((a, b) => b.when.getTime() - a.when.getTime())
      .slice(0, 5)
      .map((activity) => ({
        ...activity,
        timeLabel: formatRelativeTime(activity.when),
      }));
  }, [myBlogs, sessionData, taskActivityEvents]);

  const badges = useMemo(() => {
    const metricMap = {
      sessions: display.sessions,
      totalMinutes: display.totalMinutes,
      streak: display.streak,
    };

    return BADGE_DEFS.map((badge) => {
      const current = metricMap[badge.metric] ?? 0;
      return {
        ...badge,
        isUnlocked: current >= badge.target,
        progress: formatBadgeProgress(badge, current),
      };
    });
  }, [display]);

  const questState = profileData?.questState || userProfile?.questState || user?.questState || null;
  const activeQuest = questState?.active || null;
  const unlockedRewards = Array.isArray(questState?.rewards) ? questState.rewards : [];
  const questHistory = Array.isArray(questState?.history) ? questState.history : [];

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-slate-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 min-h-screen transition-colors duration-300 pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-6">
        <div className="max-w-6xl mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden transition-all duration-300 relative">
          
          {/* Top Banner Hero & Avatar */}
          <div className="relative">
            <div className="relative h-36 sm:h-48 md:h-64 overflow-hidden">
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400'}`}>
                <div className={`absolute inset-0 ${darkMode ? 'bg-black/20' : 'bg-white/10'}`} />
              </div>

              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 rounded-full mix-blend-screen opacity-20 animate-pulse bg-white" />
                <div className="absolute bottom-10 right-20 w-40 h-40 rounded-full mix-blend-screen opacity-20 animate-pulse bg-white" style={{ animationDelay: "0.5s" }} />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full mix-blend-screen opacity-20 animate-pulse bg-white" style={{ animationDelay: "1s" }} />
              </div>

              <svg className={`absolute inset-0 w-full h-full ${darkMode ? 'opacity-10' : 'opacity-20'}`} viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute top-4 left-6 sm:top-8 sm:left-12 animate-bounce" style={{ animationDuration: "3s" }}>
                    <svg className="w-8 h-8 sm:w-12 sm:h-12 opacity-60 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="absolute top-4 right-6 sm:top-12 sm:right-16 animate-bounce" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>
                    <svg className="w-7 h-7 sm:w-10 sm:h-10 opacity-60 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.488 5.951 1.488a1 1 0 001.169-1.409l-7-14z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-5 ${darkMode ? 'to-black/20' : 'to-white/20'}`} />
            </div>

            {/* Profile Avatar & Bio */}
            <div className="relative px-4 sm:px-6 pb-6 sm:pb-8 -mt-14 sm:-mt-20 text-center">
              <img 
                src={display.photo} 
                alt="Profile" 
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full shadow-2xl mx-auto object-cover ring-4 ring-white dark:ring-slate-900 bg-white dark:bg-slate-800" 
              />
              <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-3 sm:mt-4 tracking-tight">
                {display.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-base md:text-lg mt-1 sm:mt-2 max-w-lg mx-auto">
                {display.bio}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-4 sm:mt-6">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20" style={{ animation: "pulse-slow 2s infinite" }}>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.001 2c.6 2.4-.3 3.9-1.2 4.9-.9 1-1.7 2.1-.6 3.9.9-1.1 2.4-1.6 3.6-1.2 2 .7 3.1 3 2.3 5.1-.9 2.3-3.5 3.5-6 2.7-2.2-.7-3.7-2.7-3.7-5 0-3.6 2.7-5.7 3.6-6.8C10.6 4.1 11.2 3.2 12 2z" />
                  </svg>
                  <span>{display.streak} Day Streak</span>
                </div>
                <Link
                  to="/edit-profile"
                  className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* 📊 Stat Counters */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-800/60">
            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm text-center border border-slate-200/50 dark:border-slate-700/50">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-indigo-600 dark:text-indigo-400 mb-1.5 sm:mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{display.totalHours}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs font-medium mt-0.5">Total Hours</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm text-center border border-slate-200/50 dark:border-slate-700/50">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-green-600 dark:text-green-400 mb-1.5 sm:mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{display.sessions}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs font-medium mt-0.5">Study Sessions</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm text-center border border-slate-200/50 dark:border-slate-700/50">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-yellow-600 dark:text-yellow-400 mb-1.5 sm:mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17a4 4 0 0 0 4-4V5H8v8a4 4 0 0 0 4 4z"/><path d="M7 5H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5"/><path d="M17 5h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5"/></svg>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{display.points}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs font-medium mt-0.5">Points</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-sm text-center border border-slate-200/50 dark:border-slate-700/50">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-red-600 dark:text-red-400 mb-1.5 sm:mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><path d="M10 2h4"/><path d="M4.93 4.93l2.83 2.83"/><circle cx="12" cy="13" r="8"/></svg>
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black text-gray-900 dark:text-white leading-tight">{display.pomodoros}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-[11px] sm:text-xs font-medium mt-0.5">Pomodoros</p>
            </div>
          </div>

          {/* 🏆 Achievements / Badges */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 21h8"/><path d="M12 17a4 4 0 0 0 4-4V5H8v8a4 4 0 0 0 4 4z"/><path d="M7 5H5a2 2 0 0 0-2 2v1a5 5 0 0 0 5 5"/><path d="M17 5h2a2 2 0 0 1 2 2v1a5 5 0 0 1-5 5"/></svg>
              <span>Achievements</span>
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center transition-all ${
                    badge.isUnlocked
                      ? "bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/50 dark:to-indigo-800/50 border border-indigo-400 dark:border-indigo-400 shadow-sm"
                      : "bg-gray-100/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 opacity-60"
                  }`}
                >
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{badge.icon}</div>
                  <p className={`text-[10px] sm:text-xs font-bold leading-tight truncate ${
                    badge.isUnlocked ? "text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"
                  }`}>
                    {badge.label}
                  </p>
                  <p className={`text-[8px] sm:text-[10px] mt-0.5 truncate ${
                    badge.isUnlocked ? "text-indigo-700 dark:text-indigo-200 font-medium" : "text-gray-500"
                  }`}>
                    {badge.progress}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 🎯 Quest Vault */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-slate-50/40 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-800/60">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 dark:text-cyan-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.5 7 7 .5-5.5 4.8L19 21l-7-4-7 4 1-6.7L.5 9.5l7-.5L12 2z"/></svg>
              <span>Quest Vault</span>
            </h2>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-cyan-200 bg-white/90 dark:bg-slate-800/80 p-4 sm:p-5 shadow-sm dark:border-cyan-500/30">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">Active Quest</p>
                    <h3 className="mt-1 text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                      {activeQuest?.title || 'Your next quest is ready'}
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {activeQuest?.label || 'Keep studying to generate your next live quest and digital reward.'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-cyan-600 px-3 py-1.5 text-right text-white shrink-0">
                    <p className="text-[9px] uppercase tracking-wider text-cyan-100 font-semibold">Reward</p>
                    <p className="text-sm sm:text-base font-extrabold">+{activeQuest?.reward?.pointsBonus || 0} XP</p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 sm:h-3 rounded-full bg-cyan-100 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${activeQuest?.progress || 0}%` }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-[11px]">
                    {activeQuest?.current || 0} / {activeQuest?.target || 0}
                  </span>
                  <span className="rounded-full bg-cyan-50 px-3 py-1 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-200 text-[11px]">
                    {activeQuest?.done ? 'Complete' : 'In progress'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-cyan-200 bg-white/90 dark:bg-slate-800/80 p-4 sm:p-5 shadow-sm dark:border-cyan-500/30">
                <p className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400">Digital Rewards</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {unlockedRewards.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300 sm:col-span-2 text-center">
                      Complete a quest to unlock badges, frames, and boost tokens.
                    </div>
                  )}

                  {unlockedRewards.slice(0, 4).map((reward) => (
                    <div key={reward.id} className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 dark:border-gray-700 dark:bg-gray-900/40">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl sm:text-2xl shrink-0">{reward.icon}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{reward.label}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{reward.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {questHistory.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Recent unlocks</p>
                    <div className="mt-1.5 space-y-1.5">
                      {questHistory.slice(0, 2).map((entry) => (
                        <div key={entry.id} className="rounded-lg bg-cyan-50 px-2.5 py-1.5 text-xs text-cyan-900 dark:bg-cyan-900/20 dark:text-cyan-100 flex items-center gap-1.5">
                          <span>{entry.rewardIcon}</span>
                          <span className="truncate">{entry.title} unlocked {entry.rewardLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 📈 Weekly Activity */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-slate-50/40 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-slate-800/60">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-7"/></svg>
              <span>This Week's Activity</span>
            </h2>

            {weeklyActivity.map((row) => (
              <div key={row.day} className="space-y-1.5 mb-3 last:mb-0">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">{row.day}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{row.summaryLabel}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-indigo-500 dark:bg-indigo-400 bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-400 dark:to-purple-400"
                    style={{ width: row.width, minWidth: row.hasValue ? "4%" : "0%" }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* ⏱️ Recent Activity */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16 20V4"/><path d="M8 20h9"/><path d="M12 20V10"/></svg>
              <span>Recent Activity</span>
            </h2>

            <div className="space-y-2.5 sm:space-y-4">
              {recentActivity.length === 0 && (
                <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-200 dark:border-gray-600 text-center">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">No recent activity yet</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Complete a study session to see it here.</span>
                </div>
              )}

              {recentActivity.map((activity, index) => {
                const style = RECENT_ACTIVITY_STYLES[index % RECENT_ACTIVITY_STYLES.length];

                return (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl hover:shadow-md transition-shadow border ${style.card}`}
                  >
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${style.icon}`}>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {activity.type === 'blog' ? (
                          <>
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </>
                        ) : activity.type === 'task-completed' ? (
                          <>
                            <path d="M20 6L9 17l-5-5" />
                            <path d="M19 3l2 2" />
                          </>
                        ) : activity.type === 'task-added' ? (
                          <>
                            <path d="M12 5v14" />
                            <path d="M5 12h14" />
                            <circle cx="12" cy="12" r="9" />
                          </>
                        ) : activity.durationMinutes > 0 ? (
                          <path d="M20 6L9 17l-5-5" />
                        ) : (
                          <>
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4l3 3" />
                          </>
                        )}
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">{activity.title}</p>
                      <span className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">{activity.timeLabel}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ⚙️ Study Preferences */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-slate-50/40 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-800/60">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-gray-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .69.28 1.32.73 1.77.45.45 1.08.73 1.77.73"/></svg>
              <span>Study Preferences</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/80 p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Pomodoro Timer</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">25 min / 5 min</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/80 p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-100 dark:bg-pink-900/50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600 dark:text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Favorite Playlist</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">Lo-fi Beats</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/80 p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 11a7 7 0 0 1-7 7"/><path d="M5 19a7 7 0 0 1 7-7"/><path d="M5 5v14"/><path d="M19 5v14"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Theme</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">Forest Zen</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/80 p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white">Most Productive</p>
                  <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">9 PM - 12 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 My Blogs */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4 sm:mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <span>My Blogs</span>
            </h2>

            {myBlogsError && (
              <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-300">
                {myBlogsError}
              </p>
            )}

            {myBlogsLoading && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-6 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                Loading your blogs...
              </div>
            )}

            {!myBlogsLoading && myBlogs.length === 0 && (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-4 py-6 text-center">
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-sm">No blogs published yet</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Head to Blogs and publish your first community post.</p>
              </div>
            )}

            {!myBlogsLoading && myBlogs.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {myBlogs.map((blog) => (
                  <article key={blog.id || blog._id} className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 bg-white/90 dark:bg-slate-800/80 shadow-sm flex flex-col justify-between">
                    <Link to={`/blog/community/${blog.id || blog._id}`}>
                      <img src={blog.coverImage} alt={blog.title} className="h-36 sm:h-44 w-full object-cover" />
                      <div className="p-3.5 sm:p-4">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white line-clamp-1">{blog.title}</h3>
                        <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">{blog.excerpt}</p>
                        <p className="mt-2 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">{new Date(blog.createdAt).toLocaleDateString()} • {blog.readTime || '1 min read'}</p>
                      </div>
                    </Link>

                    <div className="border-t border-slate-200/50 dark:border-gray-700 px-3.5 py-2.5">
                      <button
                        type="button"
                        onClick={() => handleDeleteBlog(blog.id || blog._id)}
                        disabled={deletePendingBlogId === String(blog.id || blog._id)}
                        className="w-full rounded-xl bg-red-600 px-3 py-1.5 sm:py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                      >
                        {deletePendingBlogId === String(blog.id || blog._id) ? 'Deleting...' : 'Delete Blog'}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          {/* ✏️ Bottom Edit Profile CTA */}
          <div className="px-4 sm:px-6 md:px-8 py-5 sm:py-8 flex flex-col sm:flex-row gap-3 border-t border-slate-200/50 dark:border-slate-800/60">
            <Link
              to="/edit-profile"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white py-3 sm:py-4 px-5 rounded-xl font-bold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-102 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>
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
