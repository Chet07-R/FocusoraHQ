import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle, AlertTriangle, Loader, RefreshCw, LogOut, Info } from 'lucide-react';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { user, verifyEmail, resendVerificationEmail, signOutUser } = useAuth();
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(searchParams.get('email') || user?.email || '');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const nextEmail = searchParams.get('email') || user?.email || '';
    if (nextEmail) {
      setEmail(nextEmail);
    }

    if (!token) {
      setStatus('waiting');
      setMessage(nextEmail
        ? `We sent a verification link to ${nextEmail}. Open the email to verify your account.`
        : 'Enter your email and we will send a verification link.');
      return;
    }

    const runVerification = async () => {
      setStatus('checking');
      setMessage('Verifying your email...');
      try {
        await verifyEmail(token);
        setStatus('verified');
        setMessage('Email verified successfully. You can now sign in.');
        setTimeout(() => navigate('/signin?verified=1'), 2000);
      } catch (error) {
        setStatus('error');
        setMessage(error?.response?.data?.message || error.message || 'Failed to verify email.');
      }
    };

    runVerification();
  }, [searchParams, user?.email, verifyEmail, navigate]);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Enter your email address first.');
      return;
    }

    try {
      setResendDisabled(true);
      await resendVerificationEmail(email);
      setStatus('waiting');
      setMessage(`Verification email sent to ${email}. Check your inbox.`);

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
      setStatus('error');
      setMessage(error?.response?.data?.message || error.message || 'Failed to send verification email.');
    }
  };

  const handleGoToSignin = () => {
    navigate('/signin');
  };

  const viewState = useMemo(() => {
    let IconComponent = Mail;
    let iconClass = 'w-16 h-16';
    let iconContainerClass = 'w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl';
    let title = 'Verify Your Email';
    let troubleshootingMessage = "Didn't receive the email? Check your spam folder or try resending.";

    switch (status) {
      case 'verified':
        IconComponent = CheckCircle;
        iconClass += ' text-green-400';
        iconContainerClass += ' bg-green-500/10 border-green-500/50';
        title = 'Email Verified!';
        troubleshootingMessage = 'You can now sign in to your account.';
        break;
      case 'waiting':
        IconComponent = Mail;
        iconClass += ' text-blue-400';
        iconContainerClass += ' bg-blue-500/10 border-blue-500/50 animate-pulse';
        break;
      case 'checking':
        IconComponent = Loader;
        iconClass += ' text-indigo-400 animate-spin';
        iconContainerClass += ' bg-indigo-500/10 border-indigo-500/50';
        title = 'Checking Status...';
        break;
      case 'error':
        IconComponent = AlertTriangle;
        iconClass += ' text-red-500';
        iconContainerClass += ' bg-red-500/10 border-red-500/50';
        title = 'Verification Failed';
        break;
      default:
        break;
    }

    return { IconComponent, iconClass, iconContainerClass, title, troubleshootingMessage };
  }, [status]);

  return (
 
    <div className="min-h-screen flex items-center justify-center p-4 
                    bg-gradient-to-r from-indigo-300 to-cyan-100 
                    dark:bg-gradient-to-br dark:from-gray-900 dark:to-slate-800">
      
  
      <div className="relative max-w-lg w-full rounded-3xl shadow-2xl p-8 sm:p-10 mt-12 
                      bg-white/90 backdrop-blur-sm border-t-4 border-blue-400/50
                      dark:bg-slate-800/90 dark:backdrop-blur-lg dark:border-t-4 dark:border-blue-500/70">
      
        <div className="flex flex-col items-center justify-center mb-8">
          <div className={viewState.iconContainerClass}>
            <viewState.IconComponent className={viewState.iconClass} />
          </div>
          
          <h2 className="text-4xl font-extrabold mt-6 mb-3 text-transparent"
            style={{
              background: 'linear-gradient(90deg, #22d3ee 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {viewState.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">{message}</p>
        </div>

        <div className="space-y-4">
          {status === 'waiting' && !searchParams.get('token') && (
            <div className="space-y-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-slate-600 bg-white/90 dark:bg-slate-700/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleResendEmail}
                disabled={resendDisabled}
                className="w-full font-semibold py-3 rounded-xl text-md flex items-center justify-center gap-2 bg-gray-100 border border-gray-300 text-gray-700 dark:bg-slate-700/60 dark:border-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendDisabled ? (
                  <span className="flex items-center gap-2">
                    Resending in <span className="font-bold text-indigo-500 dark:text-indigo-300">{countdown}s</span>
                  </span>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Verification Email
                  </>
                )}
              </button>
            </div>
          )}

          {user && status === 'waiting' && user.email && (
            <div className="p-4 rounded-xl text-center mb-6 
                            bg-blue-50 border border-blue-200 
                            dark:bg-slate-700/50 dark:border-blue-500/30">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Email: <span className="font-bold">{user.email}</span>
              </p>
            </div>
          )}

          {(status === 'waiting' || status === 'verified' || status === 'error') && (
            <button
              onClick={status === 'waiting' ? handleResendEmail : status === 'verified' ? handleGoToSignin : handleGoToSignin}
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
              }}
              className="w-full text-white font-bold py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 
                         hover:brightness-110 transform hover:scale-[1.01] transition-all duration-300"
            >
              {status === 'waiting' && <RefreshCw className="w-5 h-5" />}
              {status === 'waiting' ? 'Resend Verification Email' : status === 'verified' ? 'Go to Sign In' : 'Go to Sign In'}
            </button>
          )}

          {user && (
            <button
              onClick={handleSignOut}
              className="w-full bg-transparent border border-transparent text-gray-500 dark:text-gray-400 font-semibold py-2 rounded-xl 
                         hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          )}

        </div>
        

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-slate-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-amber-500"/>
                {viewState.troubleshootingMessage}
            </p>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;