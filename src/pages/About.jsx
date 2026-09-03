import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Clock, 
  Globe, 
  Star, 
  Target, 
  ShieldCheck, 
  Zap, 
  HeartHandshake, 
  Rocket, 
  Sparkles, 
  ArrowRight,
  Code2,
  Headphones,
  CheckCircle2,
  Trophy,
  Github,
  Linkedin,
  MessageSquare
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const About = () => {
  const { darkMode } = useTheme();

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  const stats = [
    { value: "10K+", label: "Active Learners", icon: Users, color: "text-blue-400" },
    { value: "50K+", label: "Study Hours Logged", icon: Clock, color: "text-emerald-400" },
    { value: "100+", label: "Universities & Regions", icon: Globe, color: "text-purple-400" },
    { value: "4.9/5", label: "Learner Satisfaction", icon: Star, color: "text-amber-400" }
  ];

  const values = [
    {
      icon: Target,
      title: "Flow State First",
      description: "We engineer interfaces that minimize cognitive load. Every feature is designed to protect your attention from digital friction and distractions.",
      gradient: "from-cyan-500 to-blue-600",
      accent: "text-cyan-400"
    },
    {
      icon: HeartHandshake,
      title: "Peer Accountability",
      description: "Studying alongside peers turns solitary effort into collective momentum. Live study pods create a supportive environment to conquer hard subjects.",
      gradient: "from-blue-500 to-indigo-600",
      accent: "text-blue-400"
    },
    {
      icon: Zap,
      title: "Continuous Innovation",
      description: "Our features evolve directly from community feedback. We ship rapid weekly refinements to make your study sessions smoother and more rewarding.",
      gradient: "from-amber-500 to-orange-600",
      accent: "text-amber-400"
    },
    {
      icon: ShieldCheck,
      title: "Privacy & Integrity",
      description: "Your session notes and study data belong entirely to you. We maintain transparent algorithms and enterprise-grade encryption rules.",
      gradient: "from-purple-500 to-pink-600",
      accent: "text-purple-400"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "The Genesis",
      description: "Built as a student project to solve attention fatigue and fragmented study tools with a unified Pomodoro workspace."
    },
    {
      year: "Late 2024",
      title: "Multiplayer Study Rooms",
      description: "Introduced real-time multiplayer spaces with 6-digit Space Codes, live participant presence, and synchronized ambient soundscapes."
    },
    {
      year: "2025",
      title: "Gamified XP & Leaderboard",
      description: "Launched transparent scoring rules, league promotions (Bronze to Diamond), and focus streak tracking."
    },
    {
      year: "Present",
      title: "Global Campus Adoption",
      description: "Over 10,000 students and remote professionals use FocusoraHQ daily across engineering, medical, and exam prep disciplines."
    }
  ];

  const team = [
    {
      name: "Chetan Ajmani",
      role: "Co-Founder & CEO",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      initials: "CA",
      bio: "Product strategist and architecture lead passionate about human-computer interaction and productive workspaces.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Tanish Mehta",
      role: "Co-Founder & CTO",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      initials: "TM",
      bio: "Full-stack engineer focusing on real-time multiplayer signaling, client performance, and distributed systems.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "Vansh Thakur",
      role: "Head of Product",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      initials: "VT",
      bio: "UI/UX designer and community lead dedicated to crafting seamless web interfaces and delightful animations.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const techStack = [
    { name: "React 18 & Vite", desc: "Ultra-fast reactive UI" },
    { name: "TailwindCSS", desc: "Design system & glassmorphism" },
    { name: "Firebase Firestore", desc: "Realtime data listeners" },
    { name: "Socket.io Cluster", desc: "Sub-100ms room synchronization" },
    { name: "Web Audio Engine", desc: "Multi-track ambient soundscapes" },
    { name: "Node.js & Express", desc: "Robust API orchestration" }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 transition-colors duration-300`}>
      
      {/* 🚀 Brand Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 text-white py-14 sm:py-24 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[120px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-4 sm:mb-6">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-blue-200 tracking-wide uppercase">
              About FocusoraHQ • Our Mission & Story
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
            Empowering Deep Focus in a Distracted World
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            We build intelligent, ambient, and collaborative study environments to help learners, engineers, and researchers achieve flow state and mastery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-semibold">
            <Link
              to="/study-room"
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              <span>Explore Study Rooms</span>
            </Link>
            <Link
              to="/community"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white backdrop-blur-sm active:scale-95 transition-all flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Join Community</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 📊 Key Impact Metrics */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;

            return (
              <div
                key={idx}
                className={`rounded-2xl p-4 sm:p-6 border backdrop-blur-xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  darkMode 
                    ? "bg-slate-900/90 border-slate-800" 
                    : "bg-white/95 border-slate-200/80"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}>
                    {stat.label}
                  </span>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="text-xl sm:text-3xl font-extrabold tracking-tight">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* 📖 Origin Story & Vision */}
        <section className="py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 dark:text-blue-400 text-xs font-bold">
                <span>OUR ORIGIN</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Built by Students, Refined for Deep Thinkers
              </h2>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                FocusoraHQ began with a familiar dilemma: trying to study hard concepts amidst endless notifications, complex multi-tab setups, and isolated study sessions.
              </p>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                We asked ourselves: <em>What if entering a deep work session felt as frictionless as opening a browser tab, with ambient lofi music, shared timers, and peer presence built right in?</em>
              </p>
              <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Today, FocusoraHQ has evolved into a comprehensive digital productivity ecosystem, powering study marathons for students across exam prep, university degrees, and remote engineering careers.
              </p>
            </div>

            {/* Timeline Milestones */}
            <div className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 border ${
              darkMode ? "bg-slate-900/80 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-xl"
            }`}>
              <h3 className="text-base sm:text-lg font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Our Journey & Evolution</span>
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-blue-500/20">
                {milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pl-8">
                    <div className="absolute left-1.5 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 shadow"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-500">{m.year}</span>
                        <span className="text-xs font-bold text-slate-400">•</span>
                        <h4 className="text-xs sm:text-sm font-bold">{m.title}</h4>
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                        {m.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 💡 Our Core Values */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Our Guiding Principles</h2>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              The core design philosophy behind every feature we engineer in FocusoraHQ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {values.map((v, idx) => {
              const Icon = v.icon;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-5 sm:p-6 border transition-all duration-300 transform hover:-translate-y-1.5 ${
                    darkMode 
                      ? "bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-md" 
                      : "bg-white border-slate-200 hover:border-blue-200 shadow-lg"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.gradient} text-white flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-2">{v.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 👥 Meet the Builders */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Meet the Builders</h2>
            <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              The dedicated team behind FocusoraHQ's technology, product design, and community
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 border text-center transition-all duration-300 transform hover:-translate-y-1.5 ${
                  darkMode ? "bg-slate-900/90 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-xl"
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/10`}>
                  {member.initials}
                </div>
                <h3 className="text-base sm:text-lg font-bold mb-0.5">{member.name}</h3>
                <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-3">
                  {member.role}
                </p>
                <p className={`text-xs leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ⚙️ Modern Technology Stack */}
        <section className={`rounded-3xl p-6 sm:p-10 mb-16 border ${
          darkMode 
            ? "bg-slate-900/70 border-slate-800" 
            : "bg-slate-100/80 border-slate-200"
        }`}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2 font-bold text-blue-500 text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Technology & Infrastructure</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-6">Built for Speed, Reliability, & Zero Latency</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border text-left ${
                    darkMode ? "bg-slate-950/60 border-slate-800/80" : "bg-white border-slate-200"
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{tech.name}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{tech.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 🌟 Mission CTA Banner */}
        <section className={`rounded-3xl p-8 sm:p-12 mb-16 text-center border relative overflow-hidden ${
          darkMode 
            ? "bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-slate-800" 
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-white border-blue-100 shadow-xl"
        }`}>
          <div className="max-w-2xl mx-auto relative z-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
              Ready to Upgrade Your Study Routine?
            </h3>
            <p className={`text-xs sm:text-sm mb-8 leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
              Join thousands of learners achieving flow state and crushing their goals with FocusoraHQ. Completely free to get started.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/study-room"
                className={`px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all ${
                  darkMode
                    ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm"
                }`}
              >
                <span>Browse Live Rooms</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;