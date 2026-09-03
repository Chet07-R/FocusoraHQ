import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, 
  Sparkles, 
  Users, 
  Zap, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  ArrowLeft, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight, 
  Menu, 
  X
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { POINT_RULES } from "../constants/pointsSystem";

const Documentation = () => {
  const { darkMode } = useTheme();
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedBlock, setCopiedBlock] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2000);
  };

  const handleFeedback = (docId, isHelpful) => {
    setFeedback(prev => ({
      ...prev,
      [docId]: isHelpful ? "positive" : "negative"
    }));
  };

  const sidebar = useMemo(() => [
    {
      title: "Getting Started",
      icon: Rocket,
      items: [
        { name: "Introduction", id: "intro", badge: "Start" },
        { name: "Quick Start Guide", id: "quickstart" },
        { name: "Platform Architecture", id: "architecture" }
      ]
    },
    {
      title: "Core Features",
      icon: Sparkles,
      items: [
        { name: "Study Rooms & Spaces", id: "study-rooms", badge: "Popular" },
        { name: "Pomodoro Focus Timer", id: "pomodoro" },
        { name: "Task & Note Workspaces", id: "tasks-notes" },
        { name: "Soundscapes & Spotify", id: "soundscapes" }
      ]
    },
    {
      title: "Collaboration & Community",
      icon: Users,
      items: [
        { name: "Creating & Hosting Spaces", id: "create-space" },
        { name: "Joining via Space Code", id: "join-space" },
        { name: "Live Room Presence & Chat", id: "presence-chat" }
      ]
    },
    {
      title: "Advanced & Developer",
      icon: Zap,
      items: [
        { name: "Leaderboard & XP Rules", id: "leaderboard-xp" },
        { name: "Keyboard Shortcuts", id: "shortcuts" },
        { name: "REST API & Webhooks", id: "api-reference" },
        { name: "Security & Permissions", id: "security" }
      ]
    }
  ], []);

  // List of all items for Prev/Next navigation
  const allNavItems = useMemo(() => {
    const list = [];
    sidebar.forEach(group => {
      group.items.forEach(item => {
        list.push({ ...item, groupTitle: group.title });
      });
    });
    return list;
  }, [sidebar]);

  const currentIndex = allNavItems.findIndex(item => item.id === activeSection);
  const prevNav = currentIndex > 0 ? allNavItems[currentIndex - 1] : null;
  const nextNav = currentIndex < allNavItems.length - 1 ? allNavItems[currentIndex + 1] : null;

  const content = {
    intro: {
      title: "Introduction to FocusoraHQ",
      category: "Getting Started",
      description: "Welcome to FocusoraHQ — the all-in-one productivity suite built for deep work, peer accountability, and distraction-free study loops.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            FocusoraHQ is an ambient web-based productivity hub engineered for students, researchers, remote software engineers, and focused professionals. It eliminates digital distractions by uniting customizable Pomodoro cycles, interactive study rooms, real-time shared tasks, ambient sound generators, and competitive gamified leaderboards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-blue-50/70 border-blue-100"}`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-blue-500">
                <Clock className="w-5 h-5" />
                <span>Deep Work Loops</span>
              </div>
              <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Scientifically tuned 25/5 and 50/10 Pomodoro timers designed to keep your cognitive load optimal without burnout.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-purple-50/70 border-purple-100"}`}>
              <div className="flex items-center gap-2 mb-2 font-bold text-purple-500">
                <Users className="w-5 h-5" />
                <span>Virtual Study Pods</span>
              </div>
              <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
                Create password-protected or public study rooms with 6-digit codes, shared lofi playlists, live presence, and persistent notes.
              </p>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border-l-4 border-blue-500 ${darkMode ? "bg-blue-950/30 border-blue-500" : "bg-blue-50/80"}`}>
            <h4 className="font-bold text-sm mb-1 text-blue-400">✨ Platform Pillars:</h4>
            <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside mt-2">
              <li><strong>Zero Installation:</strong> Runs natively in any modern desktop or mobile browser.</li>
              <li><strong>Realtime Sync:</strong> Instant state updates across all connected participants.</li>
              <li><strong>Gamified Motivation:</strong> Earn XP, climb ranks from Bronze to Diamond, and maintain streaks.</li>
              <li><strong>Privacy First:</strong> End-to-end user isolation with authenticated Firebase rules.</li>
            </ul>
          </div>
        </div>
      )
    },

    quickstart: {
      title: "Quick Start Guide",
      category: "Getting Started",
      description: "Set up your focus workspace and start your first session in under 60 seconds.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Follow this 3-step walkthrough to customize your profile, join a focus pod, and start collecting productivity points.
          </p>

          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-1">Create or Join an Account</h4>
                  <p className={`text-xs sm:text-sm mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Sign up with your email or use one-click Google Authentication. Guest mode is also available for quick trial sessions.
                  </p>
                  <Link to="/signup" className="text-xs text-blue-500 font-bold hover:underline inline-flex items-center gap-1">
                    Sign Up Now <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-1">Enter Your Workspace (My Space or Study Room)</h4>
                  <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Head to <strong>My Space</strong> for solo deep work, or select <strong>Study Room</strong> to join peer spaces with active participants.
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border ${darkMode ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm sm:text-base mb-1">Start Focus Timer & Sync Tasks</h4>
                  <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    Hit 'Start' on your Pomodoro timer, add your session to-do items, and select background lofi audio. Points will be automatically tracked in the background!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    architecture: {
      title: "Platform Architecture",
      category: "Getting Started",
      description: "How FocusoraHQ manages state synchronization, real-time presence, and security.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            FocusoraHQ is built on a responsive React (Vite) client, backed by Google Firebase Firestore and Socket.io cluster services for real-time multiplayer coordination.
          </p>

          <div className={`p-4 rounded-xl font-mono text-xs overflow-x-auto ${darkMode ? "bg-slate-950 border border-slate-800 text-cyan-300" : "bg-slate-900 text-cyan-200"}`}>
            <pre>{`[ Client Layer ] --> React 18 + TailwindCSS + Web Audio Engine
[ Realtime Sync ] --> Firebase Firestore Listeners (Live Rooms & Leaderboards)
[ Signaling/WS ]  --> Socket.io Cluster (Room Chat & Presence)
[ Auth Provider ] --> Firebase Auth (Email/Password & Google OAuth 2.0)`}</pre>
          </div>

          <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Rooms operate on an auto-garbage-collection lifecycle: rooms without active users are safely archived, and presence signals refresh every 10 seconds.
          </p>
        </div>
      )
    },

    "study-rooms": {
      title: "Study Rooms & Spaces",
      category: "Core Features",
      description: "Comprehensive guide to hosting, joining, and managing study spaces.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Study Rooms bring the feeling of a productive library or co-working lounge right into your screen.
          </p>

          <h4 className="font-bold text-sm sm:text-base">Room Capabilities:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
            <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="font-bold text-blue-500 block mb-1">🏷️ Space Codes</span>
              Every room has an easily shareable 6-digit code for instant 1-click peer joining.
            </div>
            <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="font-bold text-purple-500 block mb-1">👥 Host & Participants</span>
              Live member list with avatars, study streak status, and host indicators.
            </div>
            <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="font-bold text-emerald-500 block mb-1">💬 Room Chat</span>
              Instant messaging to share resources, questions, and session milestones.
            </div>
            <div className={`p-3.5 rounded-xl border ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
              <span className="font-bold text-amber-500 block mb-1">📝 Shared Notes</span>
              Integrated rich text notes with download and quick-save features.
            </div>
          </div>
        </div>
      )
    },

    pomodoro: {
      title: "Pomodoro Focus Timer",
      category: "Core Features",
      description: "Master intervals, breaks, and session tracking.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            The built-in Pomodoro engine tracks every active study second. It offers customized cycle intervals and audible bell chimes upon interval completion.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="text-2xl mb-1">⏱️</div>
              <div className="font-bold text-blue-500 text-sm">25 Minutes</div>
              <div className="text-xs text-slate-400 mt-1">Standard Focus</div>
            </div>
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="text-2xl mb-1">☕</div>
              <div className="font-bold text-emerald-500 text-sm">5 Minutes</div>
              <div className="text-xs text-slate-400 mt-1">Short Refresh</div>
            </div>
            <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
              <div className="text-2xl mb-1">🧘</div>
              <div className="font-bold text-purple-500 text-sm">15-30 Minutes</div>
              <div className="text-xs text-slate-400 mt-1">Long Break</div>
            </div>
          </div>
        </div>
      )
    },

    "tasks-notes": {
      title: "Task & Note Workspaces",
      category: "Core Features",
      description: "Managing study tasks, notes export, and offline sync.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Every workspace integrates a markdown-ready notes pad and checklist. Tasks can be created, marked complete, or cleared with full keyboard navigation.
          </p>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900/80 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-blue-500">Key Features:</h4>
            <ul className="text-xs sm:text-sm space-y-2 list-disc list-inside">
              <li><strong>Instant Save:</strong> Auto-saves note drafts every 3 seconds to prevent accidental loss.</li>
              <li><strong>Export Notes:</strong> Download notes in `.txt` or `.md` directly to your local file system.</li>
              <li><strong>XP Bonus:</strong> Earn +{POINT_RULES.taskAdded} pt for task creation and +{POINT_RULES.taskCompleted} pts on completion.</li>
            </ul>
          </div>
        </div>
      )
    },

    soundscapes: {
      title: "Soundscapes & Spotify",
      category: "Core Features",
      description: "Curated playlists, audio loop generators, and volume controls.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Sound is critical for tuning out ambient household or campus chatter. FocusoraHQ includes ambient generators (Rain, Cafe, Lofi, White Noise) alongside a compact Spotify player.
          </p>

          <div className={`p-4 rounded-2xl border-l-4 border-emerald-500 ${darkMode ? "bg-emerald-950/20" : "bg-emerald-50"}`}>
            <h4 className="font-bold text-sm text-emerald-400 mb-1">Spotify Player Tip:</h4>
            <p className="text-xs sm:text-sm leading-relaxed">
              Log in to your Spotify web account in the same browser to stream unlimited full-length tracks without playback timeouts.
            </p>
          </div>
        </div>
      )
    },

    "create-space": {
      title: "Creating & Hosting Spaces",
      category: "Collaboration",
      description: "Step-by-step instructions for room creators.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Creating a space takes two clicks: click <strong>Study Room &gt; Create Space</strong>, enter your room name, choose a topic category, and generate your room.
          </p>
          <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"} text-xs sm:text-sm`}>
            <strong>Host Privileges:</strong> Hosts can adjust room topic badges, update ambient presets, and view all active participant streaks in real time.
          </div>
        </div>
      )
    },

    "join-space": {
      title: "Joining via Space Code",
      category: "Collaboration",
      description: "Entering a live room with a 6-digit code or URL.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Recipients can join simply by navigating to <strong>Study Room &gt; Join Space</strong> and typing the room's Space Code. The system automatically connects their avatar to the active room cluster.
          </p>
        </div>
      )
    },

    "presence-chat": {
      title: "Live Room Presence & Chat",
      category: "Collaboration",
      description: "Real-time communication and focus room etiquette.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Room chat allows quick check-ins between focus sprints. All messages are synchronized via Socket.io with timestamps and user identifiers.
          </p>
        </div>
      )
    },

    "leaderboard-xp": {
      title: "Leaderboard & XP Rules",
      category: "Advanced & Developer",
      description: "Scoring formulas, streaks, and league tiers.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            The leaderboard is updated live with transparent scoring formulas:
          </p>

          <div className="overflow-x-auto">
            <table className={`w-full text-xs sm:text-sm text-left border rounded-xl overflow-hidden ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
              <thead className={darkMode ? "bg-slate-900 text-slate-200" : "bg-slate-100 text-slate-800"}>
                <tr>
                  <th className="p-3">Action</th>
                  <th className="p-3">Points Awarded</th>
                  <th className="p-3">Trigger Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-medium">Focused Minute (Pomodoro)</td>
                  <td className="p-3 text-blue-400 font-bold">+{POINT_RULES.pomodoroPerMinute} pt</td>
                  <td className="p-3 text-slate-400">Every active minute</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Task Created</td>
                  <td className="p-3 text-blue-400 font-bold">+{POINT_RULES.taskAdded} pt</td>
                  <td className="p-3 text-slate-400">Per task added</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Task Completed</td>
                  <td className="p-3 text-emerald-400 font-bold">+{POINT_RULES.taskCompleted} pts</td>
                  <td className="p-3 text-slate-400">Per completed task</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Notes Saved</td>
                  <td className="p-3 text-cyan-400 font-bold">+{POINT_RULES.notesSave} pt</td>
                  <td className="p-3 text-slate-400">On draft save</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },

    shortcuts: {
      title: "Keyboard Shortcuts",
      category: "Advanced & Developer",
      description: "Boost your speed with universal hotkeys.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            Use these shortcuts to manage your timer, notes, and music without reaching for the mouse:
          </p>

          <div className="space-y-2">
            {[
              { key: "Space", desc: "Start / Pause Pomodoro timer" },
              { key: "Ctrl + S / ⌘ + S", desc: "Save study notes immediately" },
              { key: "Ctrl + Enter / ⌘ + Enter", desc: "Quick-add new to-do task" },
              { key: "Ctrl + M / ⌘ + M", desc: "Toggle background ambient sound" },
              { key: "Ctrl + K / ⌘ + K", desc: "Open global search & help" }
            ].map((shortcut, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"
                }`}
              >
                <span className="text-xs sm:text-sm font-medium">{shortcut.desc}</span>
                <kbd className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  darkMode ? "bg-slate-950 border-slate-700 text-cyan-400" : "bg-slate-100 border-slate-300 text-slate-800"
                }`}>
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      )
    },

    "api-reference": {
      title: "REST API & Webhooks",
      category: "Advanced & Developer",
      description: "Programmatic access to leaderboard and session data.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            FocusoraHQ provides REST endpoints for integrating focus metrics into custom widgets, student dashboards, or university portals.
          </p>

          <div className={`p-4 rounded-xl font-mono text-xs overflow-x-auto relative ${
            darkMode ? "bg-slate-950 border border-slate-800 text-slate-200" : "bg-slate-900 text-slate-100"
          }`}>
            <button
              onClick={() => copyToClipboard('GET https://focusorahq.com/api/users/leaderboard?sortBy=points&limit=10', 'api-code')}
              className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Copy request"
            >
              {copiedBlock === 'api-code' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <pre>{`// Fetch Top 10 Leaderboard
