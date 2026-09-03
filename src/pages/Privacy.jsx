import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  UserCheck, 
  Mail, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Privacy = () => {
  const { darkMode } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText("focusorahq@gmail.com");
    setCopiedEmail(true);
    showToast("Privacy email copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const privacySections = [
    {
      id: "collection",
      icon: Database,
      title: "1. Information We Collect",
      content: "FocusoraHQ collects minimal, essential data strictly to provide personalized study experiences and multiplayer room synchronization:",
      items: [
        "Account Profile: Display name, email address, and avatar choices provided during authentication.",
        "Study Session Metrics: Pomodoro focus minutes, completed tasks, note drafts, and leaderboard XP.",
        "Technical Diagnostics: Device type, browser preference, and error logs for platform optimization."
      ]
    },
    {
      id: "usage",
      icon: Eye,
      title: "2. How We Use Your Data",
      content: "Your data is used solely to empower your personal focus tools:",
      items: [
        "Powering real-time presence indicators in shared study rooms.",
        "Calculating leaderboard XP and maintaining daily study streaks.",
        "Syncing notes and to-dos securely across your authenticated devices."
      ]
    },
    {
      id: "security",
      icon: Lock,
      title: "3. Enterprise-Grade Security",
      content: "We enforce HTTPS/TLS 1.3 transit encryption, Firebase Security Rules, and authenticated token authorization. We NEVER sell, rent, or monetize your study data to data brokers or advertising networks."
    },
    {
      id: "third-party",
      icon: ShieldCheck,
      title: "4. Third-Party Integrations",
      content: "FocusoraHQ integrates with trusted providers for select features:",
      items: [
        "Google OAuth & Firebase Auth: Secure identity verification.",
        "Spotify Web API: In-room focus music and lofi playback.",
        "MongoDB Atlas: High-availability session persistence."
      ]
    },
    {
      id: "cookies",
      icon: Cookie,
      title: "5. Cookies & Local Storage",
      content: "We utilize local storage and essential cookies strictly to remember your active theme (Dark/Light mode), ambient sound volume preferences, and authentication session tokens."
    },
    {
      id: "rights",
      icon: UserCheck,
      title: "6. Your Privacy Rights & Deletion",
      content: "You maintain complete ownership of your data. You may download your notes, update your profile details, or permanently delete your account at any time through your Profile settings."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 transition-colors duration-300`}>
      
      {/* 🚀 Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 text-white py-12 sm:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-4 sm:mb-6">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
              Privacy First • User Data Safeguards
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-6 leading-relaxed">
            How FocusoraHQ respects, secures, and handles your personal study data.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200/90 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <span>Last Updated: January 15, 2026</span>
          </div>
        </div>
      </section>

      {/* 📄 Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 sm:-mt-10 relative z-20 pb-16">
        
        {/* Quick Summary Pill Bar */}
        <div className={`rounded-2xl p-4 sm:p-5 border backdrop-blur-md shadow-xl mb-8 flex items-center justify-between flex-wrap gap-3 ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-200 shadow-md"
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
            <Sparkles className="w-4 h-4" />
            <span>Zero Ad-Tracking • No Third-Party Selling • Encrypted Data</span>
          </div>
          <Link
            to="/terms"
            className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
          >
            <span>View Terms of Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6">
          {privacySections.map((sec) => {
            const Icon = sec.icon;

            return (
              <div
                key={sec.id}
                className={`rounded-2xl p-6 sm:p-8 border transition-all ${
                  darkMode 
                    ? "bg-slate-900/80 border-slate-800 shadow-md" 
                    : "bg-white border-slate-200/80 shadow-md"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold">
                    {sec.title}
                  </h2>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed mb-3 ${
                  darkMode ? "text-slate-300" : "text-slate-700"
                }`}>
                  {sec.content}
                </p>

                {sec.items && (
                  <div className={`space-y-2 p-3.5 rounded-xl mt-3 ${
                    darkMode ? "bg-slate-950/60 border border-slate-800/60" : "bg-slate-50 border border-slate-200/60"
                  }`}>
                    {sec.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 📬 Privacy Contact */}
        <div className={`mt-10 rounded-2xl p-6 sm:p-8 border text-center ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-md"
        }`}>
          <h3 className="text-lg font-bold mb-1">Contact Our Privacy Team</h3>
          <p className={`text-xs sm:text-sm mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Have questions about your data, cookies, or account deletion? Reach out to us.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopyEmail}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedEmail ? "Copied!" : "focusorahq@gmail.com"}</span>
            </button>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Send Inquiry
            </Link>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center flex items-center justify-center gap-4 text-xs font-semibold">
          <Link to="/" className="text-slate-400 hover:text-blue-500 transition-colors">
            ← Back to Home
          </Link>
          <span className="text-slate-600">•</span>
          <Link to="/terms" className="text-blue-500 hover:underline">
            Terms of Service →
          </Link>
        </div>
      </div>

      {/* 🔔 Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Privacy;
