// StudyRoom-1.jsx
import React, { useEffect, useRef, useState } from "react";
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
// Navbar and Footer are provided by the global layout in App.jsx

/**
 * StudyRoom-1.jsx
 * - Exactly replicates the Study Room UI behavior from screenshots
 * - Uses Tailwind classes; assumes Tailwind is available in the project
 *
 * NOTE:
 * - Place your background images in public folder and update defaults below if needed
 * - Place audio file at /sounds/lofi.mp3 or change path
 */

const StudyRoom1 = () => {
  // ===== DARK MODE (persisted in localStorage) =====
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

  // ===== NOTIFICATIONS =====
  const [notifications, setNotifications] = useState([]);
  const addNotification = (text) => {
    const id = Date.now();
    setNotifications((n) => [...n, { id, text }]);
    setTimeout(() => {
      setNotifications((n) => n.filter((x) => x.id !== id));
    }, 4200);
  };

  // To-Do list moved to <Todo /> component (see src/components/Todo.jsx)

  // ===== NOTES (persisted) =====
  const [notes, setNotes] = useState(() => localStorage.getItem("sr_notes") || "");
  useEffect(() => {
    localStorage.setItem("sr_notes", notes);
  }, [notes]);
  // contentEditable ref so we can support rich text formatting like the plain JS version
  const notesAreaRef = useRef(null);
  const [notesSearch, setNotesSearch] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [voicesList, setVoicesList] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // load voices for TTS
  useEffect(() => {
    const load = () => {
      const vs = window.speechSynthesis?.getVoices() || [];
      setVoicesList(vs);
      // pick a reasonable default
      const pick = vs.find(v => /siri/i.test(v.name)) || vs.find(v => /google us english/i.test(v.name)) || vs[0] || null;
      setSelectedVoice(pick);
    };
    load();
    window.speechSynthesis && (window.speechSynthesis.onvoiceschanged = load);
  }, []);

  // sync notes state -> contentEditable on mount and when notes change externally
  useEffect(() => {
    const el = notesAreaRef.current;
    if (el && el.innerHTML !== notes) {
      el.innerHTML = notes;
    }
  }, [notes]);

  // auto-save debounce when user types
  useEffect(() => {
    const el = notesAreaRef.current;
    if (!el) return;
    let t = null;
    const onInput = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const html = el.innerHTML;
        setNotes(html);
        addNotification('💾 Notes auto-saved');
      }, 1200);
      updateCharCount();
    };
    el.addEventListener('input', onInput);
    return () => {
      el.removeEventListener('input', onInput);
      clearTimeout(t);
    };
  }, [notesAreaRef.current]);

  // character/word count helper (updates not stored in state to avoid extra renders)
  const updateCharCount = () => {
    const el = notesAreaRef.current;
    if (!el) return;
    const text = el.innerText || '';
    // sync to state lightly (we keep innerHTML in notes for persistence)
    // but update derived values by forcing a tiny state change (setNotes not necessary here)
  };

  // Formatting helpers (execCommand used for parity with existing plain JS code)
  const formatText = (cmd) => {
    const el = notesAreaRef.current;
    if (!el) return;
    el.focus();
    document.execCommand(cmd, false, null);
    // sync HTML back to state
    setNotes(el.innerHTML);
  };

  const toggleBullet = () => {
    const el = notesAreaRef.current;
    if (!el) return;
    el.focus();
    document.execCommand('insertUnorderedList', false, null);
    setNotes(el.innerHTML);
  };

  // Search and highlight
  const searchNotes = (term) => {
    const el = notesAreaRef.current;
    if (!el) return;
    if (!term) {
      // restore raw content
      el.innerHTML = notes;
      return;
    }
    try {
      const plain = el.innerText || '';
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const highlighted = plain.replace(regex, (m) => `<mark>${m}</mark>`);
      el.innerHTML = highlighted;
    } catch (e) {
      // fallback: no-op
    }
  };

  // Speech-to-text (dictation)
  const startDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addNotification('⚠️ Speech recognition not supported');
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (ev) => {
      const transcript = ev.results[ev.results.length - 1][0].transcript.trim();
      const el = notesAreaRef.current;
      if (!el) return;
      const existing = el.innerText.trim();
      el.innerText = (existing + ' ' + transcript).trim();
      setNotes(el.innerHTML);
      addNotification('✅ Dictation added');
    };
    rec.onerror = (e) => {
      console.error(e);
      addNotification('❌ Dictation error');
    };
    rec.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current = rec;
    rec.start();
    setIsRecording(true);
    addNotification('🎤 Listening...');
  };

  // Text-to-speech with voice control
  const readNotesAloud = () => {
    const el = notesAreaRef.current;
    if (!el) return;
    const text = el.innerText.trim();
    if (!text) return addNotification('ℹ️ No notes to read');
    if (!('speechSynthesis' in window)) return addNotification('🚫 Speech synthesis not supported');

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      addNotification('⏹️ Stopped reading');
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utter.voice = selectedVoice;
    utter.onend = () => {
      setIsSpeaking(false);
      addNotification('✅ Finished reading');
    };
    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    addNotification('🔊 Reading notes');
  };
  // save action invoked by the Save button (keeps parity with non-React JS file)
  const saveLocalNotes = () => {
    try {
      localStorage.setItem("sr_notes", notes);
      addNotification("💾 Notes saved");
    } catch (e) {
      addNotification("❌ Could not save notes");
    }
  };

  // derived quick stats for the notes area (chars/words/est. minutes) - read from editable area when possible
  const getNotesStats = () => {
    const text = notesAreaRef.current?.innerText || (notes || "");
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { chars, words, minutes };
  };
  const downloadNotes = () => {
    const blob = new Blob([notes || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification("📥 Notes downloaded");
  };
  const speakNotes = () => {
    const text = (notes || "").trim();
    if (!text) {
      addNotification("ℹ️ No notes to read");
      return;
    }
    if (!("speechSynthesis" in window)) {
      addNotification("🚫 Speech synthesis not supported");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    addNotification("🔊 Reading notes");
  };

  // ===== FILE UPLOADS (persisted list only) =====
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    try {
      const raw = localStorage.getItem("sr_files");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem("sr_files", JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);
  const handleFileUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const meta = { id: Date.now(), name: f.name, size: `${Math.round(f.size / 1024)} KB`, uploadedAt: new Date().toLocaleString() };
    setUploadedFiles((s) => [meta, ...s]);
    addNotification("📎 File uploaded");
  };
  const removeFile = (id) => {
    setUploadedFiles((s) => s.filter((x) => x.id !== id));
    addNotification("🗑️ File removed");
  };

  // ===== CHAT =====
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const raw = localStorage.getItem("sr_chat");
      return raw ? JSON.parse(raw) : [{ from: "system", text: "Welcome to the FocusoraHQ Study Room!" }];
    } catch {
      return [{ from: "system", text: "Welcome to the FocusoraHQ Study Room!" }];
    }
  });
  const [chatInput, setChatInput] = useState("");
  const chatEnd = useRef();
  useEffect(() => {
    localStorage.setItem("sr_chat", JSON.stringify(chatMessages));
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    const text = chatInput.trim();
    if (!text) return;
    setChatMessages((s) => [...s, { from: "you", text }]);
    setChatInput("");
    addNotification("💬 Message sent");
  };

  // ===== PANELS (participants/chat) =====
  const [openPanel, setOpenPanel] = useState(null);
  const openParticipants = () => setOpenPanel("participants");
  const openChat = () => setOpenPanel("chat");
  const closePanel = () => setOpenPanel(null);

  // ===== BACKGROUND IMAGE SELECTION =====
  const defaultBg = "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg";
  const [bgUrl, setBgUrl] = useState(() => localStorage.getItem("sr_bg") || defaultBg);
  useEffect(() => {
    localStorage.setItem("sr_bg", bgUrl);
  }, [bgUrl]);
  const changeBackground = (url) => {
    setBgUrl(url);
    addNotification("🎨 Background Changed");
    setBgPanelOpen(false);
  };

  // ===== MUSIC PLAYER (bottom bar) =====
  const audioRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setProgress((audio.currentTime / (audio.duration || 1)) * 100);
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);
  useEffect(() => {
    if (musicOn) {
      audioR
      ef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [musicOn]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const roomInfo = {
    id: "SR-6223",
    name: "Focus Study Room",
    host: "Host",
    members: 3,
  };

  const cx = (...args) => args.filter(Boolean).join(" ");

  // ===== BACKGROUND AMBIENCE PANEL =====
  const [bgPanelOpen, setBgPanelOpen] = useState(false);

  // Hide global footer while this page is mounted (restore on unmount)
  useEffect(() => {
    const sel = document.querySelector('footer, .footer, #footer, .site-footer');
    if (!sel) return;
    const prev = sel.style.display;
    sel.style.display = 'none';
    return () => {
      try { sel.style.display = prev || ''; } catch (e) { /* ignore */ }
    };
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-indigo-100 via-cyan-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      
      <style>{`
        /* custom scrollbar similar to original */
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; }
        .animate-slideInRight { animation: slideInRight .35s ease; }
        @keyframes slideInRight { from { transform: translateX(12px); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        /* small glass effect fallback */
        .glass-card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.06); }
      `}</style>

      {/* BACKGROUND LAYER */}
      <div
        id="bgLayer"
        className="fixed inset-0 bg-cover bg-center bg-fixed transition-all duration-700 z-0 filter saturate-90"
        style={{ backgroundImage: `url('${bgUrl}')`, opacity: 1 }}
        aria-hidden
      />

      {/* Notifications stack */}
      <div className="fixed right-6 top-16 z-50 space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md animate-slideInRight">
            {n.text}
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto relative z-20">
        {/* ROOM INFO BAR */}
        <div className="glass-card rounded-xl p-4 mb-8 flex items-center justify-between shadow-xl" style={{ backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-lg font-bold">
              🔖
            </div>
            <div>
              <div className="text-xs text-gray-300">Room ID</div>
              <div className="font-semibold text-white text-lg">{roomInfo.id}</div>
            </div>

            <div className="ml-6">
              <div className="text-xs text-gray-300">Room Name</div>
              <div className="font-semibold text-white">{roomInfo.name}</div>
            </div>

            <div className="ml-6">
              <div className="text-xs text-gray-300">Created By</div>
              <div className="font-semibold text-white">{roomInfo.host}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-200">Members {roomInfo.members}</div>
            <button onClick={() => { navigator.clipboard?.writeText(roomInfo.id); addNotification("📋 Room ID copied"); }} className="px-3 py-2 rounded-md bg-white/10 text-white">Copy ID</button>
            <button onClick={() => addNotification("Invite link copied (placeholder)")} className="px-3 py-2 rounded-md bg-emerald-500 text-white">Invite</button>
          </div>
        </div>

        {/* GRID: Left To-Do | Middle Notes | Right Chat */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* LEFT: TO-DO */}
          <Todo addNotification={addNotification} />

          {/* MIDDLE: NOTES (span two columns on large screens to leave right column vacant) */}
          <div className="col-span-1 lg:col-span-2">
            <Notes addNotification={addNotification} />
          </div>

        </div>

        {/* ===== FOCUS PLAYLIST COMPONENT ===== */}
        <FocusPlaylist 
          addNotification={addNotification}
          bgPanelOpen={bgPanelOpen}
          setBgPanelOpen={setBgPanelOpen}
        />

      </main>

  {/* RIGHT FLOATING PANEL TRIGGERS */}
      <div className="fixed right-4 top-1/3 z-50 flex flex-col gap-3">
        <button onClick={openParticipants} className="bg-blue-600 text-white px-4 py-2 rounded-l-full shadow-md">👥 Participants</button>
        <button onClick={openChat} className="bg-green-600 text-white px-4 py-2 rounded-l-full shadow-md">💬 Chat</button>
      </div>

      {/* OFF-CANVAS PARTICIPANTS */}
      <aside className={cx("fixed top-0 right-0 h-full w-80 z-50 transition-transform duration-300", openPanel === "participants" ? "translate-x-0" : "translate-x-full")}>
        <div className="h-full bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl p-4 border-l border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white text-lg font-semibold">Participants</h4>
            <button onClick={closePanel} className="text-white"><X /></button>
          </div>
          <div className="text-gray-300">No participants yet</div>
        </div>
      </aside>

      {/* OFF-CANVAS CHAT */}
      <aside className={cx("fixed top-0 right-0 h-full w-96 z-50 transition-transform duration-300", openPanel === "chat" ? "translate-x-0" : "translate-x-full")}>
        <div className="h-full flex flex-col bg-black/80 backdrop-blur-xl p-4 border-l border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-white text-lg font-semibold">Chat</h4>
            <button onClick={closePanel} className="text-white"><X /></button>
          </div>

          <div className="flex-1 overflow-auto space-y-2">
            {chatMessages.map((m, i) => (
              <div key={i} className={cx("p-2 rounded-md max-w-[75%]", m.from === "you" ? "ml-auto bg-blue-600 text-white" : "bg-white/10 text-white")}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="mt-auto flex gap-2">
            <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} className="flex-1 px-3 py-2 rounded-md bg-white/5 text-white outline-none" placeholder="Type a message..." />
            <button onClick={() => { sendMessage(); }} className="px-4 py-2 bg-blue-600 rounded-md text-white">Send</button>
          </div>
        </div>
      </aside>
      
{/* ===== BACKGROUND SELECTOR PANEL ===== */}
<div
  className={`fixed bottom-36 left-1/2 transform -translate-x-1/2 w-96 max-w-[90vw] rounded-2xl bg-gradient-to-br from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border border-white/20 shadow-xl p-5 transition-all duration-500 z-50 ${
    bgPanelOpen
      ? "opacity-100 translate-y-0 pointer-events-auto"
      : "opacity-0 translate-y-6 pointer-events-none"
  }`}
>
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-white flex items-center gap-2">
      <span className="text-xl">🎨</span> Choose Ambience
    </h3>
    <button
      onClick={() => setBgPanelOpen(false)}
      className="text-white text-lg hover:text-red-400 transition"
    >
      ✖
    </button>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <button
      onClick={() =>
        changeBackground(
          "https://images.pexels.com/photos/158063/bellingrath-gardens-alabama-landscape-scenic-158063.jpeg"
        )
      }
      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
    >
      🌿 <span>Serene Garden</span>
    </button>
    <button
      onClick={() =>
        changeBackground(
          "https://images.pexels.com/photos/772803/pexels-photo-772803.jpeg"
        )
      }
      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
    >
      🏔️ <span>Majestic Mountains</span>
    </button>
    <button
      onClick={() =>
        changeBackground(
          "https://images.pexels.com/photos/2150347/pexels-photo-2150347.jpeg"
        )
      }
      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
    >
      💧 <span>Peaceful Waterfall</span>
    </button>
    <button
      onClick={() =>
        changeBackground(
          "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg"
        )
      }
      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
    >
      🏖️ <span>Tranquil Beach</span>
    </button>
    <button
      onClick={() =>
        changeBackground(
          "https://images.pexels.com/photos/761517/pexels-photo-761517.jpeg"
        )
      }
      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
    >
      🌊 <span>Calm Lake</span>
    </button>
    <button
      onClick={() =>
        changeBackground(
          "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg"
        )
      }
      className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
    >
      🌌 <span>Starry Night</span>
    </button>
  </div>
</div>

    </div>
    
  );
};

export default StudyRoom1;
