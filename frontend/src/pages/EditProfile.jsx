import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router-dom";
import { 
  User, 
  Mail, 
  FileText, 
  Sliders, 
  Shield, 
  Clock, 
  Flame, 
  Trash2, 
  Save, 
  Camera, 
  CheckCircle2, 
  AlertCircle,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getUserProfile, updateUserProfile } from "../utils/firestoreUtils";
import api from "../api";

const DEFAULT_PROFILE = "/images/Profile_Icon.png";
const PROFILE_IMAGE_MAX_SIZE = 360;
const PROFILE_IMAGE_QUALITY = 0.85;

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatStudyTime = (minutes) => {
  const safeMinutes = Math.max(0, Math.floor(toNumber(minutes)));
  const hours = Math.floor(safeMinutes / 60);
  const remMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `0h ${remMinutes}min`;
  }

  return remMinutes > 0 ? `${hours}h ${remMinutes}min` : `${hours}h`;
};

const optimizeProfileImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = PROFILE_IMAGE_MAX_SIZE;
        canvas.height = PROFILE_IMAGE_MAX_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas is not supported"));
          return;
        }

        const sourceSize = Math.min(img.width, img.height);
        const sx = Math.max(0, Math.floor((img.width - sourceSize) / 2));
        const sy = Math.max(0, Math.floor((img.height - sourceSize) / 2));

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          img,
          sx,
          sy,
          sourceSize,
          sourceSize,
          0,
          0,
          PROFILE_IMAGE_MAX_SIZE,
          PROFILE_IMAGE_MAX_SIZE
        );

        const dataUrl = canvas.toDataURL("image/jpeg", PROFILE_IMAGE_QUALITY);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Could not read selected image"));
      img.src = String(reader.result || "");
    };
    reader.onerror = () => reject(new Error("Could not load selected file"));
    reader.readAsDataURL(file);
  });

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, userProfile, deleteAccount, reloadUser } = useAuth();
  const { darkMode } = useTheme();

  const [profilePic, setProfilePic] = useState(DEFAULT_PROFILE);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [pomodoroWork, setPomodoroWork] = useState(25);
  const [pomodoroBreak, setPomodoroBreak] = useState(5);
  const [theme, setTheme] = useState("forest");
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [totalFocusTime, setTotalFocusTime] = useState("0h");
  const [currentStreak, setCurrentStreak] = useState("0 days");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const [latestProfile, sessions] = await Promise.all([
        getUserProfile(user.uid),
        api
          .get("/sessions?limit=100")
          .then((res) => (Array.isArray(res.data) ? res.data : []))
          .catch(() => []),
      ]);

      const p = latestProfile || userProfile;
      if (!p) return;

      const completedSessions = sessions.filter((session) => Math.max(0, toNumber(session?.duration, 0)) > 0);
      const totalMinutesFromSessions = completedSessions.reduce(
        (sum, session) => sum + Math.max(0, toNumber(session?.duration, 0)),
        0
      );
      const totalMinutesFromProfile = Math.max(
        0,
        toNumber(p.totalStudyMinutes, toNumber(p.totalStudyTime, 0))
      );
      const totalMinutes = Math.max(totalMinutesFromProfile, totalMinutesFromSessions);
      const streakValue = Math.max(0, Math.floor(toNumber(p.focusStreak, toNumber(p.streak, 0))));

      setUsername(p.displayName || "");
      setEmail(p.email || "");
      setBio(p.bio || "");
      setPomodoroWork(Number(p.pomodoroWork ?? 25));
      setPomodoroBreak(Number(p.pomodoroBreak ?? 5));
      setTheme(p.theme || "forest");
      setShowOnLeaderboard(Boolean(p.showOnLeaderboard ?? true));
      setAllowMessages(Boolean(p.allowMessages ?? true));
      setNotifications(Boolean(p.notifications ?? true));
      setTotalFocusTime(formatStudyTime(totalMinutes));
      setCurrentStreak(`${streakValue} day${streakValue === 1 ? "" : "s"}`);
      setProfilePic(p.photoURL || user?.photoURL || DEFAULT_PROFILE);
    };
    load();
  }, [user, userProfile]);

  const onPickProfile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file.");
      return;
    }
    try {
      const optimized = await optimizeProfileImage(file);
      setProfilePic(optimized);
      showToast("Photo updated! Click Save Changes to apply.");
    } catch (error) {
      console.error(error);
      showToast("Could not process image. Please try another.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("Please sign in to save your profile.");
      return;
    }
    if (saving) return;
    setSaving(true);
    const updates = {
      displayName: username,
      bio,
      pomodoroWork,
      pomodoroBreak,
      theme,
      showOnLeaderboard,
      allowMessages,
      notifications,
      photoURL: profilePic,
    };
    try {
      await updateUserProfile(user.uid, updates);
      await reloadUser();
      navigate("/profile");
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || deleting) return;
    setDeleting(true);
    try {
      await deleteAccount();
      setShowDeleteModal(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      const msg = err?.code === "auth/requires-recent-login"
        ? "Please sign in again and retry account deletion."
        : (err?.message || "Failed to delete account.");
      showToast(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 pb-12 sm:pb-16 transition-colors duration-300`}>
      
      {/* 🚀 Header Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 text-white py-10 sm:py-16 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-screen filter blur-[90px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-[90px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-3 sm:mb-4">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
              Profile & Account Settings
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3">
            Edit Your Profile
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-blue-100/90 max-w-xl mx-auto leading-relaxed">
            Customize your FocusoraHQ workspace, study preferences, and avatar.
          </p>
        </div>
      </section>

      {/* 📄 Main Form Container */}
      <div className="max-w-4xl mx-auto px-3 sm:px-6 md:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className={`rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-xl p-4 sm:p-8 md:p-10 ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-200"
        }`}>
          
          <div className="flex items-center justify-between mb-6 sm:mb-8 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </Link>

            <span className="text-xs font-semibold text-blue-500 dark:text-blue-400">
              FocusoraHQ Member
            </span>
          </div>

          <form onSubmit={onSubmit} className="space-y-8 sm:space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
              
              {/* Left Column: Personal Information */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                  <User className="w-4 h-4 text-blue-500" />
                  <h2 className="text-base sm:text-lg font-bold">Personal Information</h2>
                </div>

                {/* Avatar Uploader */}
                <div className="flex flex-col items-center space-y-3 pt-2">
                  <div className="relative group">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-blue-500/80 shadow-lg bg-slate-100 dark:bg-slate-800"
                    />
                    <label
                      htmlFor="profilePic"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition shadow-md shadow-blue-500/30 active:scale-95"
                      title="Upload new photo"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                  </div>
                  <input
                    id="profilePic"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onPickProfile}
                  />
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                    Tap the camera icon to upload a new avatar
                  </p>
                </div>

                {/* Username Input */}
                <div>
                  <label htmlFor="username" className="block text-xs sm:text-sm font-semibold mb-1.5">
                    Display Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none transition-all ${
                        darkMode 
                          ? "bg-slate-950/60 border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                          : "bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>
                </div>

                {/* Email (Readonly) */}
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium cursor-not-allowed opacity-75 ${
                        darkMode 
                          ? "bg-slate-950/30 border-slate-800 text-slate-400" 
                          : "bg-slate-100 border-slate-200 text-slate-500"
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                    Email is managed by your account provider and cannot be changed here.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-xs sm:text-sm font-semibold mb-1.5">
                    About / Bio
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <textarea
                      id="bio"
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none transition-all resize-none ${
                        darkMode 
                          ? "bg-slate-950/60 border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" 
                          : "bg-slate-50 border-slate-200 focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                      }`}
                      placeholder="Tell the community about your focus goals..."
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Productivity Preferences */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                  <Sliders className="w-4 h-4 text-blue-500" />
                  <h2 className="text-base sm:text-lg font-bold">Productivity Preferences</h2>
                </div>

                {/* Pomodoro Work Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="pomodoroWork" className="text-xs sm:text-sm font-semibold">
                      Focus Work Duration
                    </label>
                    <span className="text-xs sm:text-sm font-bold text-blue-500 dark:text-blue-400">
                      {pomodoroWork} mins
                    </span>
                  </div>
                  <input
                    id="pomodoroWork"
                    type="range"
                    min={15}
                    max={60}
                    value={pomodoroWork}
                    onChange={(e) => setPomodoroWork(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Pomodoro Break Duration Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="pomodoroBreak" className="text-xs sm:text-sm font-semibold">
                      Break Duration
                    </label>
                    <span className="text-xs sm:text-sm font-bold text-blue-500 dark:text-blue-400">
                      {pomodoroBreak} mins
                    </span>
                  </div>
                  <input
                    id="pomodoroBreak"
                    type="range"
                    min={3}
                    max={20}
                    value={pomodoroBreak}
                    onChange={(e) => setPomodoroBreak(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>

                {/* Theme Select */}
                <div>
                  <label htmlFor="theme" className="block text-xs sm:text-sm font-semibold mb-1.5">
                    Default Study Ambient Theme
                  </label>
                  <select
                    id="theme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className={`w-full px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none cursor-pointer ${
                      darkMode 
                        ? "bg-slate-950/60 border-slate-800 focus:border-blue-500" 
                        : "bg-slate-50 border-slate-200 focus:border-blue-600"
                    }`}
                  >
                    <option value="forest">🌲 Forest Serenity</option>
                    <option value="ocean">🌊 Ocean Waves</option>
                    <option value="rain">🌧️ Rain Ambiance</option>
                    <option value="cafe">☕ Coffee Shop</option>
                    <option value="library">📚 Library Quiet</option>
                  </select>
                </div>

                {/* Privacy & Notifications Toggles */}
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2 pb-1">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Privacy & Preferences
                    </span>
                  </div>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    darkMode ? "bg-slate-950/40 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}>
                    <input
                      id="showOnLeaderboard"
                      type="checkbox"
                      checked={showOnLeaderboard}
                      onChange={(e) => setShowOnLeaderboard(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold">Show on Global Leaderboard</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Allow your study XP and league rank to appear publicly.</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    darkMode ? "bg-slate-950/40 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}>
                    <input
                      id="allowMessages"
                      type="checkbox"
                      checked={allowMessages}
                      onChange={(e) => setAllowMessages(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold">Allow In-Room Study Chat</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive live messages from peers inside active study rooms.</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                    darkMode ? "bg-slate-950/40 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}>
                    <input
                      id="notifications"
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-semibold">Productivity Sound Chimes</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Play pleasant chimes when focus or break sessions end.</p>
                    </div>
                  </label>
                </div>

                {/* Stat Badges Mini Preview */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className={`p-3 rounded-xl border text-center ${
                    darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-blue-500 mb-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Total Focus</span>
                    </div>
                    <p className="text-base sm:text-lg font-black">{totalFocusTime}</p>
                  </div>

                  <div className={`p-3 rounded-xl border text-center ${
                    darkMode ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-orange-500 mb-0.5">
                      <Flame className="w-3.5 h-3.5" />
                      <span>Focus Streak</span>
                    </div>
                    <p className="text-base sm:text-lg font-black">{currentStreak}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleting}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-red-500/30 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 🗑️ Custom Glassmorphic Delete Account Modal */}
      {showDeleteModal && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md transition-all duration-300">
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => !deleting && setShowDeleteModal(false)} 
          />

          <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 text-center transform transition-all duration-300 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 dark:text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight">
              Delete Account Permanently?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              This action cannot be undone. All your focus sessions, study stats, and notes will be permanently erased.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 🔔 Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
