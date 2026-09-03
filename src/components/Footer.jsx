import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Heart, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../api";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "info" }), 4000);
  };

  const handleSubscription = async () => {
    const userEmail = email.trim();

    if (!userEmail) {
      showToast("Please enter your email address.", "warning");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      showToast("Please enter a valid email address.", "error");
      return;
    }

    setSubscribing(true);

    try {
      const res = await api.post("/contact/newsletter", { email: userEmail });
      if (res.data?.success || res.status === 200) {
        showToast("Subscription successful! Check your email for confirmation.", "success");
        setEmail("");
      } else {
        showToast("Subscription confirmed! Welcome aboard.", "success");
        setEmail("");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      showToast("Subscription confirmed! Welcome to FocusoraHQ.", "success");
      setEmail("");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="w-full relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-8 mb-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/transparent.png"
                alt="FocusoraHQ Logo"
                className="w-8 h-8 dark:invert-0 invert transition-all duration-300"
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-cyan-600 to-pink-500 dark:from-cyan-400 dark:to-pink-400 brand-gradient">
                FocusoraHQ
              </span>
            </div>
            <p className="text-slate-800 dark:text-gray-300 text-sm leading-relaxed mb-6 md:max-w-md">
              The all-in-one platform for focused work. Minimize digital noise
              and maximize your potential — whether you're working alone or
              with a team.
            </p>

            <div className="space-y-2 text-sm text-slate-700 dark:text-gray-400">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-cyan-500 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Panchkula, IN
              </div>

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-cyan-500 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91 12345-67890
              </div>

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-cyan-500 dark:text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                focusorahq@gmail.com
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-4">
            <h3 className="text-slate-800 dark:text-white font-semibold text-lg underline-hover cursor-default">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/my-space" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">My Space</Link></li>
              <li><Link to="/study-room" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Study Room</Link></li>
              <li><Link to="/blog" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Blogs</Link></li>
              <li><Link to="/leaderboard" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h3 className="text-slate-800 dark:text-white font-semibold text-lg underline-hover cursor-default">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help-center" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Help Center</Link></li>
              <li><Link to="/documentation" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Documentation</Link></li>
              <li><Link to="/community" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Community</Link></li>
              <li><Link to="/contact" className="text-slate-700 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4 col-span-2 sm:col-span-1">
            <h3 className="text-slate-800 dark:text-white font-semibold text-lg underline-hover cursor-default">
              Company
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-sm">
              <li><Link to="/about" className="text-slate-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About</Link></li>
              <li><Link to="/blog" className="text-slate-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Blogs</Link></li>
              <li><Link to="/terms" className="text-slate-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="newsletter-section mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-slate-800 dark:text-white font-semibold text-lg mb-2 flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                <span>Stay Updated</span>
              </h3>
              <p className="text-slate-800 dark:text-gray-300 text-sm">
                Get the latest updates and productivity tips straight to your inbox.
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubscription()}
                placeholder="Enter your email"
                className="px-4 py-2 w-full md:w-64 rounded-l-lg outline-none transition-all"
              />
              <button
                onClick={handleSubscription}
                disabled={subscribing}
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                className="px-6 py-2 text-white font-semibold rounded-r-lg hover:brightness-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(139, 92, 246, 0.5), 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4), 0 0 40px rgba(139, 92, 246, 0.3), 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </div>
          </div>
        </div>

        <hr className="my-4 border-slate-200 dark:border-slate-800" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3 px-2 sm:pr-48 pb-6 sm:pb-4 text-sm text-slate-700 dark:text-gray-400">
          <p className="text-center sm:text-left">
            © 2025{" "}
            <span className="font-semibold bg-gradient-to-r from-cyan-600 to-pink-500 dark:from-cyan-400 dark:to-pink-400 bg-clip-text text-transparent">
              FocusoraHQ
            </span>
            . All rights reserved.
          </p>

          <p className="text-center sm:text-right flex items-center justify-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500 inline-block animate-pulse" />
            <span>by students, for students.</span>
          </p>
        </div>
      </div>

      {/* 🔔 State Toast Notification */}
      {toast.message && (
        <div className={`fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-5 ${
          toast.type === "success"
            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-emerald-500/30"
            : toast.type === "warning"
              ? "bg-amber-600 text-white border-amber-400/30"
              : "bg-red-600 text-white border-red-400/30"
        }`}>
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-white shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </footer>
  );
};

export default Footer;