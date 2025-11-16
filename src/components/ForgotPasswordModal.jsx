import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../utils/authErrors';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      const friendly = mapAuthError(err?.code);
      setError(friendly || err?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-w-md w-full bg-slate-800/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-2 border-purple-500/30 animate-slideInUp">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {!success ? (
          <>
            {/* Heading */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                Forgot Password?
              </h2>
              <p className="text-gray-300 text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="w-full bg-red-500/10 border border-red-500/40 text-red-300 text-sm px-4 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-purple-300 mb-2">
                  Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="w-full text-gray-400 hover:text-white font-semibold py-2 transition-colors duration-200"
              >
                Cancel
              </button>
            </form>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Check Your Email!
                </h2>
                <p className="text-gray-300 text-sm mb-4">
                  We've sent a password reset link to:
                </p>
                <p className="text-cyan-400 font-semibold mb-6">
                  {email}
                </p>
                <p className="text-gray-400 text-xs mb-6">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold py-3 rounded-xl hover:from-purple-500 hover:to-cyan-500 transform hover:scale-105 transition-all duration-300"
              >
                Got It!
              </button>

              <p className="text-gray-400 text-xs mt-4">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setSuccess(false)}
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  try again
                </button>
              </p>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPasswordModal;
