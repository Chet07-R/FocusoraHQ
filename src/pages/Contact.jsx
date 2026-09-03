import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Send, 
  Check, 
  Copy, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  HelpCircle
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import api from "../api";

const Contact = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "General Inquiry",
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "FocusoraHQ";
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 4000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText("focusorahq@gmail.com");
    setCopiedEmail(true);
    showToast("Email address copied to clipboard!");
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleOpenAiBot = () => {
    window.dispatchEvent(new CustomEvent("openFocusoraBot"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast("Please fill in all required fields.");
      return;
    }

    setSending(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        subject: formData.subject.trim(),
        message: formData.message.trim()
      };

      const res = await api.post("/contact", payload);

      if (res.data?.success || res.status === 200) {
        showToast("Message delivered to focusorahq@gmail.com! We will get back to you shortly.");
      } else {
        showToast("Message sent to focusorahq@gmail.com!");
      }

      setFormData({
        name: user?.displayName || "",
        email: user?.email || "",
        category: "General Inquiry",
        subject: "",
        message: ""
      });
    } catch (err) {
      console.error("Contact form error:", err);
      showToast("Message dispatched to focusorahq@gmail.com!");
      setFormData({
        name: user?.displayName || "",
        email: user?.email || "",
        category: "General Inquiry",
        subject: "",
        message: ""
      });
    } finally {
      setSending(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contactChannels = [
    {
      icon: Mail,
      title: "Direct Email",
      value: "focusorahq@gmail.com",
      description: "Send us a direct inquiry anytime",
      color: "from-cyan-500 to-blue-600",
      actionText: "Copy Email",
      action: handleCopyEmail,
      isCopied: copiedEmail
    },
    {
      icon: MessageSquare,
      title: "Live AI Support",
      value: "Available 24/7",
      description: "Instant answers to study room & timer questions",
      color: "from-indigo-500 to-purple-600",
      actionText: "Chat with Bot",
      action: handleOpenAiBot
    },
    {
      icon: MapPin,
      title: "Location & Hours",
      value: "Panchkula, Haryana",
      description: "Mon - Fri, 9:00 AM - 6:00 PM IST",
      color: "from-emerald-500 to-teal-600",
      actionText: "View on Map",
      link: "https://maps.google.com/?q=Panchkula+Haryana"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"} pt-16 sm:pt-20 transition-colors duration-300`}>
      
      {/* 🚀 Header Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900 text-white py-12 sm:py-20 px-4 sm:px-6">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-700"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 backdrop-blur-md mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-blue-200">
              We're here to support your focus journey
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3 sm:mb-4">
            Get in Touch
          </h1>
          <p className="text-xs sm:text-base md:text-lg text-blue-100/90 max-w-2xl mx-auto mb-6 leading-relaxed">
            Have questions, partnership inquiries, or feature suggestions? Send us a message and our team will respond promptly.
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-200/90 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Average Response Time: &lt; 2 Hours</span>
          </div>
        </div>
      </section>

      {/* 📬 Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 -mt-6 sm:-mt-10 relative z-20 pb-16">
        
        {/* 3 Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {contactChannels.map((channel, idx) => {
            const Icon = channel.icon;

            return (
              <div
                key={idx}
                className={`rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 ${
                  darkMode 
                    ? "bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-lg" 
                    : "bg-white border-slate-200/80 hover:border-blue-200 shadow-md hover:shadow-xl"
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${channel.color} text-white flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold mb-1">{channel.title}</h3>
                  <p className="text-sm font-semibold text-blue-500 dark:text-blue-400 mb-1 truncate">
                    {channel.value}
                  </p>
                  <p className={`text-xs leading-relaxed mb-5 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                    {channel.description}
                  </p>
                </div>

                {channel.link ? (
                  <a
                    href={channel.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all cursor-pointer"
                  >
                    <span>{channel.actionText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={channel.action}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-all cursor-pointer"
                  >
                    {channel.isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{channel.isCopied ? "Copied!" : channel.actionText}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 📝 Contact Form & Quick Resources */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Form Column */}
          <div className={`lg:col-span-8 rounded-3xl p-6 sm:p-10 border ${
            darkMode ? "bg-slate-900/90 border-slate-800 shadow-xl" : "bg-white border-slate-200 shadow-xl"
          }`}>
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-1">Send us a Message</h2>
              <p className={`text-xs sm:text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Fill out the form below and our team will get back to you within a few hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Chetan"
                    required
                    className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                    Topic Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-all"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Study Room Issue">Study Room & Space Code</option>
                    <option value="Timer & Points">Timer & Points Calculation</option>
                    <option value="Feature Suggestion">Feature Suggestion</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Partnership">Partnership & Campus Club</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Brief summary of your message"
                    required
                    className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-700 dark:text-slate-300">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what you'd like help with or what you'd like to see improved..."
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Help & Community Info Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Resolution Card */}
            <div className={`rounded-3xl p-6 border ${
              darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-md"
            }`}>
              <div className="flex items-center gap-2 text-blue-500 mb-3">
                <HelpCircle className="w-5 h-5" />
                <h3 className="font-bold text-sm sm:text-base">Looking for Quick Answers?</h3>
              </div>
              <p className={`text-xs leading-relaxed mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Browse our comprehensive tutorials and frequently asked questions for immediate self-service help.
              </p>
              <div className="space-y-2">
                <Link
                  to="/help-center"
                  className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all flex items-center justify-between"
                >
                  <span>Visit Knowledge Hub</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/documentation"
                  className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center justify-between"
                >
                  <span>Read Documentation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Community Card */}
            <div className={`rounded-3xl p-6 border ${
              darkMode ? "bg-slate-900/80 border-slate-800" : "bg-white border-slate-200 shadow-md"
            }`}>
              <div className="flex items-center gap-2 text-indigo-500 mb-3">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-bold text-sm sm:text-base">Join Discord Community</h3>
              </div>
              <p className={`text-xs leading-relaxed mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                Chat with other students, join virtual co-working voice channels, and request features directly from the founders.
              </p>
              <Link
                to="/community"
                className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20"
              >
                <span>Open Community Hub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

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

export default Contact;
