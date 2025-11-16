// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// const SignIn = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSignIn = (e) => {
//     e.preventDefault();
//     console.log('Sign In:', { email, password, rememberMe });
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-8">
//         <div className="max-w-md w-full bg-[#1e293b] rounded-2xl shadow-2xl p-8 border border-gray-700">
//           {/* Logo Icon */}
//           <div className="flex justify-center mb-6">
//             <img src="../images/transparent.png" alt="Logo" className="w-20 h-20" />
//           </div>

//           {/* Heading */}
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-white mb-2">
//               Welcome Back
//             </h2>
//             <p className="text-gray-400 text-sm">
//               Sign in to continue your focus journey
//             </p>
//           </div>

//           {/* Form */}
//           <form onSubmit={handleSignIn} className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your Email"
//                 className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-2">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your Password"
//                 className="w-full bg-[#0f172a] border border-gray-600 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
//                 required
//               />
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 bg-[#0f172a] border-gray-600 rounded text-cyan-500 focus:ring-0 focus:ring-offset-0"
//                 />
//                 <span className="ml-2 text-sm text-gray-300">Remember me</span>
//               </label>
//               <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
//                 Forgot Password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#0f172a] border border-gray-600 text-white font-medium py-3 rounded-lg hover:bg-[#1e293b] hover:border-cyan-500 transition-all duration-200"
//             >
//               Sign In
//             </button>
//           </form>

//           {/* Sign Up Link */}
//           <p className="text-center text-gray-400 text-sm mt-6">
//             Don't have an account?{' '}
//             <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default SignIn;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
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
const { signIn, signInWithGoogle } = useAuth();

const handleSignIn = async (e) => {
  e.preventDefault();
  setError('');
  setSubmitting(true);
  try {
    await signIn({ email, password, remember: rememberMe });
    navigate('/');
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
<Navbar />
<div className="min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
    <div className="relative max-w-md w-full bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-500/30 mt-12 hover:border-cyan-400/50 transition-all duration-300">
      {/* Logo Icon with bounce animation */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img src="../images/transparent.png" alt="Logo" className="w-20 h-20 hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-md opacity-50 animate-pulse"></div>
        </div>
      </div>

      {/* Heading with FocusoraHQ gradient text */}
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
        <p className="text-gray-400 text-base font-light tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          Sign in to continue your journey
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignIn} className="space-y-5">
        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em' }}>
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-medium"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.05em' }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 font-medium"
            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            required
          />
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-2 border-purple-500 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="ml-2 text-sm text-gray-300 group-hover:text-purple-300 transition-colors">Remember me</span>
          </label>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-all"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button with cool gradient */}
        <button
          type="submit"
          disabled={submitting}
          style={{ 
            fontFamily: 'Inter, system-ui, sans-serif', 
            background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
          }}
          className="w-full text-white font-bold py-3.5 rounded-xl hover:brightness-110 transform hover:scale-[1.03] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed tracking-wide"
          onMouseEnter={(e) => !submitting && (e.currentTarget.style.boxShadow = '0 0 35px rgba(6, 182, 212, 0.7), 0 0 70px rgba(139, 92, 246, 0.6), 0 8px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)')}
          onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 25px rgba(6, 182, 212, 0.5), 0 0 50px rgba(139, 92, 246, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'}
        >
          {submitting ? 'Signing In…' : 'Sign In'}
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={submitting}
          className="w-full mt-3 bg-slate-700/60 border-2 border-slate-600 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-700 hover:border-cyan-400 transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Continue with Google
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-gray-400 text-sm mt-6 font-light" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        New here?{' '}
        <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline transition-colors">
          Create an Account
        </Link>
      </p>
    </div>
  </div>

  {/* Custom styles for autofill */}
  <style>{`
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px rgb(15 23 42 / 0.5) inset !important;
      -webkit-text-fill-color: #ffffff !important;
      caret-color: #ffffff;
      transition: background-color 5000s ease-in-out 0s;
    }
  `}</style>

  {/* Forgot Password Modal */}
  <ForgotPasswordModal
    isOpen={showForgotPassword}
    onClose={() => setShowForgotPassword(false)}
  />
</>
);
};

export default SignIn;
