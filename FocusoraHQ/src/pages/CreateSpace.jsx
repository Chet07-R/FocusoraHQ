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
    isPublic: true, // `true` for Public, `false` for Private
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
      navigate(`/study-room/${room.id}`);
    } catch (err) {
      setError(err.message || "Failed to create room.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">Create Your Space</h1>
          <p className="text-gray-400 mt-2">
            Customize your private or group study room
          </p>
        </div>

        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/90 text-white p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="w-full p-3 bg-[#0F172A] rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="w-full p-3 bg-[#0F172A] rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Privacy
              </label>
              <div className="grid grid-cols-2 gap-4">
                {/* Public */}
                <button
                  type="button"
                  onClick={() => handlePrivacyChange(true)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.isPublic
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <Globe className="w-6 h-6 mb-2" />
                  <span className="font-semibold">Public</span>
                  <span className="text-xs text-gray-400 mt-1 text-center">
                    Anyone can join your space
                  </span>
                </button>
                {/* Private */}
                <button
                  type="button"
                  onClick={() => handlePrivacyChange(false)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    !formData.isPublic
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-500"
                  }`}
                >
                  <Lock className="w-6 h-6 mb-2" />
                  <span className="font-semibold">Private</span>
                  <span className="text-xs text-gray-400 mt-1 text-center">
                    Only invited users can join
                  </span>
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="maxParticipants"
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="w-full p-3 bg-[#0F172A] rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition duration-300 disabled:bg-blue-400 flex items-center justify-center"
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
    </div>
  );
};

export default CreateSpace;
