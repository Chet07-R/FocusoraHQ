import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    maxParticipants: 10
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          <p className="mt-4 text-blue-900 dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));
  };

  const handlePrivacyChange = (isPublic) => {
    setFormData(prev => ({ ...prev, isPublic }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("You must be signed in to create a room");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter a room name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const roomId = await createRoom({
        name: formData.name,
        description: formData.description,
        isPrivate: !formData.isPublic,
        maxParticipants: formData.maxParticipants
      });
      
      // Navigate to the study room
      navigate('/study-room-1', { state: { roomId } });
    } catch (err) {
      console.error("Error creating room:", err);
      setError(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col transition-colors duration-300">
      {/* Navbar Placeholder */}
      <nav className="navbar"></nav>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-10 relative overflow-hidden pt-20">
        {/* Header */}
        <div className="max-w-xl w-full text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
            Create Your Space
          </h1>
          <p className="text-lg md:text-xl text-blue-800 dark:text-blue-200">
            Customize your private or group study room
          </p>
        </div>

        {/* Create Space Form */}
        <section className="max-w-2xl w-full bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Space Name */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">
                Space Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Math Study Group"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description..."
                rows="2"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Privacy Options */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-4 text-lg">
                Privacy
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Public */}
                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    checked={formData.isPublic}
                    onChange={() => handlePrivacyChange(true)}
                    className="hidden peer"
                  />
                  <div className="flex flex-col items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 transition-all">
                    <span className="text-3xl">🌐</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-200">
                      Public
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Anyone can join your space
                    </span>
                  </div>
                </label>

                {/* Private */}
                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    checked={!formData.isPublic}
                    onChange={() => handlePrivacyChange(false)}
                    className="hidden peer"
                  />
                  <div className="flex flex-col items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 transition-all">
                    <span className="text-3xl">🔒</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-200">
                      Private
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Only invited users can join
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                min="1"
                max="50"
                placeholder="e.g. 10"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-transform transform hover:scale-105 items-center flex justify-center"
            >
              {loading ? "Creating..." : "➕ Create Space"}
            </button>
          </form>
        </section>
      </main>

      {/* Footer Placeholder */}
      <footer className="footer"></footer>
    </div>
  );
};

export default CreateSpace;
