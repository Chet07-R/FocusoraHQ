import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { user, verifyEmail, resendVerificationEmail, reloadUser, signOutUser } = useAuth();
  const [status, setStatus] = useState('checking'); // checking, verified, error, waiting
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');

    // If we have an action code from the email link, verify it
    if (mode === 'verifyEmail' && actionCode) {
      handleEmailVerification(actionCode);
    } else if (user) {
      // Check if user is already verified
      if (user.emailVerified) {
        setStatus('verified');
        setMessage('Your email is already verified!');
      } else {
        setStatus('waiting');
        setMessage('Please check your email for the verification link.');
      }
    } else {
      // Not logged in: instruct user to verify via email, then sign in
      setStatus('error');
      setMessage('We sent you a verification email. Click the link in your inbox to verify, then sign in.');
    }
  }, [searchParams, user]);

  const handleEmailVerification = async (actionCode) => {
    try {
      await verifyEmail(actionCode);
      setStatus('verified');
      setMessage('Email verified successfully! Please sign in to continue.');
      // Enforce fresh sign-in after verification
      try { await signOutUser(); } catch {}
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to verify email. The link may be expired or invalid.');
    }
  };

  const handleResendEmail = async () => {
    try {
      setResendDisabled(true);
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
      // Start 60 second countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      setResendDisabled(false);
      setMessage(error.message || 'Failed to send verification email.');
    }
  };

  const handleCheckVerification = async () => {
    try {
      await reloadUser();
      if (user && user.emailVerified) {
        setStatus('verified');
        setMessage('Email verified successfully! Please sign in to continue.');
        try { await signOutUser(); } catch {}
        setTimeout(() => navigate('/signin'), 1500);
      } else {
        setMessage('Email not verified yet. Please click the link in your email.');
      }
    } catch (error) {
      setMessage('Failed to check verification status.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-indigo-300 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
        <div className="relative max-w-lg w-full bg-slate-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-10 border-2 border-blue-500/30 mt-12">
          
          {/* Icon based on status */}
          <div className="flex justify-center mb-6">
            {status === 'verified' && (
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-400">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {(status === 'waiting' || status === 'checking') && (
              <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center border-2 border-blue-400 animate-pulse">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-400">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 
              className="text-3xl font-extrabold mb-3"
              style={{
                background: 'linear-gradient(90deg, #22d3ee 0%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {status === 'verified' ? 'Email Verified!' : 'Verify Your Email'}
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              {message}
            </p>
          </div>

          {/* User email display */}
          {user && status === 'waiting' && (
            <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-400 mb-1">Verification email sent to:</p>
              <p className="text-white font-semibold">{user.email}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-3">
            {status === 'waiting' && (
              <>
                <button
                  onClick={handleCheckVerification}
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif', 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                  }}
                  className="w-full text-white font-bold py-3.5 rounded-xl hover:brightness-110 transform hover:scale-[1.02] transition-all duration-300"
                >
                  I've Verified My Email
                </button>

                <button
                  onClick={handleResendEmail}
                  disabled={resendDisabled}
                  className="w-full bg-slate-700/60 border-2 border-blue-500/30 text-white font-semibold py-3 rounded-xl hover:bg-slate-700 hover:border-purple-400 transform hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full bg-transparent border-2 border-gray-500/50 text-gray-300 font-semibold py-3 rounded-xl hover:bg-slate-700/50 hover:border-gray-400 transition-all duration-300"
                >
                  Sign Out
                </button>
              </>
            )}

            {status === 'verified' && (
              <button
                onClick={() => navigate('/')}
                style={{ 
                  fontFamily: 'Inter, system-ui, sans-serif', 
                  background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                }}
                className="w-full text-white font-bold py-3.5 rounded-xl hover:brightness-110 transform hover:scale-[1.02] transition-all duration-300"
              >
                Go to Dashboard
              </button>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={() => navigate('/signin')}
                  style={{ 
                    fontFamily: 'Inter, system-ui, sans-serif', 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
                  }}
                  className="w-full text-white font-bold py-3.5 rounded-xl hover:brightness-110 transform hover:scale-[1.02] transition-all duration-300"
                >
                  Sign In
                </button>
              </>
            )}
          </div>

          {/* Help text */}
          {status === 'waiting' && (
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Didn't receive the email? Check your spam folder or try resending.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;