GET /api/users/leaderboard?sortBy=points&limit=10

// Response (200 OK)
{
  "success": true,
  "count": 10,
  "data": [
    {
      "rank": 1,
      "name": "Chetan",
      "points": 613,
      "sessions": 10,
      "streak": 2
    }
  ]
}`}</pre>
          </div>
        </div>
      )
    },

    security: {
      title: "Security & Permissions",
      category: "Advanced & Developer",
      description: "Data encryption, session isolation, and account protection.",
      body: (
        <div className="space-y-6">
          <p className="leading-relaxed">
            User security and data isolation are fundamental to FocusoraHQ. All Firestore read/write operations require valid auth tokens, and session notes are sandboxed per user account.
          </p>

          <div className={`p-4 rounded-xl border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <h4 className="font-bold text-xs uppercase tracking-wider mb-2 text-emerald-500">Security Guarantees:</h4>
            <ul className="text-xs sm:text-sm space-y-1.5 list-disc list-inside text-slate-400 dark:text-slate-300">
              <li>HTTPS/TLS 1.3 encryption across all client-server transit.</li>
              <li>Firebase security rules enforcing user ownership of notes and tasks.</li>
              <li>Zero selling of user analytics or behavioral logs.</li>
            </ul>
          </div>
        </div>
      )
    }
  };

  const filteredSidebar = useMemo(() => {
    if (!searchQuery.trim()) return sidebar;
    const term = searchQuery.trim().toLowerCase();
    return sidebar
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.name.toLowerCase().includes(term) ||
            group.title.toLowerCase().includes(term)
        )
      }))
      .filter((group) => group.items.length > 0);
  }, [sidebar, searchQuery]);

  const activeDoc = content[activeSection] || content.intro;

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 transition-colors duration-300`}>
      
      {/* 📚 Documentation Header */}
      <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-xs font-semibold text-blue-300 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>FocusoraHQ Documentation v2.4</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Documentation & Guides
              </h1>
              <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
                Technical references, room mechanics, scoring rules, and shortcut sheets.
              </p>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                <span>{isMobileMenuOpen ? "Close Docs Menu" : "Browse Topics"}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 📖 Documentation Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
          
          {/* 📑 Sidebar (Desktop Sticky + Mobile Drawer) */}
          <aside className={`w-full lg:w-72 shrink-0 ${
            isMobileMenuOpen ? "block" : "hidden lg:block"
          } rounded-2xl p-4 sm:p-5 border ${
            darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-md"
          } lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto`}>
            
            {/* Quick Search */}
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter topics..."
                className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              {filteredSidebar.map((section, sIdx) => {
                const Icon = section.icon;

                return (
                  <div key={sIdx}>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500 mb-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{section.title}</span>
                    </div>

                    <ul className="space-y-1">
                      {section.items.map((item) => {
                        const isActive = activeSection === item.id;

                        return (
                          <li key={item.id}>
                            <button
                              onClick={() => {
                                setActiveSection(item.id);
                                setIsMobileMenuOpen(false);
                                window.scrollTo({ top: 160, behavior: "smooth" });
                              }}
                              className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                                isActive
                                  ? "bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
                                  : darkMode
                                    ? "text-slate-400 hover:text-white hover:bg-slate-800/60"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                              }`}
                            >
                              <span className="truncate">{item.name}</span>
                              {item.badge && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                  isActive ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-500"
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
              {filteredSidebar.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4">No matching topics found.</p>
              )}
            </div>
          </aside>

          {/* 📄 Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            <article className={`rounded-2xl p-5 sm:p-8 md:p-10 border ${
              darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-md"
            }`}>
              
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 flex-wrap">
                <Link to="/help-center" className="hover:text-blue-500">Knowledge Hub</Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span>{activeDoc.category}</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-blue-500 font-bold">{activeDoc.title}</span>
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                {activeDoc.title}
              </h2>
              <p className={`text-xs sm:text-sm pb-6 mb-6 border-b ${
                darkMode ? "text-slate-400 border-slate-800" : "text-slate-600 border-slate-100"
              }`}>
                {activeDoc.description}
              </p>

              {/* Rendered Body */}
              <div className="text-xs sm:text-sm leading-relaxed">
                {activeDoc.body}
              </div>

              {/* Helpful Reaction Bar */}
              <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>Was this page helpful?</span>
                  <button
                    onClick={() => handleFeedback(activeSection, true)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      feedback[activeSection] === "positive"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleFeedback(activeSection, false)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      feedback[activeSection] === "negative"
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : "border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <Link to="/help-center" className="text-blue-500 hover:underline font-semibold flex items-center gap-1">
                    <span>Help Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Pagination (Previous / Next Guide) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-800">
                {prevNav ? (
                  <button
                    onClick={() => {
                      setActiveSection(prevNav.id);
                      window.scrollTo({ top: 160, behavior: "smooth" });
                    }}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                      darkMode ? "bg-slate-950/60 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4 text-blue-500 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Previous</div>
                      <div className="text-xs sm:text-sm font-bold truncate">{prevNav.name}</div>
                    </div>
                  </button>
                ) : <div></div>}

                {nextNav && (
                  <button
                    onClick={() => {
                      setActiveSection(nextNav.id);
                      window.scrollTo({ top: 160, behavior: "smooth" });
                    }}
                    className={`p-3.5 rounded-xl border text-right flex items-center justify-end gap-3 transition-all cursor-pointer ${
                      darkMode ? "bg-slate-950/60 border-slate-800 hover:border-slate-700" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase">Next</div>
                      <div className="text-xs sm:text-sm font-bold truncate">{nextNav.name}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
                  </button>
                )}
              </div>
            </article>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
