// Community.jsx
import React from "react";

const Community = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="navbar"></nav>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center flex-grow text-center px-3">
        <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 mt-18">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            Join Our Community 🎯
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Connect with other Focusora users, share productivity tips, discuss
            features, and be part of the growing community on Discord.
          </p>

          {/* Discord Redirect Button */}
          <a
            href="https://discord.gg/YOUR_INVITE_LINK"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-full shadow transition">
              Join our Discord Server
            </button>
          </a>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            You’ll be redirected to our official Discord server.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer"></footer>
    </div>
  );
};

export default Community;
