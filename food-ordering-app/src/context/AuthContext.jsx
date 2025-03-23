// src/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Authentication methods
  const signIn = async (email, password) => {
    return firebaseAuth.signIn(email, password);
  };

  const signUp = async (email, password) => {
    return firebaseAuth.signUp(email, password);
  };

  const signOut = async () => {
    return firebaseAuth.signOut();
  };

  const signInWithGoogle = async () => {
    return firebaseAuth.signInWithGoogle();
  };

  const resetPassword = async (email) => {
    return firebaseAuth.resetPassword(email);
  };

  const value = {
    currentUser,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};