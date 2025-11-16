import React, { useState, useMemo } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";

const JoinSpace = () => {
  const { activeRooms, joinRoom, loading: roomsLoading } = useStudyRoom();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [joiningRoomId, setJoiningRoomId] = useState(null);

  // Convert Firestore rooms to display format with real-time data
  const allRooms = useMemo(() => {
    return activeRooms.map(room => {
      const participantCount = room.participants?.length || 0;
      const hostInfo = room.hostName ? `Host: ${room.hostName}` : "";
      
      return {
        id: room.id,
        icon: room.isPublic ? "🌐" : "🔒",
        title: room.name,
        description: room.description,
        tags: [
          ...(room.description ? [room.description.substring(0, 20)] : []),
          ...(hostInfo ? [hostInfo] : []),
          `${participantCount}/${room.maxParticipants || 10} users`
        ],
        color: room.isPublic ? "blue" : "purple",
        borderColor: room.isPublic ? "border-blue-600 dark:border-blue-400" : "border-purple-600 dark:border-purple-400",
        isFull: participantCount >= (room.maxParticipants || 10)
      };
    });
  }, [activeRooms]);

  // Filter rooms by title or tags
  const filteredRooms = useMemo(() => {
    if (!searchTerm) return allRooms;
    
    const text = searchTerm.toLowerCase();
    return allRooms.filter((room) => {
      return (
        room.title.toLowerCase().includes(text) ||
        room.description?.toLowerCase().includes(text) ||
        room.tags.some((tag) => tag.toLowerCase().includes(text))
      );
    });
  }, [allRooms, searchTerm]);

  // Rooms currently visible
  const visibleRooms = filteredRooms.slice(0, visibleCount);

  const handleJoinRoom = async (roomId) => {
    if (!user) {
      alert("Please sign in to join a room");
      navigate('/signin');
      return;
    }

    setJoiningRoomId(roomId);
    try {
      await joinRoom(roomId);
      navigate('/study-room-1', { state: { roomId } });
    } catch (error) {
      console.error("Error joining room:", error);
      alert(error.message || "Failed to join room");
    } finally {
      setJoiningRoomId(null);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors duration-300">
      {/* Navbar Placeholder */}
      <nav className="navbar"></nav>

      <main className="max-w-5xl mx-auto px-4 py-16 pt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
            Join a Study Room
          </h1>
          <p className="text-lg text-blue-800 dark:text-blue-200 mb-6">
            Find your perfect focus group and join a thriving community!
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <input
            type="text"
            placeholder="Search rooms by name, topic, or host..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-4 rounded-xl border-0 bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
          />
          <button
            onClick={() => setSearchTerm("")}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-all"
          >
            Clear
          </button>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roomsLoading ? (
            <div className="col-span-2 text-center py-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading rooms...</p>
            </div>
          ) : visibleRooms.length > 0 ? (
            visibleRooms.map((room) => (
              <div
                key={room.id}
                className={`bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-6 flex flex-col gap-3 border-t-4 ${room.borderColor}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{room.icon}</span>
                  <span className="font-bold text-lg text-blue-900 dark:text-blue-200">
                    {room.title}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {room.tags.map((tag, j) => (
                    <span
                      key={j}
                      className={`px-3 py-1 rounded-full ${
                        tag.includes("Host")
                          ? "bg-gray-100 dark:bg-gray-700"
                          : tag.includes("users")
                          ? "bg-green-100 dark:bg-green-900"
                          : "bg-blue-100 dark:bg-blue-900"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={room.isFull || joiningRoomId === room.id}
                  className={`mt-2 px-6 py-2 rounded-lg font-semibold transition-all w-full text-center ${
                    room.isFull
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : joiningRoomId === room.id
                      ? 'bg-blue-400 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {joiningRoomId === room.id ? "Joining..." : room.isFull ? "Full" : "Join"}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-10">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm ? "No rooms found. Try another search!" : "No active rooms yet."}
              </p>
              <Link
                to="/create-space"
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Create the First Room
              </Link>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredRooms.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount(visibleCount + 2)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-md transition-all text-lg flex items-center gap-2"
            >
              <span>Load More</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        )}
      </main>

      {/* Footer Placeholder */}
      <footer className="footer"></footer>
    </div>
  );
};

export default JoinSpace;
