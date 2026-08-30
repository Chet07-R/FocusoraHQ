import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Privacy = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen pt-16 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-indigo-300 to-cyan-100'}`}>
      <div className="py-20 px-4">
        <div className={`max-w-4xl mx-auto backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border-2 ${darkMode ? 'bg-slate-800/80 border-purple-500/30' : 'bg-white/90 border-purple-400/40'}`}>
          <div className="text-center mb-8">
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 ${darkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent' : 'text-gray-800'}`}>
              Privacy Policy
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Last updated: November 15, 2025
            </p>
          </div>

          <div className={`space-y-6 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>1. Information We Collect</h2>
              <p className="leading-relaxed mb-3">
                FocusoraHQ collects information to provide a personalized, distraction-free study experience:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Name, email address, profile avatar, and study preferences when you sign up.</li>
                <li><strong>Usage & Study Data:</strong> Pomodoro session durations, study room activity, notes, to-dos, and leaderboard points.</li>
                <li><strong>Authentication Data:</strong> Secure login credentials handled via Firebase Authentication and Google OAuth.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>2. How We Use Your Information</h2>
              <p className="leading-relaxed mb-3">
                We use the data collected for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To power your personal dashboard, timer statistics, and study spaces.</li>
                <li>To enable peer collaboration in real-time study rooms.</li>
                <li>To maintain community leaderboards and study streaks.</li>
                <li>To improve and optimize platform performance and feature updates.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>3. Data Protection & Security</h2>
              <p className="leading-relaxed">
                We implement industry-standard encryption and security protocols to safeguard your personal information. We do not sell, rent, or trade your personal data to third parties.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>4. Third-Party Services</h2>
              <p className="leading-relaxed mb-3">
                FocusoraHQ integrates with trusted third-party providers for select features:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Firebase & MongoDB:</strong> Secure user authentication and database management.</li>
                <li><strong>Spotify Embeds:</strong> Curated focus music playback within your study room.</li>
                <li><strong>EmailJS:</strong> Newsletter and contact inquiries.</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>5. Cookies & Local Storage</h2>
              <p className="leading-relaxed">
                We use browser local storage and essential session cookies strictly to preserve your theme preference (Light/Dark mode), ambiance settings, and active session tokens.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>6. Your Rights & Data Deletion</h2>
              <p className="leading-relaxed">
                You have full control over your personal data. You can edit your profile, clear your study history, or delete your account at any time directly through your Profile settings.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>7. Contact Privacy Team</h2>
              <p className="leading-relaxed">
                For questions regarding this Privacy Policy or your data, reach out to us at{' '}
                <a href="mailto:privacy@focusorahq.com" className="text-cyan-500 underline hover:text-cyan-400">
                  privacy@focusorahq.com
                </a>.
              </p>
            </section>
          </div>

          <div className="mt-10 text-center flex justify-center gap-4">
            <Link
              to="/terms"
              className={`inline-block font-semibold py-3 px-6 rounded-xl border transition-all duration-300 ${
                darkMode
                  ? 'border-purple-500/40 text-purple-300 hover:bg-purple-900/30'
                  : 'border-purple-300 text-purple-700 hover:bg-purple-50'
              }`}
            >
              View Terms of Service
            </Link>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
