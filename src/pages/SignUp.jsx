import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mapAuthError } from '../utils/authErrors';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const { darkMode } = useTheme();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      setSubmitting(true);
      await signUp({
        displayName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      
      navigate('/verify-email');
    } catch (err) {
      const friendly = mapAuthError(err?.code);
      setError(friendly || err?.message || 'Failed to create account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err) {
      const friendly = mapAuthError(err?.code);
      setError(friendly || err?.message || 'Google sign-up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 pt-16">
        <div className={`relative max-w-md w-full rounded-3xl shadow-2xl p-8 border-2 mt-12 hover:border-purple-400/50 transition-all duration-300 backdrop-blur-lg ${darkMode ? 'bg-slate-800/80 border-blue-500/30' : 'bg-white/80 border-blue-400/40'}`}>
          {}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src="../images/transparent.png" alt="Logo" className="w-20 h-20 hover:rotate-12 transition-transform duration-300 dark:invert-0 invert" />
            </div>
          </div>

          {}
          <div className="text-center mb-8">
            <h2 
              className="text-4xl font-extrabold mb-2"
              style={{
                background: 'linear-gradient(90deg, #22d3ee 0%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Join the Squad!
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Start your productivity journey today!
            </p>
          </div>

          {}
          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className={`w-full border px-4 py-2 rounded-lg ${darkMode ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`}>
                {error}
              </div>
            )}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="What should we call you?"
                className={`w-full border-2 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-blue-500/30 text-white' : 'bg-white/90 border-blue-400/40 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email (your.email@example.com)"
                className={`w-full border-2 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-blue-500/30 text-white' : 'bg-white/90 border-blue-400/40 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Make it strong!"
                className={`w-full border-2 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-blue-500/30 text-white' : 'bg-white/90 border-blue-400/40 text-gray-900'}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Type it again"
                className={`w-full border-2 rounded-xl px-4 py-3 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 ${darkMode ? 'bg-slate-900/50 border-blue-500/30 text-white' : 'bg-white/90 border-blue-400/40 text-gray-900'}`}
                required
              />
            </div>

            {}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 cursor-pointer rounded border-2 border-blue-500 text-purple-500 focus:ring-0 focus:ring-offset-0"
                required
              />
              <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                I agree to the{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 hover:underline font-semibold">
                  Terms & Conditions
                </Link>
                {' '}(we promise they're not boring)
              </label>
            </div>

            {}
            <button
              type="submit"
              disabled={submitting}
              style={{ 
                fontFamily: 'Inter, system-ui, sans-serif', 
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
              className="w-full cursor-pointer text-white font-bold py-3.5 rounded-xl hover:brightness-110 transform hover:scale-[1.03] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
              onMouseEnter={(e) => !submitting && (e.currentTarget.style.boxShadow = '0 0 35px rgba(6, 182, 212, 0.7), 0 0 70px rgba(139, 92, 246, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)')}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
            >
              {submitting ? 'Creating Account…' : 'Create Account'}
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={submitting}
              className={`w-full mt-3 cursor-pointer border-2 font-semibold py-3 rounded-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${darkMode ? 'bg-slate-700/60 border-blue-500/30 text-white hover:bg-slate-700 hover:border-purple-400' : 'bg-white/90 border-blue-400/40 text-gray-900 hover:bg-white hover:border-purple-500'}`}
            >
              Continue with Google
            </button>
          </form>

          {}
          <p className={`text-center text-sm mt-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Already a member? {' '}
            <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">
              Sign In Here!
            </Link>
          </p>
        </div>
      </div>

      {}
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${darkMode ? 'rgb(15 23 42 / 0.5)' : 'rgb(255 255 255 / 0.9)'} inset !important;
          -webkit-text-fill-color: ${darkMode ? '#ffffff' : '#1f2937'} !important;
          caret-color: ${darkMode ? '#ffffff' : '#1f2937'};
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </>
  );
};

export default SignUp;
