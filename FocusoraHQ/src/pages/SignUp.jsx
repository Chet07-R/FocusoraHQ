import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Sign Up:', formData);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4 py-8">
        {/* Fun animated background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-md w-full bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-blue-500/30 mt-12 hover:border-purple-400/50 transition-all duration-300">
          {/* Logo with cool glow effect */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <img src="../images/transparent.png" alt="Logo" className="w-20 h-20 hover:rotate-12 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-md opacity-50 animate-pulse"></div>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Join the Squad! 🎓
            </h2>
            <p className="text-gray-300 text-sm">
              Start your productivity journey today!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="What should we call you?"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@college.edu"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Make it strong!"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-blue-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Type it again"
                className="w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                required
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 rounded border-2 border-blue-500 text-purple-500 focus:ring-0 focus:ring-offset-0"
                required
              />
              <label className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 hover:underline font-semibold">
                  Terms & Conditions
                </Link>
                {' '}(we promise they're not boring)
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-300 text-sm mt-6">
            Already a member? {' '}
            <Link to="/signin" className="text-purple-400 hover:text-purple-300 font-bold hover:underline transition-colors">
              Sign In Here!
            </Link>
          </p>
        </div>
      </div>

      {/* Custom animation styles */}
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

export default SignUp;
