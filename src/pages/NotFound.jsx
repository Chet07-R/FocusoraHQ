import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-8 text-center transition-colors duration-300">
      <div className="max-w-[500px] p-8 rounded-2xl bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-xl">
        <h1 className="text-7xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
