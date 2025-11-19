import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, CheckCircle, AlertTriangle, Loader, RefreshCw, LogOut, Info } from 'lucide-react'; 

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const { user, verifyEmail, resendVerificationEmail, reloadUser, signOutUser } = useAuth();
  const [status, setStatus] = useState('checking'); 
  const [message, setMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleEmailVerification = async (actionCode) => {
    setStatus('checking');
    setMessage('Verifying your email...');
    try {
      await verifyEmail(actionCode);
      setStatus('verified');
      setMessage('Email verified successfully! You will be redirected to sign in shortly.');
      
      try { await signOutUser(); } catch (e) { console.error("Sign out failed post-verification:", e); }
      
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to verify email. The link may be expired or invalid.');
    }
  };

  const handleResendEmail = async () => {
    if (!user) {
      setMessage('Cannot resend verification email without an active user session.');
      setStatus('error');
      return;
    }
    
    try {
      setResendDisabled(true);
      await resendVerificationEmail();
      setMessage('New verification email sent! Please check your inbox.');
   
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
      
      if (user?.emailVerified) {
        setStatus('verified');
        setMessage('Email verified successfully! Redirecting to sign in...');
        try { await signOutUser(); } catch (e) { console.error("Sign out failed post-check:", e); }
        setTimeout(() => navigate('/signin'), 1500);
      } else {
        setMessage('Email not verified yet. Please click the link in your email.');
      }
    } catch (error) {
      setMessage('Failed to check verification status. Please refresh the page or try again.');
    }
  };

  

  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');

    if (mode === 'verifyEmail' && actionCode) {
      handleEmailVerification(actionCode);
    } else if (user) {
      if (user.emailVerified) {
        setStatus('verified');
        setMessage('Your email is already verified! Redirecting to dashboard...');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('waiting');
        setMessage(`A verification link has been sent to ${user.email}. Please click the link to continue.`);
      }
    } else {
      setStatus('error');
      setMessage('We sent you a verification email. Click the link in your inbox to verify, then sign in.');
    }
 
  }, [searchParams, user, navigate]);



  let IconComponent;
  let iconClass = "w-16 h-16";
  let iconContainerClass = "w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-xl";
  let title = 'Verify Your Email';
  let troubleshootingMessage = "Didn't receive the email? Check your spam folder or try resending.";

  switch (status) {
    case 'verified':
      IconComponent = CheckCircle;
      iconClass += ' text-green-400';
      iconContainerClass += ' bg-green-500/10 border-green-500/50';
      title = 'Email Verified!';
      troubleshootingMessage = "You're all set! Click the button below to sign in.";
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
      IconComponent = Mail;
      iconClass += ' text-blue-400';
      iconContainerClass += ' bg-blue-500/10 border-blue-500/50';
  }

  return (
 
    <div className="min-h-screen flex items-center justify-center p-4 
                    bg-gradient-to-r from-indigo-300 to-cyan-100 
                    dark:bg-gradient-to-br dark:from-gray-900 dark:to-slate-800">
      
  
      <div className="relative max-w-lg w-full rounded-3xl shadow-2xl p-8 sm:p-10 mt-12 
                      bg-white/90 backdrop-blur-sm border-t-4 border-blue-400/50
                      dark:bg-slate-800/90 dark:backdrop-blur-lg dark:border-t-4 dark:border-blue-500/70">
      
        <div className="flex flex-col items-center justify-center mb-8">
          <div className={iconContainerClass}>
            <IconComponent className={iconClass} />
          </div>
          
          <h2 className="text-4xl font-extrabold mt-6 mb-3 text-transparent"
            style={{
              background: 'linear-gradient(90deg, #22d3ee 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">{message}</p>
        </div>

        <div className="space-y-4">
          
          {user && status === 'waiting' && (
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
              onClick={status === 'waiting' ? handleCheckVerification : status === 'verified' ? () => navigate('/') : () => navigate('/signin')}
              style={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #ec4899 100%)',
              }}
              className="w-full text-white font-bold py-3.5 rounded-xl text-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 
                         hover:brightness-110 transform hover:scale-[1.01] transition-all duration-300"
            >
              {status === 'waiting' && <RefreshCw className="w-5 h-5"/>}
              {status === 'waiting' ? "I've Verified My Email" : status === 'verified' ? 'Go to Dashboard' : 'Go to Sign In'}
            </button>
          )}

          {status === 'waiting' && (
            <>

              <button
                onClick={handleResendEmail}
                disabled={resendDisabled}
                className="w-full font-semibold py-3 rounded-xl text-md flex items-center justify-center gap-2 
                           bg-gray-100 border border-gray-300 text-gray-700 
                           dark:bg-slate-700/60 dark:border-gray-600 dark:text-gray-300 
                           hover:bg-gray-200 dark:hover:bg-slate-700 
                           transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendDisabled ? (
                  <span className="flex items-center gap-2">
                    Resending in <span className="font-bold text-indigo-500 dark:text-indigo-300">{countdown}s</span>
                  </span>
                ) : (
                  <>
                    <Mail className="w-5 h-5"/>
                    Resend Verification Email
                  </>
                )}
              </button>
              
    
              <button
                onClick={handleSignOut}
                className="w-full bg-transparent border border-transparent text-gray-500 dark:text-gray-400 font-semibold py-2 rounded-xl 
                           hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5"/>
                Sign Out
              </button>
            </>
          )}

        </div>
        

        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-slate-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                <Info className="w-4 h-4 text-amber-500"/>
                {troubleshootingMessage}
            </p>
        </div>

      </div>
    </div>
  );
};

export default VerifyEmail;