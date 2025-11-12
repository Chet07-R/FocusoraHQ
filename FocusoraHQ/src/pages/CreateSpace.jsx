import React from "react";
import { Link } from "react-router-dom";

const CreateSpace = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 min-h-screen flex flex-col transition-colors duration-300">
      {/* Navbar Placeholder */}
      <nav className="navbar"></nav>

      {/* Main Section */}
      <main className="flex flex-col items-center justify-center flex-grow px-4 py-10 relative overflow-hidden pt-20">
        {/* Header */}
        <div className="max-w-xl w-full text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
            Create Your Space
          </h1>
          <p className="text-lg md:text-xl text-blue-800 dark:text-blue-200">
            Customize your private or group study room
          </p>
        </div>

        {/* Create Space Form */}
        <section className="max-w-2xl w-full bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-8">
          <form className="flex flex-col gap-5">
            {/* Space Name */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">
                Space Name
              </label>
              <input
                type="text"
                placeholder="e.g. Math Study Group"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">
                Description
              </label>
              <textarea
                placeholder="Write a short description..."
                rows="2"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Privacy Options */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-4 text-lg">
                Privacy
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Public */}
                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="public"
                    className="hidden peer"
                    defaultChecked
                  />
                  <div className="flex flex-col items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 transition-all">
                    <span className="text-3xl">🌐</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-200">
                      Public
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Anyone can join your space
                    </span>
                  </div>
                </label>

                {/* Private */}
                <label className="group cursor-pointer">
                  <input
                    type="radio"
                    name="privacy"
                    value="private"
                    className="hidden peer"
                  />
                  <div className="flex flex-col items-center gap-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-6 peer-checked:border-blue-600 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/30 transition-all">
                    <span className="text-3xl">🔒</span>
                    <span className="font-semibold text-blue-900 dark:text-blue-200">
                      Private
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Only invited users can join
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-blue-900 dark:text-blue-200 font-semibold mb-2">
                Max Participants
              </label>
              <input
                type="number"
                min="1"
                max="50"
                placeholder="e.g. 10"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <Link
              to="/study-room-1"
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition-transform transform hover:scale-105 items-center flex justify-center"
            >
              ➕ Create Space
            </Link>
          </form>
        </section>
      </main>

      {/* Footer Placeholder */}
      <footer className="footer"></footer>
    </div>
  );
};

export default CreateSpace;
