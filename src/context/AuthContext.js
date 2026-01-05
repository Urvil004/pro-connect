'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, name) => {
    try {
      console.log('🔵 STEP 1: Starting registration process...');
      console.log('Data:', { email, name });

      // 1. Create Firebase user
      console.log('🔵 STEP 2: Creating Firebase user...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('✅ Firebase user created:', firebaseUser.uid);

      // 2. CRITICAL: Create user in MongoDB
      const userData = {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
        profilePicture: firebaseUser.photoURL || '',
      };

      console.log('🔵 STEP 3: Creating user in MongoDB...');
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Full endpoint:', `${process.env.NEXT_PUBLIC_API_URL}/auth/register`);
      console.log('User data:', userData);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('🔵 STEP 4: Response received');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);

      const data = await response.json();
      console.log('🔵 STEP 5: Response data:', data);

      if (!response.ok) {
        console.error('❌ MongoDB API error:', data);
        // Don't throw - user is already created in Firebase
        // Just log the error
        console.error('⚠️ User created in Firebase but not in MongoDB');
      } else {
        console.log('✅ SUCCESS: User created in both Firebase and MongoDB');
      }

      return firebaseUser;

    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    return signOut(auth);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
