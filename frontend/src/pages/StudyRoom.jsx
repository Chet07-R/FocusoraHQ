import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Users, Sparkles, ArrowRight, ShieldCheck, Zap, Globe2 } from "lucide-react";

const StudyRoom = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-indigo-200 via-blue-100 to-cyan-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 min-h-screen transition-colors duration-300">
      {/* Main Content */}
      <main className="min-h-screen relative overflow-hidden flex flex-col justify-between">
        {/* Background ambient glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 md:w-[32rem] h-72 sm:h-96 md:h-[32rem] bg-gradient-to-tr from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16 relative z-10 max-w-5xl">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-white/10 backdrop-blur-md border border-white/60 dark:border-white/10 text-xs sm:text-sm font-medium text-indigo-900 dark:text-indigo-200 mb-3 sm:mb-4 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Real-Time Virtual Collaboration</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-2.5 sm:mb-4">
              Study Rooms
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed px-2 sm:px-0">
              Join a public room or create your own private focus space. Collaborate,
              compete, and stay productive with learners worldwide!
            </p>
          </div>

          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto mb-10 sm:mb-14">
            {/* Create Space Card */}
            <div
              role="button"
              tabIndex={0}
              aria-label="Create Space"
              onClick={() => navigate("/create-space")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/create-space");
                }
              }}
              className="group cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl sm:rounded-3xl"
            >
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-white/80 dark:border-white/10 shadow-lg sm:shadow-xl hover:shadow-2xl dark:hover:border-indigo-500/50 hover:border-indigo-400/60 transition-all duration-300 h-full flex flex-col justify-between active:scale-[0.99] sm:hover:-translate-y-1">
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div>
                  <div className="flex items-center gap-3.5 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                      <Plus className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Create Space
                      </h2>
                      <span className="text-[11px] sm:text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        Host & Customize
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-5 leading-relaxed">
                    Start a private or group study room with custom timer goals and invite peers.
                  </p>

                  <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                    {[
                      { icon: ShieldCheck, text: "Customize room & privacy settings" },
                      { icon: Users, text: "Invite friends & study buddies" },
                      { icon: Zap, text: "Sync focus goals & Pomodoro timer" },
                    ].map((item, i) => {
                      const ItemIcon = item.icon;
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
                        >
                          <div className="w-4 h-4 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
                            <ItemIcon className="w-2.5 h-2.5" />
                          </div>
                          <span>{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 group-hover:shadow-lg transition-all duration-300">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Join Space Card */}
            <Link
              to="/join-space"
              className="group block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-2xl sm:rounded-3xl"
            >
              <div className="relative overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-white/80 dark:border-white/10 shadow-lg sm:shadow-xl hover:shadow-2xl dark:hover:border-cyan-500/50 hover:border-cyan-400/60 transition-all duration-300 h-full flex flex-col justify-between active:scale-[0.99] sm:hover:-translate-y-1">
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

                <div>
                  <div className="flex items-center gap-3.5 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                      <Globe2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        Join Space
                      </h2>
                      <span className="text-[11px] sm:text-xs font-medium text-cyan-600 dark:text-cyan-400">
                        Explore & Connect
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-4 sm:mb-5 leading-relaxed">
                    Browse and join active study rooms from learners around the world.
                  </p>

                  <ul className="space-y-2 sm:space-y-2.5 mb-5 sm:mb-6">
                    {[
                      { icon: Globe2, text: "Browse active public rooms" },
                      { icon: Users, text: "Connect with global learners" },
                      { icon: Zap, text: "Boost accountability & flow" },
                    ].map((item, i) => {
                      const ItemIcon = item.icon;
                      return (
                        <li
                          key={i}
                          className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium"
                        >
                          <div className="w-4 h-4 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 flex-shrink-0">
                            <ItemIcon className="w-2.5 h-2.5" />
                          </div>
                          <span>{item.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="w-full py-2.5 sm:py-3 px-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 group-hover:shadow-lg transition-all duration-300">
                  <span>Browse Rooms</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Illustration Preview Section */}
          <div className="flex justify-center px-2">
            <div className="relative group max-w-sm sm:max-w-md w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-cyan-500/10 to-teal-500/10 blur-xl rounded-2xl" />
              <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-2 sm:p-3 rounded-2xl shadow-xl border border-white/60 dark:border-white/10 relative transition-all duration-300 hover:shadow-2xl">
                <img
                  src="/images/study_room.png"
                  alt="Study Room Illustration"
                  onError={(e) => {
                    if (!e.target.dataset.triedJpeg) {
                      e.target.dataset.triedJpeg = "true";
                      e.target.src = "/images/study_room.jpeg";
                    }
                  }}
                  className="w-full h-auto max-h-56 sm:max-h-72 object-cover rounded-xl shadow-sm"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudyRoom;

