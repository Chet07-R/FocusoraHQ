import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../utils/firestoreUtils";
import { auth } from "../firebaseConfig";
import { updateProfile as updateAuthProfile } from "firebase/auth";

const DEFAULT_PROFILE = "/images/Profile_Icon.png";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, userProfile, deleteAccount } = useAuth();

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

  useEffect(() => {
    const load = async () => {
      if (!user) return; // wait for auth
      // Prefer context profile; fallback to Firestore fetch
      const p = userProfile || (await getUserProfile(user.uid));
      if (!p) return;
      setUsername(p.displayName || "");
      setEmail(p.email || "");
      setBio(p.bio || "");
      setPomodoroWork(Number(p.pomodoroWork ?? 25));
      setPomodoroBreak(Number(p.pomodoroBreak ?? 5));
      setTheme(p.theme || "forest");
      setShowOnLeaderboard(Boolean(p.showOnLeaderboard ?? true));
      setAllowMessages(Boolean(p.allowMessages ?? true));
      setNotifications(Boolean(p.notifications ?? true));
      setTotalFocusTime(
        typeof p.totalStudyTime === "number" ? `${p.totalStudyTime}m` : p.totalFocusTime || "0h"
      );
      setCurrentStreak(
        typeof p.streak === "number" ? `${p.streak} days` : p.currentStreak || "0 days"
      );
      setProfilePic(p.photoURL || user?.photoURL || DEFAULT_PROFILE);
    };
    load();
  }, [user, userProfile]);

  const onPickProfile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfilePic(String(ev.target?.result || DEFAULT_PROFILE));
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to save your profile.");
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
      let authSyncOk = true;
      if (auth.currentUser) {
        try {
          await updateAuthProfile(auth.currentUser, {
            displayName: username,
            photoURL: profilePic,
          });
        } catch (syncErr) {
          authSyncOk = false;
          console.warn("Saved to Firestore, but Auth sync failed:", syncErr);
        }
      }
      if (!authSyncOk) {
        console.warn("Auth profile not fully synced yet; UI will update from Firestore.");
      }
      try {
        const fresh = await getUserProfile(user.uid);
        console.debug("Profile saved, fresh Firestore profile:", fresh);
      } catch {}
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    if (confirm("Discard changes?")) navigate(-1);
  };

  const onDeleteAccount = async () => {
    if (!user) {
      alert('Please sign in first.');
      return;
    }
    const confirmDelete = confirm('Delete your account permanently? This will remove your profile and stats from the leaderboard.');
    if (!confirmDelete) return;
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteAccount();
      alert('Your account has been deleted.');
      navigate('/');
    } catch (err) {
      console.error(err);
      const msg = err?.code === 'auth/requires-recent-login'
        ? 'Please sign in again and retry account deletion.'
        : (err?.message || 'Failed to delete account.');
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen pt-16">
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-blue-900 mb-2 dark:text-gray-100">Edit Your Profile</h1>
            <p className="text-blue-700 dark:text-indigo-200 text-lg">Customize your FocusoraHQ experience</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300">
            <form onSubmit={onSubmit} className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 pb-4 border-b-2 border-indigo-100 dark:border-indigo-700">Personal Information</h2>

                  {/* Profile Picture */}
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <img src={profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 dark:border-indigo-400 shadow-lg" />
                      <label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white p-2 rounded-full cursor-pointer transition duration-200 shadow-md">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                      </label>
                    </div>
                    <input id="profilePic" type="file" accept="image/*" className="hidden" onChange={onPickProfile} />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click the icon to upload a new photo</p>
                  </div>

                  {/* Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Username</label>
                    <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900" placeholder="Enter your username" />
                  </div>

                  {/* Email (locked) */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      readOnly
                      aria-readonly
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg cursor-not-allowed"
                      placeholder="your.email@example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email is managed by your account and cannot be changed here.</p>
                  </div>

                  {/* Bio */}
                  <div>
                    <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Bio</label>
                    <textarea id="bio" rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 resize-none" placeholder="Tell us about your productivity goals and journey..." />
                  </div>
                </div>

                {/* Right: Settings & Preferences */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 pb-4 border-b-2 border-indigo-100 dark:border-indigo-700">Productivity Preferences</h2>

                  {/* Work Duration */}
                  <div className="mb-6">
                    <label htmlFor="pomodoroWork" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Default Work Duration (minutes)</label>
                    <div className="flex items-center space-x-4">
                      <input id="pomodoroWork" type="range" min={15} max={60} value={pomodoroWork} onChange={(e) => setPomodoroWork(Number(e.target.value))} className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400" />
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 w-12 text-center">{pomodoroWork}</span>
                    </div>
                  </div>

                  {/* Break Duration */}
                  <div className="mb-6">
                    <label htmlFor="pomodoroBreak" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Default Break Duration (minutes)</label>
                    <div className="flex items-center space-x-4">
                      <input id="pomodoroBreak" type="range" min={5} max={15} value={pomodoroBreak} onChange={(e) => setPomodoroBreak(Number(e.target.value))} className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400" />
                      <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400 w-12 text-center">{pomodoroBreak}</span>
                    </div>
                  </div>

                  {/* Theme */}
                  <div className="mb-6">
                    <label htmlFor="theme" className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Preferred Study Theme</label>
                    <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900">
                      <option value="forest">🌲 Forest Serenity</option>
                      <option value="ocean">🌊 Ocean Waves</option>
                      <option value="rain">🌧️ Rain Ambiance</option>
                      <option value="cafe">☕ Coffee Shop</option>
                      <option value="library">📚 Library Quiet</option>
                    </select>
                  </div>

                  {/* Privacy Settings */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b-2 border-indigo-100 dark:border-indigo-700">Privacy Settings</h3>

                    <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200">
                      <input id="showOnLeaderboard" type="checkbox" checked={showOnLeaderboard} onChange={(e) => setShowOnLeaderboard(e.target.checked)} className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer" />
                      <label htmlFor="showOnLeaderboard" className="flex-1 cursor-pointer">
                        <p className="font-semibold text-gray-800 dark:text-white">Show on The Arena leaderboard</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Let others see your focus statistics</p>
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200">
                      <input id="allowMessages" type="checkbox" checked={allowMessages} onChange={(e) => setAllowMessages(e.target.checked)} className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer" />
                      <label htmlFor="allowMessages" className="flex-1 cursor-pointer">
                        <p className="font-semibold text-gray-800 dark:text-white">Allow messages in The Commons</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive messages from other users</p>
                      </label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200">
                      <input id="notifications" type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer" />
                      <label htmlFor="notifications" className="flex-1 cursor-pointer">
                        <p className="font-semibold text-gray-800 dark:text-white">Enable productivity notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get reminders for breaks and milestones</p>
                      </label>
                    </div>
                  </div>

                  {/* Account Statistics */}
                  <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b-2 border-indigo-100 dark:border-indigo-700">Your Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/10 p-4 rounded-lg border-2 border-indigo-200 dark:border-indigo-700/60">
                        <p className="text-xs font-semibold text-indigo-600 mb-1">Total Focus Time</p>
                        <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">{totalFocusTime}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/10 p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700/60">
                        <p className="text-xs font-semibold text-purple-600 mb-1">Current Streak</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{currentStreak}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`px-8 py-3 text-white font-semibold rounded-lg transition duration-200 transform shadow-lg ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 hover:scale-105'}`}
                  >
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onDeleteAccount}
                      disabled={deleting}
                      className={`px-5 py-3 rounded-lg border-2 ${deleting ? 'border-red-300 text-red-300 cursor-not-allowed' : 'border-red-600 text-red-600 hover:bg-red-600 hover:text-white'} transition`}
                    >
                      {deleting ? 'Deleting…' : 'Delete Account'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
