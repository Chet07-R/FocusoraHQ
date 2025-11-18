import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../context/ThemeContext';

const Terms = () => {
  const { darkMode } = useTheme();
  
  return (
    <>
      <Navbar />
      <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-indigo-300 to-cyan-100'}`}>
        <div className="py-20 px-4">
        <div className={`max-w-4xl mx-auto backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-2 ${darkMode ? 'bg-slate-800/80 border-purple-500/30' : 'bg-white/90 border-purple-400/40'}`}>
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent' : 'text-gray-800'}`}>
              Terms & Conditions
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Last updated: November 15, 2025
            </p>
          </div>

          {/* Content */}
          <div className={`space-y-6 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>1. Acceptance of Terms</h2>
              <p className="leading-relaxed">
                By accessing and using FocusoraHQ ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>2. Use License</h2>
              <p className="leading-relaxed mb-3">
                Permission is granted to temporarily use FocusoraHQ for personal, non-commercial study and productivity purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>3. User Accounts</h2>
              <p className="leading-relaxed">
                When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms. You are responsible for safeguarding your password and for all activities under your account.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>4. Privacy & Data</h2>
              <p className="leading-relaxed">
                We collect and use your personal information in accordance with our Privacy Policy. By using FocusoraHQ, you consent to such processing and you warrant that all data provided by you is accurate. We use Firebase Authentication to securely manage user accounts.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>5. Content & Study Materials</h2>
              <p className="leading-relaxed">
                You retain all rights to any content you submit, post, or display on or through the Service. By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, and display such content for the purpose of providing the Service.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>6. Community Guidelines</h2>
              <p className="leading-relaxed mb-3">
                When using FocusoraHQ's community features, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Be respectful and supportive of other users</li>
                <li>Not post offensive, harmful, or inappropriate content</li>
                <li>Not spam or harass other members</li>
                <li>Respect intellectual property rights</li>
                <li>Not share or distribute copyrighted materials without permission</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>7. Study Rooms & Collaboration</h2>
              <p className="leading-relaxed">
                Study rooms and collaborative features are provided to enhance your learning experience. We are not responsible for the conduct of other users in shared spaces. Report any violations to our support team.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>8. Disclaimer</h2>
              <p className="leading-relaxed">
                The materials on FocusoraHQ are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>9. Limitations</h2>
              <p className="leading-relaxed">
                In no event shall FocusoraHQ or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>10. Termination</h2>
              <p className="leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>11. Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>12. Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us at support@focusorahq.com
              </p>
            </section>
          </div>

          {/* Back Button */}
          <div className="mt-10 text-center">
            <Link
              to="/signup"
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
            >
              Back to Sign Up
            </Link>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Terms;
