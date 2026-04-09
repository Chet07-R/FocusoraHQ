import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

const normalizeUser = (payload) => {
  if (!payload) {
    return payload;
  }

  const emailVerified =
    typeof payload.emailVerified === 'boolean'
      ? payload.emailVerified
      : Boolean(payload.isEmailVerified);

  return {
    ...payload,
    emailVerified,
    isEmailVerified: emailVerified,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hadInitialUser, setHadInitialUser] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tokenFromQuery = searchParams.get('token');

      if (tokenFromQuery) {
        localStorage.setItem('token', tokenFromQuery);
        searchParams.delete('token');
        const nextSearch = searchParams.toString();
        const cleanUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash || ''}`;
        window.history.replaceState({}, document.title, cleanUrl);
      }

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          const normalizedUser = normalizeUser(res.data);
          setUser(normalizedUser);
          setUserProfile(normalizedUser);
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
    const normalizedUser = normalizeUser(res.data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      setUser(normalizedUser);
      setUserProfile(normalizedUser);
      setHadInitialUser(true);
    }
    return normalizedUser;
  };

  const signIn = async ({ email, password }) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    const normalizedUser = normalizeUser(res.data);
    setUser(normalizedUser);
    setUserProfile(normalizedUser);
    setHadInitialUser(true);
    return normalizedUser;
  };

  const signInWithGoogle = async () => {
    const baseUrl = String(api.defaults.baseURL || '').replace(/\/$/, '');
    if (!baseUrl) {
      throw new Error('API base URL is not configured');
    }

    window.location.assign(`${baseUrl}/auth/google`);
  };

  const signInAsGuest = async () => {
    const res = await api.post('/auth/guest');
    localStorage.setItem('token', res.data.token);
    const normalizedUser = normalizeUser(res.data);
    setUser(normalizedUser);
    setUserProfile(normalizedUser);
    setHadInitialUser(true);
    return normalizedUser;
  };

  const verifyEmail = async (token) => {
    return api.get('/auth/verify-email', { params: { token } });
  };

  const resendVerificationEmail = async (email) => {
    return api.post('/auth/resend-verification', { email });
  };

  const resetPassword = async (email) => {
    alert(`Reset password email sent to ${email} (simulated)`);
  };

  const reloadUser = async () => {
    try {
      const res = await api.get('/auth/me');
      const normalizedUser = normalizeUser(res.data);
      setUser(normalizedUser);
      setUserProfile(normalizedUser);
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
    () => ({ user, userProfile, loading, hadInitialUser, signUp, signIn, signInWithGoogle, signInAsGuest, resetPassword, resendVerificationEmail, verifyEmail, reloadUser, signOutUser, deleteAccount }),
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