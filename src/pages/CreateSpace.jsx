import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Globe, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStudyRoom } from "../context/StudyRoomContext";

const CreateSpace = () => {
  const { user, loading: authLoading } = useAuth();
  const { createRoom } = useStudyRoom();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: true, 
    maxParticipants: 10,
  });<button
  type="button"
  onClick={() => handlePrivacyChange(true)}
  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
    formData.isPublic
      ? "border-blue-500 bg-blue-500/10"
      : "border-white/20 dark:border-white/10 hover:border-blue-400"
  }`}
>
  <Globe className="w-6 h-6 mb-2 text-gray-700 dark:text-white" />
  <span className="font-semibold text-blue-900 dark:text-white">Public</span>
  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">
    Anyone can join your space
  </span>
</button>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Space Name is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const room = await createRoom(formData);
      
      
      navigate(`/study-room-1`, { state: { roomId: room?.id || null } });
    } catch (err) {
      setError(err.message || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-900 dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300 flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-3 sm:mb-4">Create Your Space</h1>
          <p className="text-blue-800 dark:text-blue-200 mt-2 text-sm sm:text-base">
            Customize your private or group study room
          </p>
        </div>

        <div className="relative rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-900/60 border border-white/20 dark:border-white/10 shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/90 text-white p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2"
              >
                Space Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Math Study Group"
                className="w-full p-3 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Write a short description..."
                className="w-full p-3 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                Privacy
              </label>
              <div className="grid grid-cols-2 gap-4">
                {}
                <button
                  type="button"
                  onClick={() => handlePrivacyChange(true)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.isPublic
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/20 dark:border-white/10 hover:border-blue-400"
                  }`}
                >
                  <Globe className="w-6 h-6 mb-2 text-gray-700 dark:text-white" />
                  <span className="font-semibold text-blue-900 dark:text-white">Public</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">
                    Anyone can join your space
                  </span>
                </button>
                  {}
                <button
                  type="button"
                  onClick={() => handlePrivacyChange(false)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    !formData.isPublic
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/20 dark:border-white/10 hover:border-blue-400"
                  }`}
                >
                  <Lock className="w-6 h-6 mb-2 text-gray-700 dark:text-white" />
                  <span className="font-semibold text-blue-900 dark:text-white">Private</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 text-center">
                    Only invited users can join
                  </span>
                </button>

              </div>
            </div>

            <div>
              <label
                htmlFor="maxParticipants"
                className="block text-sm font-medium text-blue-900 dark:text-blue-200 mb-2"
              >
                Max Participants
              </label>
              <input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                min="2"
                max="50"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full p-3 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center hover:brightness-110 transform hover:scale-[1.02]"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)",
                boxShadow: "0 0 20px rgba(6, 182, 212, 0.35), 0 0 40px rgba(139, 92, 246, 0.25), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)"
              }}
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <span className="mr-2">+</span> Create Space
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {}
      <style>{`
        .dark input:-webkit-autofill,
        .dark input:-webkit-autofill:hover,
        .dark input:-webkit-autofill:focus,
        .dark input:-webkit-autofill:active,
        .dark textarea:-webkit-autofill,
        .dark textarea:-webkit-autofill:hover,
        .dark textarea:-webkit-autofill:focus,
        .dark textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px rgba(31, 41, 55, 0.8) inset !important;
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
          -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.8) inset !important;
          -webkit-text-fill-color: #1f2937 !important;
          caret-color: #1f2937 !important;
          transition: background-color 9999s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
};

export default CreateSpace;
