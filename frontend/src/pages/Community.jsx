import React, { useState, useEffect } from "react";
import { MessageSquare, ExternalLink, Copy, Check, Users, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Community = () => {
  const { darkMode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const discordInviteUrl = "https://discord.gg/7gDaE6kfs";

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(discordInviteUrl);
    setCopied(true);
    setToastMessage("Invite link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
      setToastMessage("");
    }, 2500);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 flex items-center justify-center p-4 pt-20 sm:pt-24 relative overflow-hidden`}>
      
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-300">
        <div className={`rounded-3xl p-6 sm:p-10 text-center border backdrop-blur-xl shadow-2xl transition-all ${
          darkMode 
            ? "bg-gray-800/90 border-gray-700/80 text-white shadow-black/40" 
            : "bg-white/95 border-white/80 text-gray-900 shadow-indigo-500/10"
        }`}>
          
          {/* Discord Icon Badge */}
          <div className="relative inline-block mb-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-[#5865F2] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#5865F2]/30 transform hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 sm:w-11 sm:h-11 fill-current" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
              </svg>
            </div>
            {/* Pulsing online badge */}
            <span className="absolute bottom-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-gray-800"></span>
            </span>
          </div>

          {/* Header Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">
            Join Our Community
          </h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-xs font-semibold mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>24/7 Live Study Lounges</span>
          </div>

          <p className={`text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8 max-w-sm mx-auto ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            Connect with other Focusora users, share productivity tips, join live co-working sessions, and be part of our growing global family on Discord.
          </p>

          {/* Primary Action Button */}
          <div className="space-y-3">
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-sm shadow-xl shadow-[#5865F2]/25 hover:shadow-2xl hover:shadow-[#5865F2]/40 active:scale-[0.98] transform transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Join our Discord Server</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={handleCopyLink}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                darkMode
                  ? "border-gray-700 hover:bg-gray-700/60 text-gray-300 hover:text-white"
                  : "border-gray-200 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-bold">Invite Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-400" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-5 text-[11px] sm:text-xs text-gray-400 dark:text-gray-500">
            You'll be redirected to our official Discord server.
          </p>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Community;
