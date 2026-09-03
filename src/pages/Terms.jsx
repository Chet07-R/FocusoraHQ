import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FileText, 
  ShieldCheck, 
  Users, 
  Lock, 
  Scale, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Terms = () => {
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
    showToast("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const sections = [
    {
      id: "acceptance",
      icon: Scale,
      title: "1. Acceptance of Terms",
      content: "By accessing, creating an account on, or using FocusoraHQ ('the Service'), you acknowledge that you have read, understood, and agree to be legally bound by these Terms and Conditions. If you do not agree with any part of these terms, you must discontinue use of the platform immediately."
    },
    {
      id: "license",
      icon: FileText,
      title: "2. Permitted Use & User License",
      content: "FocusoraHQ grants you a revocable, non-exclusive, non-transferable, limited license to access and use the platform strictly for personal, non-commercial study, productivity, and collaboration purposes.",
      rules: [
        "You may not modify, distribute, or reverse-engineer any component of the software.",
        "You may not automate artificial leaderboard points, XP gains, or streak manipulation.",
        "You may not mirror or frame the Service on unauthorized domains."
      ]
    },
    {
      id: "accounts",
      icon: Lock,
      title: "3. User Accounts & Security",
      content: "You are responsible for maintaining the confidentiality of your login credentials (via Google OAuth or authenticated email credentials) and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access."
    },
    {
      id: "rooms",
      icon: Users,
      title: "4. Study Rooms & Code of Conduct",
      content: "Study Rooms are collaborative environments intended for focused work. Users agree to uphold a supportive, respectful atmosphere.",
      rules: [
        "No harassment, hate speech, disruptive spam, or offensive media in room chat or notes.",
        "Respect quiet study periods and shared room settings.",
        "FocusoraHQ reserves the right to remove rooms or ban users violating room etiquette."
      ]
    },
    {
      id: "content",
      icon: BookOpen,
      title: "5. User Content & Intellectual Property",
      content: "You retain full ownership of all study notes, to-do items, and materials you create in FocusoraHQ. By uploading content to collaborative spaces, you grant FocusoraHQ the technical permission required to store, sync, and display that content to your authorized session peers."
    },
    {
      id: "disclaimer",
      icon: ShieldCheck,
      title: "6. Service Reliability & Disclaimers",
      content: "FocusoraHQ is provided on an 'as is' and 'as available' basis. While we strive for 99.9% uptime and robust real-time synchronization, we make no express warranties regarding uninterrupted service, third-party embeds (e.g. Spotify), or suitability for specific exam requirements."
    },
    {
      id: "termination",
      icon: Scale,
      title: "7. Termination & Account Deletion",
      content: "We reserve the right to suspend or terminate accounts that breach these terms or abuse system resources. You may voluntarily delete your account and personal study data at any time directly through your Profile settings."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 transition-colors duration-300`}>
      
      {/* 🚀 Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 text-white py-12 sm:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-4 sm:mb-6">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wide">
              Legal & Compliance • Effective January 2026
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-6 leading-relaxed">
            Please read these terms carefully before using FocusoraHQ's study rooms, timers, and collaborative workspaces.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200/90 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <span>Last Updated: January 15, 2026</span>
          </div>
        </div>
      </section>

      {/* 📄 Main Terms Document */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 sm:-mt-10 relative z-20 pb-16">
        
        {/* Quick Summary Pill Bar */}
        <div className={`rounded-2xl p-4 sm:p-5 border backdrop-blur-md shadow-xl mb-8 flex items-center justify-between flex-wrap gap-3 ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/95 border-slate-200 shadow-md"
        }`}>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
            <Sparkles className="w-4 h-4" />
            <span>Key Takeaway: FocusoraHQ is free, private, and designed for supportive learning.</span>
          </div>
          <Link
            to="/privacy"
            className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
          >
            <span>View Privacy Policy</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6">
          {sections.map((sec) => {
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

                {sec.rules && (
                  <div className={`space-y-2 p-3.5 rounded-xl mt-3 ${
                    darkMode ? "bg-slate-950/60 border border-slate-800/60" : "bg-slate-50 border border-slate-200/60"
                  }`}>
                    {sec.rules.map((rule, rIdx) => (
                      <div key={rIdx} className="flex items-start gap-2 text-xs leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className={darkMode ? "text-slate-300" : "text-slate-700"}>{rule}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 📬 Questions & Contact Box */}
        <div className={`mt-10 rounded-2xl p-6 sm:p-8 border text-center ${
          darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white border-slate-200 shadow-md"
        }`}>
          <h3 className="text-lg font-bold mb-1">Questions About Our Terms?</h3>
          <p className={`text-xs sm:text-sm mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
            Our compliance team is happy to assist with any legal, copyright, or data privacy questions.
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
              Contact Support
            </Link>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-8 text-center flex items-center justify-center gap-4 text-xs font-semibold">
          <Link to="/" className="text-slate-400 hover:text-blue-500 transition-colors">
            ← Back to Home
          </Link>
          <span className="text-slate-600">•</span>
          <Link to="/privacy" className="text-blue-500 hover:underline">
            Privacy Policy →
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

export default Terms;
