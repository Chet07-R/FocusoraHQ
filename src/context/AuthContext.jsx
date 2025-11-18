import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  browserSessionPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  applyActionCode,
  deleteUser,
  reauthenticateWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { sendWelcomeEmail, sendSignInAlert } from '../utils/email';
import { createUserProfile, getUserProfile, subscribeToUserProfile, updateUserProfile, deleteUserData } from '../utils/firestoreUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const initialUser = auth.currentUser;
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const hadInitialUser = !!initialUser;

  useEffect(() => {
    let unsubscribeProfile = null;
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          let profile = await getUserProfile(u.uid);
          if (!profile) {
            await createUserProfile(u.uid, {
              displayName: u.displayName || 'User',
              email: u.email,
              photoURL: u.photoURL || null,
            });
          }
          else {
            const updates = {};
            if (!profile.photoURL && u.photoURL) updates.photoURL = u.photoURL;
            if (!profile.displayName && u.displayName) updates.displayName = u.displayName;
            if (Object.keys(updates).length > 0) {
              await updateUserProfile(u.uid, updates);
            }
          }
          if (unsubscribeProfile) unsubscribeProfile();
          unsubscribeProfile = subscribeToUserProfile(u.uid, (p) => setUserProfile(p));
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } 
      else {
        if (unsubscribeProfile) unsubscribeProfile();
        unsubscribeProfile = null;
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => {
      if (unsubscribeProfile) unsubscribeProfile();
      unsubscribeAuth();
    };
  }, []);

  const signUp = async ({ displayName, email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }

    await sendEmailVerification(cred.user);
    
    await createUserProfile(cred.user.uid, {
      displayName: displayName || 'User',
      email,
      photoURL: null,
    });

    try {
      sendWelcomeEmail({ email, name: displayName || 'User' });
    } catch {}

    await signOut(auth);
    return cred.user;
  };

  const signIn = async ({ email, password, remember = false }) => {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const cred = await signInWithEmailAndPassword(auth, email, password);

    try {
      const name = cred.user?.displayName || 'User';
      sendSignInAlert({ email: cred.user?.email || email, name, provider: 'password' });
    } catch {}
    return cred.user;
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const existingProfile = await getUserProfile(cred.user.uid);
    if (!existingProfile) {
      await createUserProfile(cred.user.uid, {
        displayName: cred.user.displayName || 'User',
        email: cred.user.email,
        photoURL: cred.user.photoURL || null,
      });
    }

    try {
      sendSignInAlert({ email: cred.user.email, name: cred.user.displayName || 'User', provider: 'google' });
    } catch {}
    return cred.user;
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const resendVerificationEmail = async () => {
    const current = auth.currentUser;
    if (!current) throw new Error('Not signed in');
    if (current.emailVerified) throw new Error('Email already verified');
    await sendEmailVerification(current);
  };

  const verifyEmail = async (actionCode) => {
    await applyActionCode(auth, actionCode);

    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
  };

  const reloadUser = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const deleteAccount = async () => {
    const current = auth.currentUser;
    if (!current) throw new Error('Not signed in');
    const uid = current.uid;

    try {
      await deleteUserData(uid);
    } catch (e) {
      console.warn('Partial data cleanup; proceeding to delete auth user:', e);
    }

    try {
      await deleteUser(current);
    } catch (err) {
      if (String(err?.code) === 'auth/requires-recent-login') {

        try {
          await reauthenticateWithPopup(current, googleProvider);
          await deleteUser(current);
        } catch (reauthErr) {
          throw reauthErr;
        }
      } else {
        throw err;
      }
    }
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