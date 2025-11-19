import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { mapAuthError } from '../utils/authErrors';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

const SignIn = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [rememberMe, setRememberMe] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState('');
const [showForgotPassword, setShowForgotPassword] = useState(false);
const navigate = useNavigate();
const { signIn, signInWithGoogle, signOutUser } = useAuth();
const { darkMode } = useTheme();

const handleSignIn = async (e) => {
  e.preventDefault();
  setError('');
  setSubmitting(true);
  try {
    const user = await signIn({ email, password, remember: rememberMe });
    
    if (!user.emailVerified) {
      try { await signOutUser(); } catch {}
      navigate('/verify-email');
    } else {
      navigate('/');
    }
  } catch (err) {
    const friendly = mapAuthError(err?.code);
    setError(friendly || err?.message || 'Failed to sign in');
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
    setError(friendly || err?.message || 'Google sign-in failed');
  } finally {
    setSubmitting(false);
  }
};

return (
<>
<div className="min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 pt-16">
    <div className={`relative max-w-md w-full rounded-3xl shadow-2xl p-8 border-2 mt-12 hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-lg ${darkMode ? 'bg-slate-800/80 border-purple-500/30' : 'bg-white/80 border-purple-400/40'}`}>
      {}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img src="../images/transparent.png" alt="Logo" className="w-20 h-20 hover:scale-110 transition-transform duration-300 dark:invert-0 invert" />
        </div>
      </div>

      {}
      <div className="text-center mb-8">
        <h2 
          className="text-5xl font-black mb-3 tracking-tight" 
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif', 
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #22d3ee 0%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          Welcome Back
        </h2>
        <p className={`text-base font-light tracking-wide ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Sign in to continue your journey
        </p>
      </div>

      {}
      <form onSubmit={handleSignIn} className="space-y-5">
        {error && (
          <div className={`w-full border text-sm px-4 py-2 rounded-lg ${darkMode ? 'bg-red-500/10 border-red-500/40 text-red-300' : 'bg-red-50 border-red-300 text-red-700'}`}>
            {error}
          </div>
        )}
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className={`w-full border-2 rounded-xl px-4 py-3.5 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-medium ${darkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white/90 border-gray-300 text-gray-900'}`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            required
          />
        </div>

        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className={`w-full border-2 rounded-xl px-4 py-3.5 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-medium ${darkMode ? 'bg-slate-900/50 border-slate-700 text-white' : 'bg-white/90 border-gray-300 text-gray-900'}`}
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            required
          />
        </div>

        {}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-purple-500 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <span className={`ml-2 text-sm group-hover:text-purple-300 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-all cursor-pointer"
          >
            Forgot Password?
          </button>
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
          {submitting ? 'Signing In…' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className={`w-full cursor-pointer mt-3 border-2 font-semibold py-3.5 rounded-xl transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${darkMode ? 'bg-slate-700/60 border-slate-600 text-white hover:bg-slate-700 hover:border-cyan-400' : 'bg-white/90 border-gray-300 text-gray-900 hover:bg-white hover:border-purple-500'}`}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Continue with Google
        </button>
      </form>

      {}
      <p className={`text-center text-sm mt-6 font-light ${darkMode ? 'text-gray-400' : 'text-gray-700'}`} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        New here?{' '}
        <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
          Create an Account
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

  {}
  <ForgotPasswordModal
    isOpen={showForgotPassword}
    onClose={() => setShowForgotPassword(false)}
  />
</>
);
};

export default SignIn;
