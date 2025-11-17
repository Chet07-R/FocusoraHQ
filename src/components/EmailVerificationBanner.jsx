import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EmailVerificationBanner = () => {
  const { user, resendVerificationEmail } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Don't show if user is verified, doesn't exist, or banner is dismissed
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    try {
      setSending(true);
      await resendVerificationEmail();
      setMessage('Verification email sent! Check your inbox.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Failed to send email. Try again later.');
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b-2 border-amber-500/50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                {message || 'Please verify your email address to access all features.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/verify-email')}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Verify Now
            </button>
            <button
              onClick={handleResend}
              disabled={sending}
              className="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Resend Email'}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
