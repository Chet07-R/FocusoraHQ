import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  ArrowLeft,
  Globe2,
  Lock,
  Users,
  Sparkles,
  Loader2,
  ArrowRight,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useStudyRoom } from "../context/StudyRoomContext";
import { useAuth } from "../context/AuthContext";

const JoinSpace = () => {
  const { activeRooms, joinRoom, loading: roomsLoading } = useStudyRoom();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [joiningRoomId, setJoiningRoomId] = useState(null);

  const allRooms = useMemo(() => {
    return activeRooms.map((room) => {
      const participantCount = room.participants?.length || 0;
      const maxParticipants = room.maxParticipants || 10;
      const hostInfo = room.hostName ? `Host: ${room.hostName}` : "";

      return {
        id: room.id,
        isPublic: room.isPublic,
        title: room.name,
        description: room.description,
        hostInfo,
        participantCount,
        maxParticipants,
        isFull: participantCount >= maxParticipants,
      };
    });
  }, [activeRooms]);

  const filteredRooms = useMemo(() => {
    if (!searchTerm.trim()) return allRooms;

    const text = searchTerm.toLowerCase();
    return allRooms.filter((room) => {
      return (
        room.title?.toLowerCase().includes(text) ||
        room.description?.toLowerCase().includes(text) ||
        room.hostInfo?.toLowerCase().includes(text)
      );
    });
  }, [allRooms, searchTerm]);

  const visibleRooms = filteredRooms.slice(0, visibleCount);

  const handleJoinRoom = async (roomId) => {
    if (!user) {
      alert("Please sign in to join a room");
      navigate("/signin");
      return;
    }

    setJoiningRoomId(roomId);
    try {
      await joinRoom(roomId);
      navigate("/study-room-1", { state: { roomId } });
    } catch (error) {
      console.error("Error joining room:", error);
      alert(error.message || "Failed to join room");
    } finally {
      setJoiningRoomId(null);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 min-h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[36rem] h-80 sm:h-[36rem] bg-gradient-to-tr from-cyan-400/20 via-indigo-400/15 to-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10">
        {/* Top Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link
            to="/study-room"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Study Rooms</span>
          </Link>

          <Link
            to="/create-space"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Create Space</span>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-[11px] sm:text-xs font-medium text-cyan-900 dark:text-cyan-200 mb-2.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Live Study Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Join a Study Room
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed px-2">
            Find your focus group and study alongside motivated learners
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6 sm:mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by room name, topic, or host..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl text-slate-900 dark:text-white rounded-xl sm:rounded-2xl border border-white/80 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 text-xs sm:text-sm shadow-md transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {roomsLoading ? (
            <div className="col-span-full text-center py-12">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/70 dark:bg-slate-800/70 shadow-md mb-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-600 dark:text-cyan-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                Fetching live study spaces...
              </p>
            </div>
          ) : visibleRooms.length > 0 ? (
            visibleRooms.map((room) => (
              <div
                key={room.id}
                className="group relative rounded-2xl sm:rounded-3xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-lg hover:shadow-xl dark:hover:border-cyan-500/40 hover:border-cyan-400/50 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2.5 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          room.isPublic
                            ? "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400"
                            : "bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400"
                        }`}
                      >
                        {room.isPublic ? (
                          <Globe2 className="w-4 h-4" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                      </div>
                      <h2 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                        {room.title}
                      </h2>
                    </div>

                    <span
                      className={`text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${
                        room.isPublic
                          ? "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20"
                          : "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20"
                      }`}
                    >
                      {room.isPublic ? "Public" : "Private"}
                    </span>
                  </div>

                  {/* Room Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 line-clamp-2 min-h-[32px] leading-relaxed">
                    {room.description || "A cozy quiet virtual space to study and focus together."}
                  </p>

                  {/* Badges Info */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-4 text-[11px]">
                    {room.hostInfo && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium truncate max-w-[140px]">
                        {room.hostInfo}
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-md font-medium flex items-center gap-1 ${
                        room.isFull
                          ? "bg-red-100/80 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-500/20"
                          : "bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      }`}
                    >
                      <Users className="w-3 h-3" />
                      <span>
                        {room.participantCount}/{room.maxParticipants}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Join CTA */}
                <button
                  onClick={() => handleJoinRoom(room.id)}
                  disabled={room.isFull || joiningRoomId === room.id}
                  className={`w-full py-2 sm:py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-[0.98] ${
                    room.isFull
                      ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                      : joiningRoomId === room.id
                      ? "bg-cyan-600 text-white"
                      : "text-white shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30"
                  }`}
                  style={
                    room.isFull || joiningRoomId === room.id
                      ? undefined
                      : {
                          background:
                            "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)",
                        }
                  }
                >
                  {joiningRoomId === room.id ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : room.isFull ? (
                    <span>Room Full</span>
                  ) : (
                    <>
                      <span>Join Space</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/60 dark:border-white/10 p-6">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3">
                {searchTerm ? "No study rooms found matching your search." : "No active study rooms at the moment."}
              </p>
              <Link
                to="/create-space"
                className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #6366f1 50%, #ec4899 100%)",
                }}
              >
                <Plus className="w-4 h-4" />
                <span>Create the First Room</span>
              </Link>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredRooms.length && (
          <div className="flex justify-center mt-6 sm:mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <span>Load More Rooms</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default JoinSpace;

