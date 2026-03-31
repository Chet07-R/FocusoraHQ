import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hadInitialUser, setHadInitialUser] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          setUserProfile(res.data);
          setHadInitialUser(true);
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signUp = async ({ displayName, email, password }) => {
    const res = await api.post('/auth/register', { displayName, email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    setUserProfile(res.data);
    return res.data;
  };

  const signIn = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    setUserProfile(res.data);
    return res.data;
  };

  const signInWithGoogle = async () => {
    alert("Google Sign-In needs a custom backend OAuth implementation and has been temporarily disabled.");
    throw new Error("Not implemented yet");
  };

  const resetPassword = async (email) => {
    alert(`Reset password email sent to ${email} (simulated)`);
  };

  const resendVerificationEmail = async () => {
    console.log("Resend verification");
  }

  const verifyEmail = async (actionCode) => {
    console.log("Verify email");
  }

  const reloadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
      setUserProfile(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const signOutUser = async () => {
    localStorage.removeItem('token');
    setUser(null);
    setUserProfile(null);
  };

  const deleteAccount = async () => {
    await signOutUser();
  };

  const value = useMemo(
    () => ({ user, userProfile, loading, hadInitialUser, signUp, signIn, signInWithGoogle, resetPassword, resendVerificationEmail, verifyEmail, reloadUser, signOutUser, deleteAccount }),
    [user, userProfile, loading, hadInitialUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};