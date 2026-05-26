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
import "./MySpace.css";

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
  const [navHeight, setNavHeight] = useState(64);
  
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const navElement = document.querySelector(".site-navbar") || document.querySelector("nav");
    if (!navElement) return undefined;

    const syncNavHeight = () => {
      const measured = Math.ceil(
        navElement.getBoundingClientRect().height || navElement.offsetHeight || 64
      );

      setNavHeight((previous) => (previous === measured ? previous : measured));
    };

    syncNavHeight();

    let navResizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      navResizeObserver = new ResizeObserver(syncNavHeight);
      navResizeObserver.observe(navElement);
    }

    window.addEventListener("resize", syncNavHeight);

    return () => {
      window.removeEventListener("resize", syncNavHeight);
      if (navResizeObserver) {
        navResizeObserver.disconnect();
      }
    };
  }, []);

  const [notifications, setNotifications] = useState([]);
  const addNotification = (text) => {
    const id = Date.now();
    setNotifications((n) => [...n, { id, text }]);
    setTimeout(() => {
      setNotifications((n) => n.filter((x) => x.id !== id));
    }, 3000);
  };

  const [chatInput, setChatInput] = useState("");
  const chatEnd = useRef();
  const chatLogRef = useRef(null);
  
  const chatMessages = firestoreChatMessages && firestoreChatMessages.length > 0 
    ? firestoreChatMessages 
    : [{ userId: "system", displayName: "System", message: "Welcome!" }];
  
  useEffect(() => {
    const log = chatLogRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
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

  const sortedParticipants = (participants || [])
    .slice()
    .sort((a, b) => {
      const aIsHost = a?.userId && roomData?.creatorId && a.userId === roomData.creatorId;
      const bIsHost = b?.userId && roomData?.creatorId && b.userId === roomData.creatorId;
      if (aIsHost && !bIsHost) return -1;
      if (!aIsHost && bIsHost) return 1;
      const aName = String(a?.displayName || "").toLowerCase();
      const bName = String(b?.displayName || "").toLowerCase();
      return aName.localeCompare(bName);
    });

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
    <div className="ms-page" style={{ "--ms-nav-height": `${navHeight}px` }}>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; }
        .animate-slideInRight { animation: slideInRight .35s ease; }
        @keyframes slideInRight { from { transform: translateX(12px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      <div
        className="fixed inset-0 bg-cover bg-center bg-fixed transition-all duration-700 z-0 filter saturate-90"
        style={{ backgroundImage: `url('${bgUrl}')` }}
        aria-hidden
      />

      <div className="ms-bg-overlay" aria-hidden="true" />
      <div className="ms-bg-grid" aria-hidden="true" />
      <div className="ms-aura ms-aura--blue" aria-hidden="true" />
      <div className="ms-aura ms-aura--violet" aria-hidden="true" />

      {}
      {openPanel && (
        <div
          onClick={closePanel}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
          aria-label="Close side panel"
        />
      )}
      {}
      <div className="fixed right-2 sm:right-4 top-14 sm:top-16 z-50 space-y-1.5 max-w-[calc(100vw-1rem)] sm:max-w-xs">
        {notifications.map((n) => (
          <div key={n.id} className="bg-blue-600 text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded text-xs sm:text-sm shadow-md animate-slideInRight truncate">
            {n.text}
          </div>
        ))}
      </div>

      {}
      <main className="ms-content">
        <header className="ms-topbar ms-reveal" role="banner">
          <div className="ms-topbar__left">
            <div className="ms-topbar__identity">
              <div className="ms-topbar__eyebrow">
                <span className="ms-topbar__eyebrow-dot" />
                Study room live
              </div>
              <h1 className="ms-topbar__title">{roomInfo.name}</h1>
              <p className="ms-topbar__subtitle">
                Hosted by <strong>{roomInfo.host}</strong> • Room ID {roomInfo.id}
              </p>
            </div>
            <nav className="ms-stat-strip" aria-label="Room context">
              <div className="ms-stat-chip">
                <span className="ms-stat-chip__label">Members</span>
                <span className="ms-stat-chip__divider" />
                <span className="ms-stat-chip__value">{roomInfo.members}</span>
              </div>
              <div className="ms-stat-chip">
                <span className="ms-stat-chip__label">Room ID</span>
                <span className="ms-stat-chip__divider" />
                <span className="ms-stat-chip__value">{roomInfo.id}</span>
              </div>
            </nav>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { navigator.clipboard?.writeText(roomInfo.id); addNotification("📋 Copied"); }}
              className="px-3 py-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 text-xs border border-white/10"
            >
              Copy Room ID
            </button>
            {isCreator && (
              <button
                onClick={handleDeleteRoom}
                className="px-3 py-1.5 rounded-full bg-orange-500/80 text-white hover:bg-orange-500 text-xs border border-orange-400/50"
              >
                Delete Room
              </button>
            )}
            <button
              onClick={handleLeaveRoom}
              className="px-3 py-1.5 rounded-full bg-red-500/80 text-white hover:bg-red-500 text-xs border border-red-400/50"
            >
              Leave Room
            </button>
          </div>
        </header>

        <div className="ms-workspace ms-workspace--room ms-reveal ms-reveal--d1">
          <section className="ms-workspace__participants ms-panel ms-panel--accented" aria-label="Room participants">
            <div className="ms-panel__header">
              <div>
                <h2 className="ms-panel__title">Participants</h2>
                <div className="text-[11px] text-gray-400">{participants?.length || 0} online</div>
              </div>
              <span className="ms-panel__badge">Live</span>
            </div>
            <div className="ms-panel__body">
              <div className="p-3">
                <ul className="space-y-2">
                  {sortedParticipants.map((p, index) => {
                    const isHost = p?.userId && roomData?.creatorId && p.userId === roomData.creatorId;
                    return (
                    <li key={p.userId} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 text-white">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-semibold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="truncate text-xs sm:text-sm">{p.displayName || "User"}</span>
                      {isHost && (
                        <span className="text-[10px] uppercase tracking-wide bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">
                          Host
                        </span>
                      )}
                    </li>
                  );
                })}
                </ul>
              </div>
            </div>
          </section>

          <section className="ms-workspace__chat ms-panel ms-panel--accented" aria-label="Room chat">
            <div className="ms-panel__header">
              <div>
                <h2 className="ms-panel__title">Chat</h2>
                <div className="text-[11px] text-gray-400">Stay in sync with your room</div>
              </div>
              <span className="ms-panel__badge">Live</span>
            </div>
            <div className="ms-panel__body">
              <div ref={chatLogRef} className="chat-log flex-1 overflow-auto space-y-2 custom-scrollbar p-3 bg-white/5 rounded-xl mx-3 mt-2 mb-2">
                {chatMessages.map((m, i) => {
                  const isOwn = m.userId === user?.uid;
                  const isSys = m.userId === "system";

                  return (
                    <div
                      key={m.id || i}
                      className={cx(
                        "p-2 rounded text-xs sm:text-sm max-w-[90%]",
                        isOwn
                          ? "ml-auto bg-blue-600 text-white"
                          : isSys
                            ? "mx-auto bg-gray-500/30 text-gray-300 text-center"
                            : "bg-white/10 text-white"
                      )}
                    >
                      {!isSys && !isOwn && (
                        <div className="text-[10px] text-gray-400 mb-0.5">
                          {m.displayName || "User"}
                        </div>
                      )}
                      <div className="break-words">{m.message || m.text}</div>
                    </div>
                  );
                })}
                <div ref={chatEnd} />
              </div>
              <div className="chat-composer mt-auto px-3 pb-2">
                <div className="flex gap-2 bg-white/5 rounded-xl p-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 px-2 py-2 rounded bg-transparent text-white outline-none text-xs sm:text-sm"
                    placeholder="Message the room..."
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 text-xs sm:text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="ms-workspace__tasks ms-panel ms-panel--accented ms-panel--accented-neutral" aria-label="Room tasks">
            <div className="ms-panel__header">
              <h2 className="ms-panel__title">Tasks</h2>
              <span className="ms-panel__badge ms-panel__badge--neutral">Shared</span>
            </div>
            <div className="ms-panel__body">
              <Todo scope="room" addNotification={addNotification} />
            </div>
          </section>

          <section className="ms-workspace__notes ms-panel ms-panel--accented ms-panel--accented-violet" aria-label="Room notes">
            <div className="ms-panel__header">
              <h2 className="ms-panel__title">Notes</h2>
              <span className="ms-panel__badge ms-panel__badge--violet">Shared</span>
            </div>
            <div className="ms-panel__body">
              <Notes addNotification={addNotification} scope="room" />
            </div>
          </section>
        </div>

        <section className="ms-sound-section ms-reveal ms-reveal--d2" aria-label="Sound and ambience">
          <div className="ms-sound-panel">
            <div className="ms-sound-panel__header">
              <div>
                <h2 className="ms-sound-panel__title">Sound &amp; Ambience</h2>
                <p className="ms-sound-panel__desc">
                  Sync music with your room or switch ambience without leaving the session.
                </p>
              </div>
            </div>
            <div className="ms-sound-panel__body">
              <FocusPlaylist
                addNotification={addNotification}
                bgPanelOpen={bgPanelOpen}
                setBgPanelOpen={setBgPanelOpen}
              />
            </div>
          </div>
        </section>
      </main>

      {}
      <div className="fixed right-0 top-1/3 z-40 flex flex-col gap-1.5 sm:gap-2" />

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
