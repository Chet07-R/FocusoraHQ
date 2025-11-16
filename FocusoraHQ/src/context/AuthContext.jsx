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
} from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { createUserProfile, getUserProfile, subscribeToUserProfile, updateUserProfile } from '../utils/firestoreUtils';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user from Firebase's current user (cached) to prevent flash
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

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
          } else {
            // If profile exists but missing photo or name, backfill from Auth (e.g., Google profile)
            const updates = {};
            if (!profile.photoURL && u.photoURL) updates.photoURL = u.photoURL;
            if (!profile.displayName && u.displayName) updates.displayName = u.displayName;
            if (Object.keys(updates).length > 0) {
              await updateUserProfile(u.uid, updates);
            }
          }
          // Realtime subscription for profile updates
          if (unsubscribeProfile) unsubscribeProfile();
          unsubscribeProfile = subscribeToUserProfile(u.uid, (p) => setUserProfile(p));
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
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
    // Create Firestore profile
    await createUserProfile(cred.user.uid, {
      displayName: displayName || 'User',
      email,
      photoURL: null,
    });
    return cred.user;
  };

  const signIn = async ({ email, password, remember = false }) => {
    await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  };

  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    // Create or update Firestore profile
    const existingProfile = await getUserProfile(cred.user.uid);
    if (!existingProfile) {
      await createUserProfile(cred.user.uid, {
        displayName: cred.user.displayName || 'User',
        email: cred.user.email,
        photoURL: cred.user.photoURL || null,
      });
    }
    return cred.user;
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const value = useMemo(
    () => ({ user, userProfile, loading, signUp, signIn, signInWithGoogle, resetPassword, signOutUser }),
    [user, userProfile, loading]
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
