import React, { useEffect, useState } from "react";
import emailjs from '@emailjs/browser';
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");

  // Initialize EmailJS on component mount
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
      console.log("📩 EmailJS initialized successfully.");
    } else {
      console.error("❌ EmailJS public key not found in environment variables");
    }
  }, []);

  // Toast notification function
  const showToast = (message, type = "info") => {
    const colors = {
      success: "bg-green-600 text-white",
      error: "bg-red-600 text-white",
      warning: "bg-yellow-500 text-black",
      info: "bg-gray-700 text-white"
    };

    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg z-50 transition-all duration-500 transform opacity-0 translate-y-2 ${colors[type]} font-medium`;

    document.body.appendChild(toast);

    // Animate toast appearance
    setTimeout(() => toast.classList.remove("opacity-0", "translate-y-2"), 100);

    // Remove toast after 3.5 seconds
    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 500);
    }, 3500);
  };

  const handleSubscription = () => {
    const userEmail = email.trim();

    // Validate user input
    if (!userEmail) {
      showToast("⚠️ Please enter your email address.", "warning");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
      showToast("⚠️ Please enter a valid email address.", "warning");
      return;
    }

    const params = { user_email: userEmail };

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      console.error("❌ EmailJS service or template ID not found");
      showToast("❌ Email service configuration error.", "error");
      return;
    }

    // Send email using EmailJS
    emailjs.send(serviceId, templateId, params)
      .then(() => {
        showToast("✅ Subscription successful! Check your email.", "success");
        setEmail(""); // Clear input after success
      })
      .catch((error) => {
        console.error("❌ EmailJS Error:", error);
        showToast("❌ Failed to send email. Please try again later.", "error");
      });
  };

  return (
    <footer className="bg-gradient-to-b from-black via-gray-900 to-gray-950 w-full relative overflow-hidden text-gray-300">
      {/* Subtle background glow */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-10 mb-8 justify-items-start">
          {/* Brand Section */}
          <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/images/transparent.png"
                alt="FocusoraHQ Logo"
                className="w-8 h-8"
              />
              <span className="font-bold text-2xl bg-gradient-to-r from-cyan-400 to-pink-400 brand-gradient">
                FocusoraHQ
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 md:max-w-md">
              The all-in-one platform for focused work. Minimize digital noise
              and maximize your potential — whether you're working alone or
              with a team.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-3 text-cyan-400"
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
                  className="w-4 h-4 mr-3 text-cyan-400"
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
                  className="w-4 h-4 mr-3 text-cyan-400"
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

          {/* Navigation Columns */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg underline-hover cursor-default">
              Product
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/my_space" className="text-gray-300 hover:text-cyan-400 transition-colors">My Space</a></li>
              <li><a href="/study_room" className="text-gray-300 hover:text-cyan-400 transition-colors">Study Room</a></li>
              <li><a href="/Blog" className="text-gray-300 hover:text-cyan-400 transition-colors">Blogs</a></li>
              <li><a href="/leaderboard" className="text-gray-300 hover:text-cyan-400 transition-colors">Leaderboard</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg underline-hover cursor-default">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">About</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-purple-500 transition-colors">Blogs</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-purple-500 transition-colors">Press</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg underline-hover cursor-default">
              Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Documentation</a></li>
              <li><a href="/community" className="text-gray-300 hover:text-cyan-400 transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-semibold text-lg underline-hover cursor-default">
              Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms" className="text-gray-300 hover:text-purple-500 transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-purple-500 transition-colors">Terms of Service</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-purple-500 transition-colors">Cookie Policy</a></li>
              <li><a href="/terms" className="text-gray-300 hover:text-purple-500 transition-colors">Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                <span className="text-2xl">📬</span> Stay Updated
              </h3>
              <p className="text-gray-300 text-sm">
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
                className="px-4 py-2 w-full md:w-64 rounded-l-lg bg-gray-700/50 text-white placeholder-gray-400 border border-gray-600/50 outline-none focus:border-cyan-500 focus:bg-gray-700 transition-all"
              />
              <button
                onClick={handleSubscription}
                className="px-6 py-2 subscribe-btn rounded-r-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:shadow-lg hover:shadow-cyan-400/50"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <hr className="m-2 border-gray-700/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between p-2">
          <p className="text-gray-300 text-sm text-center sm:text-left">
            © 2025{" "}
            <span className="font-semibold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              FocusoraHQ
            </span>
            <br />
            Made with <span className="text-pink-500 animate-pulse">❤️</span> by students.
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
