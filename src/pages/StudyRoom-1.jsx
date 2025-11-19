import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useStudyRoom } from "../context/StudyRoomContext";
import {
  Sun,
  Moon,
  Trash2,
  MessageSquare,
  Bell,
  Music,
  X,
  CheckCircle,
  PlusCircle,
  UploadCloud,
  Download,
  Play,
  Pause,
  Search,
  Save as SaveIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Notes from "../components/Notes";
import Todo from "../components/Todo";
import FocusPlaylist from "../components/FocusPlaylist";

const StudyRoom1 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentRoom, 
    roomData, 
    participants, 
    chatMessages: firestoreChatMessages,
    roomTodos: firestoreTodos,
    joinRoom, 
    leaveRoom, 
    deleteRoom,
    sendMessage: sendFirestoreMessage,
    updateNotes: updateFirestoreNotes,
    addTodo: addFirestoreTodo,
    toggleTodo: toggleFirestoreTodo,
    deleteTodo: deleteFirestoreTodo,
    updateBackground,
  } = useStudyRoom();
  
  const roomId = location.state?.roomId || currentRoom;
  
  useEffect(() => {
    if (roomId && !currentRoom && user) {
      joinRoom(roomId).catch(err => {
        console.error("Failed to join room:", err);
        navigate('/join-space');
      });
    }
  }, [roomId, currentRoom, user]);
  
  useEffect(() => {
    if (roomData && roomData.active === false) {
      addNotification("🚫 Room closed");
      navigate('/study-room');
    }
  }, [roomData, navigate]);
  
  const handleLeaveRoom = async () => {
    if (window.confirm("Leave this room?")) {
      try {
        await leaveRoom();
        addNotification("👋 Left room");
        navigate('/study-room');
      } catch (error) {
        addNotification("❌ Failed to leave");
      }
    }
  };
  
  const handleDeleteRoom = async () => {
    if (window.confirm("Delete this room?")) {
      try {
        await deleteRoom();
        addNotification("🗑️ Room deleted");
        navigate('/study-room');
      } catch (error) {
        addNotification("❌ Failed to delete");
      }
    }
  };
  
  const isCreator = user && roomData && roomData.creatorId === user.uid;
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  });
  
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [notifications, setNotifications] = useState([]);
  const addNotification = (text) => {
    const id = Date.now();
    setNotifications((n) => [...n, { id, text }]);
    setTimeout(() => {
      setNotifications((n) => n.filter((x) => x.id !== id));
    }, 4200);
  };

  const [chatInput, setChatInput] = useState("");
  const chatEnd = useRef();
  
  const chatMessages = firestoreChatMessages && firestoreChatMessages.length > 0 
    ? firestoreChatMessages 
    : [{ userId: "system", displayName: "System", message: "Welcome!" }];
  
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [firestoreChatMessages]);

  const sendMessage = async () => {
    const text = chatInput.trim();
    if (!text || !currentRoom || !sendFirestoreMessage) return;
    
    try {
      await sendFirestoreMessage(text);
      setChatInput("");
    } catch (error) {
      addNotification("❌ Send failed");
    }
  };

  const [openPanel, setOpenPanel] = useState(null);
  const [unreadChat, setUnreadChat] = useState(0);
  const lastMessageIdRef = useRef(null);

  useEffect(() => {
    if (openPanel === 'chat') setUnreadChat(0);
  }, [openPanel]);

  useEffect(() => {
    if (!firestoreChatMessages || firestoreChatMessages.length === 0) return;
    const last = firestoreChatMessages[firestoreChatMessages.length - 1];
    if (!last || lastMessageIdRef.current === last.id) return;

    lastMessageIdRef.current = last.id;
    const isOwn = last.userId && user && last.userId === user.uid;
    const isSystem = last.userId === 'system';
    if (!isOwn && !isSystem && openPanel !== 'chat') {
      setUnreadChat((c) => c + 1);
      addNotification(`💬 ${last.displayName || 'User'}`);
    }
  }, [firestoreChatMessages, openPanel, user]);
  
  const closePanel = () => setOpenPanel(null);

  const defaultBg = "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg";
  const [bgUrl, setBgUrl] = useState(() => localStorage.getItem("sr_bg") || defaultBg);
  
  useEffect(() => {
    if (roomData?.backgroundUrl) {
      setBgUrl(roomData.backgroundUrl);
      localStorage.setItem("sr_bg", roomData.backgroundUrl);
    }
  }, [roomData?.backgroundUrl]);
  
  const changeBackground = async (url) => {
    if (currentRoom) {
      try {
        await updateBackground(url);
        addNotification("🎨 Background changed");
      } catch (e) {
        addNotification("❌ Failed");
      }
    } else {
      setBgUrl(url);
      localStorage.setItem("sr_bg", url);
      addNotification("🎨 Background changed");
    }
    setBgPanelOpen(false);
  };

  const roomInfo = {
    id: roomData?.id || roomId || "SR-####",
    name: roomData?.name || "Loading...",
    host: roomData?.creatorName || "Host",
    members: participants?.length || 0,
  };

  const cx = (...args) => args.filter(Boolean).join(" ");
  const [bgPanelOpen, setBgPanelOpen] = useState(false);

  useEffect(() => {
    const sel = document.querySelector('footer, .footer, #footer, .site-footer');
    if (!sel) return;
    const prev = sel.style.display;
    sel.style.display = 'none';
    return () => {
      try { sel.style.display = prev || ''; } catch (e) {}
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-100 via-cyan-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; }
        .animate-slideInRight { animation: slideInRight .35s ease; }
        @keyframes slideInRight { from { transform: translateX(12px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      {}
      {openPanel && (
        <div
          onClick={closePanel}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
          aria-label="Close side panel"
        />
      )}
      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed transition-all duration-700 z-0 filter saturate-90"
        style={{ backgroundImage: `url('${bgUrl}')` }}
        aria-hidden
      />

      {}
      <div className="fixed right-2 sm:right-4 top-14 sm:top-16 z-50 space-y-1.5 max-w-[calc(100vw-1rem)] sm:max-w-xs">
        {notifications.map((n) => (
          <div key={n.id} className="bg-blue-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded text-xs sm:text-sm shadow-md animate-slideInRight truncate">
            {n.text}
          </div>
        ))}
      </div>

      {}
      <main className="pt-14 sm:pt-16 md:pt-20 pb-6 sm:pb-8 px-2 sm:px-3 md:px-4 max-w-7xl mx-auto relative z-20">
        {}
        <div className="glass-card rounded-lg sm:rounded-xl p-2 sm:p-3 mb-4 sm:mb-6 shadow-xl overflow-hidden" style={{ backdropFilter: "blur(8px)" }}>
          <div className="flex flex-col gap-2 sm:gap-3">
            {}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-lg flex items-center justify-center text-sm sm:text-base font-bold flex-shrink-0">
                🔖
              </div>
              <div className="flex-shrink-0 min-w-0">
                <div className="text-[10px] sm:text-xs text-gray-300">ID</div>
                <div className="font-semibold text-white text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{roomInfo.id}</div>
              </div>
              <div className="flex-shrink-0 min-w-0 hidden xs:block">
                <div className="text-[10px] sm:text-xs text-gray-300">Room</div>
                <div className="font-semibold text-white text-xs sm:text-sm truncate max-w-[100px] sm:max-w-none">{roomInfo.name}</div>
              </div>
              <div className="text-[10px] sm:text-xs text-gray-200 ml-auto flex-shrink-0">{roomInfo.members} users</div>
            </div>

            {}
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <button onClick={() => { navigator.clipboard?.writeText(roomInfo.id); addNotification("📋 Copied"); }} className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded bg-white/10 text-white hover:bg-white/20 text-[10px] sm:text-xs">Copy</button>
              {isCreator && (
                <button onClick={handleDeleteRoom} className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded bg-orange-500 text-white hover:bg-orange-600 text-[10px] sm:text-xs">Delete</button>
              )}
              <button onClick={handleLeaveRoom} className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded bg-red-500 text-white hover:bg-red-600 text-[10px] sm:text-xs">Leave</button>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
          <div className="min-h-[350px] sm:min-h-[400px] lg:min-h-0">
            <Todo addNotification={addNotification} />
          </div>
          <div className="col-span-1 lg:col-span-2 min-h-[350px] sm:min-h-[400px] lg:min-h-0">
            <Notes addNotification={addNotification} />
          </div>
        </div>

        <FocusPlaylist 
          addNotification={addNotification}
          bgPanelOpen={bgPanelOpen}
          setBgPanelOpen={setBgPanelOpen}
        />
      </main>

      {}
      <div className="fixed right-0 top-1/3 z-40 flex flex-col gap-1.5 sm:gap-2">
        <button onClick={() => setOpenPanel("participants")} className="bg-blue-600 text-white pl-2 pr-1 sm:pl-3 sm:pr-2 py-1.5 sm:py-2 rounded-l-full shadow-md text-xs sm:text-sm flex items-center gap-1">
          <span>👥</span>
          <span className="hidden sm:inline text-xs">Users</span>
        </button>
        <button onClick={() => setOpenPanel("chat")} className="bg-green-600 text-white pl-2 pr-1 sm:pl-3 sm:pr-2 py-1.5 sm:py-2 rounded-l-full shadow-md relative text-xs sm:text-sm flex items-center gap-1">
          <span>💬</span>
          <span className="hidden sm:inline text-xs">Chat</span>
          {unreadChat > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] sm:text-[10px] rounded-full px-1 py-0.5 min-w-[16px] sm:min-w-[18px] text-center leading-none">
              {unreadChat}
            </span>
          )}
        </button>
      </div>

      {}
      <aside className={cx("fixed top-0 right-0 h-full w-[85vw] xs:w-[70vw] sm:w-80 md:w-96 z-[120] transition-transform duration-300", openPanel === "participants" ? "translate-x-0" : "translate-x-full")}>
        <div className="h-full bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl p-3 sm:p-4 border-l border-white/10 overflow-y-auto rounded-l-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white text-sm sm:text-base font-semibold">Users ({participants?.length || 0})</h4>
            <button
              onClick={closePanel}
              aria-label="Close panel"
              className="text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {participants && participants.length > 0 ? (
              participants.map((p) => (
                <div key={p.userId} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">
                    {p.displayName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm truncate">{p.displayName || "User"}</div>
                  </div>
                  {p.userId === roomData?.creatorId && (
                    <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded flex-shrink-0">Host</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-gray-300 text-center py-4 text-sm">No users</div>
            )}
          </div>
        </div>
      </aside>

      {}
      <aside className={cx("fixed top-0 right-0 h-full w-[85vw] xs:w-[70vw] sm:w-80 md:w-96 z-[120] transition-transform duration-300", openPanel === "chat" ? "translate-x-0" : "translate-x-full")}>
        <div className="h-full flex flex-col bg-black/80 backdrop-blur-xl p-3 border-l border-white/10 rounded-l-2xl shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white text-sm sm:text-base font-semibold">Chat</h4>
            <button
              onClick={closePanel}
              aria-label="Close panel"
              className="text-white bg-black/40 hover:bg-black/60 rounded-full p-1.5 ring-1 ring-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto space-y-1.5 custom-scrollbar">
            {chatMessages.map((m, i) => {
              const isOwn = m.userId === user?.uid;
              const isSys = m.userId === "system";
              
              return (
                <div key={m.id || i} className={cx("p-2 rounded text-xs sm:text-sm max-w-[90%]", 
                  isOwn ? "ml-auto bg-blue-600 text-white" : 
                  isSys ? "mx-auto bg-gray-500/30 text-gray-300 text-center" :
                  "bg-white/10 text-white"
                )}>
                  {!isSys && !isOwn && (
                    <div className="text-[10px] text-gray-400 mb-0.5">{m.displayName || 'User'}</div>
                  )}
                  <div className="break-words">{m.message || m.text}</div>
                </div>
              );
            })}
            <div ref={chatEnd} />
          </div>

          <div className="mt-2 flex gap-1.5">
            <input 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-2 py-1.5 rounded bg-white/5 text-white outline-none text-xs sm:text-sm" 
              placeholder="Message..." 
            />
            <button onClick={sendMessage} className="px-3 py-1.5 bg-blue-600 rounded text-white hover:bg-blue-700 text-xs sm:text-sm">Send</button>
          </div>
        </div>
      </aside>
      
      {}
      <div
        className={`fixed bottom-16 sm:bottom-24 left-1/2 transform -translate-x-1/2 w-[96vw] sm:w-80 rounded-xl bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl p-3 sm:p-4 transition-all duration-500 z-50 ${
          bgPanelOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h3 className="font-semibold text-white flex items-center gap-1.5 text-xs sm:text-sm">
            <span>🎨</span> Ambience
          </h3>
          <button onClick={() => setBgPanelOpen(false)} className="text-white hover:text-red-400">✖</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            ["🌿", "Garden", "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg"],
            ["🏔️", "Mountains", "https://images.pexels.com/photos/772803/pexels-photo-772803.jpeg"],
            ["💧", "Waterfall", "https://images.pexels.com/photos/2150347/pexels-photo-2150347.jpeg"],
            ["🏖️", "Beach", "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg"],
            ["🌊", "Lake", "https://images.pexels.com/photos/761517/pexels-photo-761517.jpeg"],
            ["🌌", "Night", "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg"],
          ].map(([emoji, name, url]) => (
            <button
              key={name}
              onClick={() => changeBackground(url)}
              className="px-2 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-1.5 text-xs"
            >
              <span>{emoji}</span> <span className="truncate">{name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyRoom1;
