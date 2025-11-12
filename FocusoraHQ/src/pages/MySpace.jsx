import React from 'react';

const MySpace = () => {
  // Quick approach: embed existing static page in an iframe so current functionality remains.
  // This keeps the router-based navigation while reusing the authored HTML page.
  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Space</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">If your original My Space page requires the full static HTML, it will be shown below.</p>

        <div className="w-full h-[80vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <iframe title="My Space" src="/pages/my_space.html" className="w-full h-full border-0" />
        </div>
      </div>
    </div>
  );
};

export default MySpace;
