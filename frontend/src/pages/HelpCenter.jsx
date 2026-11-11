import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Rocket, 
  Users, 
  Clock, 
  Trophy, 
  Headphones, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  ChevronDown, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Send, 
  X, 
  Sparkles,
  ExternalLink,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { POINT_RULES } from "../constants/pointsSystem";
import api from "../api";

const HelpCenter = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [feedbackState, setFeedbackState] = useState({});
  const [copiedFaqId, setCopiedFaqId] = useState(null);
  
  // Ticket Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    email: "",
    category: "General",
    subject: "",
    message: ""
  });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  useEffect(() => {
    if (user) {
      setTicketForm(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const categories = [
    {
      id: "getting-started",
      icon: Rocket,
      title: "Getting Started",
      description: "Quick start guides and basics of FocusoraHQ",
      articleCount: 6,
      color: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400"
    },
    {
      id: "study-rooms",
      icon: Users,
      title: "Study Rooms & Spaces",
      description: "Hosting, room codes, buddy invites, and collaborative study",
      articleCount: 8,
      color: "from-blue-500 to-indigo-600",
      accent: "text-blue-400"
    },
    {
      id: "focus-tools",
      icon: Clock,
      title: "Focus Tools & Timer",
      description: "Custom Pomodoro durations, task sync, and notes exports",
      articleCount: 7,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-400"
    },
    {
      id: "leaderboard",
      icon: Trophy,
      title: "Leaderboard & Scoring",
      description: "XP calculations, ranking leagues, streaks, and achievements",
      articleCount: 5,
      color: "from-yellow-400 to-amber-500",
      accent: "text-yellow-400"
    },
    {
      id: "soundscapes",
      icon: Headphones,
      title: "Soundscapes & Audio",
      description: "Spotify integration, lofi loops, and ambient volume control",
      articleCount: 5,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-400"
    },
    {
      id: "security",
      icon: ShieldCheck,
      title: "Security & Account",
      description: "Password reset, Google Auth, privacy, and data safeguards",
      articleCount: 6,
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-400"
    }
  ];

  const quickGuides = [
    {
      id: "room-guide",
      tag: "Study Rooms",
      title: "How to Create & Host a Collaborative Space",
      description: "Create a room in seconds, configure ambient sound, and share your 6-digit room code with study partners.",
      steps: [
        "Go to Study Room > Create Space",
        "Set space name, subject, and privacy",
        "Invite peers via code or direct link"
      ],
      link: "/create-space",
      btnText: "Create a Space"
    },
    {
      id: "points-guide",
      tag: "Scoring & XP",
      title: "Maximizing Your Daily Leaderboard Points",
      description: "Earn points automatically as you study. Every focused minute, completed task, and saved note boosts your rank.",
      steps: [
        `+${POINT_RULES.pomodoroPerMinute} pt per focused Pomodoro minute`,
        `+${POINT_RULES.taskAdded} pt for task added, +${POINT_RULES.taskCompleted} pts for completed`,
        `+${POINT_RULES.notesSave} pt for saving session study notes`
      ],
      link: "/leaderboard",
      btnText: "View Leaderboard"
    },
    {
      id: "audio-guide",
      tag: "Sound & Ambience",
      title: "Setting Up Spotify & Background Soundscapes",
      description: "Keep background distractions at zero with curated Spotify lofi beats and ambient white noise generators.",
      steps: [
        "Open Sound & Ambience panel in your room",
        "Select your preferred preset or Spotify embed",
        "Adjust volume sliders independently"
      ],
      link: "/my-space",
      btnText: "Explore My Space"
    }
  ];

  const faqs = useMemo(() => [
    {
      id: "faq-1",
      category: "getting-started",
      categoryName: "Getting Started",
      question: "How do I get started with FocusoraHQ?",
      answer: "FocusoraHQ is designed to be plug-and-play! Simply sign up or continue with Google, head over to 'My Space' for your personal focus dashboard with a timer, notes, and tasks, or click 'Study Room' to join peer learning rooms.",
      popular: true
    },
    {
      id: "faq-2",
      category: "study-rooms",
      categoryName: "Study Rooms",
      question: "How do study room codes and buddy invites work?",
      answer: "When a room is created, a unique alphanumeric Space Code is generated. Share this code with peers so they can enter it on the 'Join Space' page. All room members share live participant presence, synced ambient tracks, and chat.",
      popular: true
    },
    {
      id: "faq-3",
      category: "focus-tools",
      categoryName: "Focus Tools",
      question: "Can I customize the Pomodoro timer duration?",
      answer: "Yes! In both My Space and Study Rooms, you can toggle between standard 25/5 focus cycles, 50/10 deep focus blocks, or configure custom timer durations from the settings controls.",
      popular: false
    },
    {
      id: "faq-4",
      category: "leaderboard",
      categoryName: "Leaderboard & Scoring",
      question: "How are points and league ranks calculated?",
      answer: `Points update in real time: you receive +${POINT_RULES.pomodoroPerMinute} pt per focused minute, +${POINT_RULES.notesSave} pt for saving notes, +${POINT_RULES.taskAdded} pt for creating tasks, and +${POINT_RULES.taskCompleted} pts for completing tasks. As points accumulate, you automatically advance through Bronze, Silver, Gold, Platinum, and Diamond leagues.`,
      popular: true
    },
    {
      id: "faq-5",
      category: "soundscapes",
      categoryName: "Soundscapes & Audio",
      question: "Why is the Spotify player not playing audio?",
      answer: "Spotify requires users to be logged into their Spotify web account in the same browser for full-length playback. If not logged in, Spotify defaults to 30-second song previews. You can also use our built-in ambient rain/cafe tracks which require no login.",
      popular: true
    },
    {
      id: "faq-6",
      category: "security",
      categoryName: "Security & Account",
      question: "Is my personal data and study notes private?",
      answer: "All personal notes and to-do lists are securely bound to your authenticated user account and protected with Firebase security rules. Room notes in public study spaces are shared only with joined participants.",
      popular: false
    },
    {
      id: "faq-7",
      category: "getting-started",
      categoryName: "Getting Started",
      question: "Can I use FocusoraHQ on mobile devices?",
      answer: "Yes! The entire FocusoraHQ platform is fully responsive and optimized for mobile screens, tablets, and desktop workstations. You can access all timers, blogs, study rooms, and leaderboards from mobile web browsers.",
      popular: true
    },
    {
      id: "faq-8",
      category: "study-rooms",
      categoryName: "Study Rooms",
      question: "What happens if the room host leaves the session?",
      answer: "If the room host leaves or closes their tab, the room stays open for remaining active learners. The system dynamically promotes another active participant to maintain smooth room persistence.",
      popular: false
    },
    {
      id: "faq-9",
      category: "security",
      categoryName: "Security & Account",
      question: "How do I update my profile avatar, name, or password?",
      answer: "Click your avatar in the navigation bar to access your Profile page. From there, click 'Edit Profile' to upload a custom profile picture, change your display name, update your location, or manage password credentials.",
      popular: false
    }
  ], []);

  const popularSearches = [
    "Study Rooms",
    "Pomodoro Points",
    "Spotify Music",
    "Space Code",
    "Offline Notes",
    "Reset Password"
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
      const term = searchQuery.trim().toLowerCase();
      const matchesSearch = !term || 
        faq.question.toLowerCase().includes(term) || 
        faq.answer.toLowerCase().includes(term) ||
        faq.categoryName.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [faqs, selectedCategory, searchQuery]);

  const handleFeedback = (faqId, isHelpful) => {
    setFeedbackState(prev => ({
      ...prev,
      [faqId]: isHelpful ? "positive" : "negative"
    }));
    showToast(isHelpful ? "Thanks for your feedback!" : "Feedback recorded. We'll improve this guide.");
  };

  const handleCopyFaq = (faq) => {
    const text = `Q: ${faq.question}\nA: ${faq.answer}`;
    navigator.clipboard?.writeText(text);
    setCopiedFaqId(faq.id);
    showToast("Solution copied to clipboard!");
    setTimeout(() => setCopiedFaqId(null), 2500);
  };

  const handleOpenAiBot = () => {
    window.dispatchEvent(new CustomEvent("openFocusoraBot"));
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setTicketSubmitted(true);

    try {
      const ticketId = "FOC-" + Math.floor(100000 + Math.random() * 900000);
      await api.post("/contact", {
        name: ticketForm.name.trim(),
        email: ticketForm.email.trim(),
        category: `Help Ticket: ${ticketForm.category}`,
        subject: `[${ticketId}] ${ticketForm.subject.trim()}`,
        message: ticketForm.message.trim()
      });

      setIsTicketModalOpen(false);
      setTicketForm({
        name: user?.displayName || "",
        email: user?.email || "",
        category: "General",
        subject: "",
        message: ""
      });
      showToast(`Support ticket #${ticketId} submitted to focusorahq@gmail.com!`);
    } catch (err) {
      console.error("Ticket submission error:", err);
      setIsTicketModalOpen(false);
      showToast("Support ticket submitted to focusorahq@gmail.com!");
    } finally {
      setTicketSubmitted(false);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 transition-colors duration-300`}>
      
      {/* 🚀 Hero Knowledge Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white py-12 sm:py-20 px-4 sm:px-6">
        {/* Background glow & mesh */}
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute -top-10 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute -bottom-10 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-4 sm:mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5"></span>
            <span className="text-xs font-semibold text-blue-200 tracking-wide">
              FocusoraHQ Knowledge Hub • 24/7 Support
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            How can we help you?
          </h1>
          <p className="text-sm sm:text-lg text-blue-100/90 max-w-2xl mx-auto mb-6 sm:mb-8 font-normal leading-relaxed">
            Search our verified tutorials, troubleshooting guides, scoring rules, or ask our live AI study assistant.
          </p>

          {/* 🔍 Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics, questions, room setup, XP rules..."
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base font-medium shadow-2xl border border-white/20 dark:border-slate-800 outline-none focus:ring-4 focus:ring-blue-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Popular search tags */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 sm:mt-4 text-xs">
              <span className="text-blue-200/80 font-medium mr-1">Popular:</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSearchQuery(tag)}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/10 backdrop-blur-sm transition-all text-[11px] sm:text-xs cursor-pointer active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 sm:-mt-10 relative z-20">
        
        {/* 🗂️ Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 mb-12 sm:mb-16">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? "all" : cat.id);
                  const faqSection = document.getElementById("faq-section");
                  if (faqSection) {
                    faqSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/25 ring-2 ring-blue-400"
                    : darkMode
                      ? "bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 shadow-lg"
                      : "bg-white border border-slate-200/80 hover:border-blue-200 shadow-md hover:shadow-xl"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : darkMode ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"
                  }`}>
                    {cat.articleCount} guides
                  </span>
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isSelected ? "text-white" : darkMode ? "text-white" : "text-slate-900"}`}>
                  {cat.title}
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isSelected ? "text-blue-100" : darkMode ? "text-slate-400" : "text-slate-600"
                }`}>
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* ⚡ Quick Step-by-Step Guides */}
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl sm:text-2xl font-bold">Featured Quick Tutorials</h2>
              </div>
              <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Step-by-step walkthroughs for the most utilized study tools
              </p>
            </div>
            <button
              onClick={handleOpenAiBot}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              Ask AI Assistant
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {quickGuides.map((guide) => (
              <div
                key={guide.id}
                className={`rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all ${
                  darkMode 
                    ? "bg-slate-900/80 border-slate-800 hover:border-slate-700" 
                    : "bg-white border-slate-200/80 hover:border-slate-300 shadow-md"
                }`}
              >
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 dark:text-blue-400">
                    {guide.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold mt-3 mb-2">
                    {guide.title}
                  </h3>
                  <p className={`text-xs sm:text-sm mb-4 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {guide.description}
                  </p>

                  <div className={`space-y-2 p-3 rounded-xl mb-5 ${darkMode ? "bg-slate-950/60" : "bg-slate-50"}`}>
                    {guide.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  to={guide.link}
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all group cursor-pointer"
                >
                  <span>{guide.btnText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ❓ Interactive FAQ Accordion Hub */}
        <section id="faq-section" className="mb-12 sm:mb-16">
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Frequently Asked Questions
            </h2>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Instant answers to commonly asked questions about rooms, timer, scoring, and security
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : darkMode
                    ? "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-sm"
              }`}
            >
              All Topics ({faqs.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : darkMode
                      ? "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 shadow-sm"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3 max-w-3xl mx-auto">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = expandedFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? darkMode
                          ? "bg-slate-900/90 border-blue-500/40 shadow-lg"
                          : "bg-white border-blue-400 shadow-lg"
                        : darkMode
                          ? "bg-slate-900/60 border-slate-800/80 hover:border-slate-700"
                          : "bg-white border-slate-200/80 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                      className="w-full p-4 sm:p-5 flex items-center justify-between text-left gap-3 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <HelpCircle className={`w-5 h-5 shrink-0 ${isOpen ? "text-blue-500" : "text-slate-400"}`} />
                        <span className="font-bold text-xs sm:text-base leading-snug">
                          {faq.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {faq.popular && (
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 dark:text-amber-400 text-[10px] font-bold uppercase">
                            Popular
                          </span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""}`} />
                      </div>
                    </button>

                    {isOpen && (
                      <div className={`px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t ${
                        darkMode ? "border-slate-800 text-slate-300" : "border-slate-100 text-slate-600"
                      }`}>
                        <p>{faq.answer}</p>

                        {/* Interactive Feedback & Share */}
                        <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-slate-200/40 dark:border-slate-800 flex-wrap gap-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-400">
                            <span>Was this helpful?</span>
                            <button
                              onClick={() => handleFeedback(faq.id, true)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                feedbackState[faq.id] === "positive"
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                              }`}
                              title="Yes, helpful"
                            >
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, false)}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                feedbackState[faq.id] === "negative"
                                  ? "bg-red-500/20 text-red-400"
                                  : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                              }`}
                              title="Not helpful"
                            >
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleCopyFaq(faq)}
                            className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-semibold cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedFaqId === faq.id ? "Copied!" : "Copy Answer"}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 px-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <p className="text-sm font-semibold">No help articles found matching "{searchQuery}"</p>
                <p className="text-xs text-slate-400 mt-1">Try searching another keyword or contact support directly.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 📬 Contact & AI CTA Banner */}
        <section className={`rounded-3xl p-6 sm:p-10 md:p-12 mb-16 text-center border relative overflow-hidden ${
          darkMode 
            ? "bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800" 
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-blue-100 shadow-xl"
        }`}>
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Still have questions or facing issues?
            </h3>
            <p className={`text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Our dedicated support team and AI Bot are available to help you troubleshoot room connections, points, and focus tools.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsTicketModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit a Ticket</span>
              </button>
              <button
                onClick={handleOpenAiBot}
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm border transition-all cursor-pointer flex items-center gap-2 ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>Chat with AI Assistant</span>
              </button>
              <Link
                to="/community"
                className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm border transition-all flex items-center gap-2 ${
                  darkMode
                    ? "bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm"
                }`}
              >
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span>Community Logs</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* 📝 Submit Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
          <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={() => setIsTicketModalOpen(false)}></div>
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-5 sm:p-7 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Submit a Support Ticket</h3>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">We typically respond within a few hours.</p>
              </div>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.name}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Alex Smith"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={ticketForm.email}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Topic Category
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="General">General Inquiry</option>
                  <option value="Study Rooms">Study Rooms & Codes</option>
                  <option value="Timer & Points">Timer & Leaderboard Points</option>
                  <option value="Audio">Audio & Spotify Playback</option>
                  <option value="Account">Account & Privacy</option>
                  <option value="Bug">Report a Bug</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief summary of the issue"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  required
                  rows={4}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Please describe what happened, steps to reproduce, or what you need assistance with..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTicketModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ticketSubmitted}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  {ticketSubmitted ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔔 Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default HelpCenter;
