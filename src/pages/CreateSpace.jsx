import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Lock, ArrowLeft, Users, Sparkles, Loader2, BookOpen, AlignLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStudyRoom } from "../context/StudyRoomContext";

const CreateSpace = () => {
  const { loading: authLoading } = useAuth();
  const { createRoom } = useStudyRoom();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true,
    maxParticipants: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (isPublic) => {
    setFormData((prev) => ({ ...prev, isPublic }));
  };

  const setPresetParticipants = (count) => {
    setFormData((prev) => ({ ...prev, maxParticipants: count }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Space Name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const roomId = await createRoom(formData);
      navigate(`/study-room-1`, { state: { roomId: roomId || null } });
    } catch (err) {
      setError(err.message || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 min-h-screen transition-colors duration-300 flex flex-col items-center justify-start sm:justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[32rem] h-80 sm:h-[32rem] bg-gradient-to-tr from-indigo-400/20 via-purple-400/15 to-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/study-room"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Study Rooms</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center mb-5 sm:mb-7">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-[11px] sm:text-xs font-medium text-indigo-900 dark:text-indigo-200 mb-2.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            <span>New Study Space</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Your Space
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
            Customize your focus environment and invite peers
          </p>
        </div>

        {/* Form Card */}
        <div className="relative rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-900/85 border border-white/80 dark:border-white/10 shadow-xl sm:shadow-2xl p-5 sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 p-3 rounded-xl text-xs sm:text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Space Name */}
            <div>
              <label
                htmlFor="name"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Space Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Math Study Group, Late Night Sprint"
                className="w-full px-3.5 py-2.5 sm:py-3 bg-slate-50/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-xs sm:text-sm transition-all shadow-inner"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5"
              >
                <AlignLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Description (Optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="What are you working on in this room?"
                className="w-full px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-xs sm:text-sm transition-all shadow-inner resize-none"
              />
            </div>

            {/* Privacy Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Privacy
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Public */}
                <button
                  type="button"
                  onClick={() => handlePrivacyChange(true)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-200 text-center active:scale-[0.98] ${
                    formData.isPublic
                      ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                      formData.isPublic
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                  </div>
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      formData.isPublic
                        ? "text-indigo-900 dark:text-indigo-200"
                        : "text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Public
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    Anyone can join
                  </span>
                </button>

                {/* Private */}
                <button
                  type="button"
                  onClick={() => handlePrivacyChange(false)}
                  className={`flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-200 text-center active:scale-[0.98] ${
                    !formData.isPublic
                      ? "border-indigo-600 dark:border-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 ${
                      !formData.isPublic
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                  </div>
                  <span
                    className={`font-bold text-xs sm:text-sm ${
                      !formData.isPublic
                        ? "text-indigo-900 dark:text-indigo-200"
                        : "text-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Private
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    Invite code only
                  </span>
                </button>
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="maxParticipants"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Max Participants</span>
                </label>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {formData.maxParticipants} learners
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min="2"
                  max="50"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  className="w-20 px-3 py-2 bg-slate-50/90 dark:bg-slate-800/90 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 text-xs sm:text-sm text-center font-bold shadow-inner"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-1 justify-end">
                  {[4, 8, 12, 25].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setPresetParticipants(preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        Number(formData.maxParticipants) === preset
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl sm:rounded-2xl text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)",
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Space...</span>
                  </>
                ) : (
                  <>
                    <span className="text-base leading-none font-bold">+</span>
                    <span>Create Space</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active,
        .dark textarea:-webkit-autofill,
        .dark textarea:-webkit-autofill:hover,
        .dark textarea:-webkit-autofill:focus,
        .dark textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(30, 41, 59, 0.95) inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff !important;
          transition: background-color 9999s ease-in-out 0s;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(248, 250, 252, 0.95) inset !important;
          -webkit-text-fill-color: #0f172a !important;
          caret-color: #0f172a !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default CreateSpace;

