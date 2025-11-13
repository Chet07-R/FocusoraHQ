import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignIn = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [rememberMe, setRememberMe] = useState(false);

const handleSignIn = (e) => {
e.preventDefault();
console.log('Sign In:', { email, password, rememberMe });
};

return (
<>
<Navbar />
<div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 py-8">
{/* Floating circles for fun background effect */}
<div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
<div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
<div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

    <div className="relative max-w-md w-full bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-500/30 mt-12 hover:border-cyan-400/50 transition-all duration-300">
      {/* Logo Icon with bounce animation */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <img src="../images/transparent.png" alt="Logo" className="w-20 h-20 hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full blur-md opacity-50 animate-pulse"></div>
        </div>
      </div>

      {/* Heading with gradient text */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-300 text-sm">
          Let's get you back to crushing your goals!
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSignIn} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full bg-slate-900/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-purple-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your secret password"
            className="w-full bg-slate-900/50 border-2 border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
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
          <Link to="/forgot-password" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline transition-all">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button with cool gradient */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
        >
          Sign In
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-gray-300 text-sm mt-6">
        New here? {' '}
        <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-colors">
          Create an Account
        </Link>
      </p>
    </div>
  </div>

  {/* Add custom animation styles */}
  <style>{`
    @keyframes blob {
      0%, 100% { transform: translate(0px, 0px) scale(1); }
      33% { transform: translate(30px, -50px) scale(1.1); }
      66% { transform: translate(-20px, 20px) scale(0.9); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `}</style>
</>
);
};

export default SignIn;
