'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { User, GoogleAuthProvider, signInWithPopup, browserPopupRedirectResolver } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUser, setLoading } from '@/store/slices/authSlice';
import redis from '@/lib/redis';

interface AuthContextType {
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  signInWithGoogle: async () => { },
  logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const sessionKey = `session:${user.uid}`;
          await redis.set(sessionKey, {
            email: user.email,
            lastLogin: new Date().toISOString()
          });
        } catch (error) {
          console.error('Redis error in AuthProvider:', error);
        }
      }
      dispatch(setUser(user));
      dispatch(setLoading(false));
    });

    return unsubscribe;
  }, [dispatch]);

  const signInWithGoogle = async () => {
    if (isSigningIn) return;

    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const result = await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      if (result.user) {
        console.log('Successfully signed in:', result.user.email);
        router.push('/challenges');
      }
    } catch (error: any) {
      if (error.code !== 'auth/cancelled-popup-request') {
        console.error('Error signing in with Google:', error);
        alert('Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const logout = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        try {
          const sessionKey = `session:${user.uid}`;
          await redis.del(sessionKey);
        } catch (error) {
          console.error('Redis error during logout:', error);
        }
      }
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 