import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGooglePopup, signOutUser } from '../services/firebaseAuth';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isCommercializeModalOpen: boolean;
  setIsCommercializeModalOpen: (open: boolean) => void;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TIER_STORAGE_KEY = 'zaboraa_user_subscription_tier';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCommercializeModalOpen, setIsCommercializeModalOpen] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTierState] = useState<SubscriptionTier>(() => {
    try {
      const saved = localStorage.getItem(TIER_STORAGE_KEY);
      if (saved === 'pro' || saved === 'enterprise') return saved;
    } catch {}
    return 'free';
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setSubscriptionTier = (tier: SubscriptionTier) => {
    setSubscriptionTierState(tier);
    try {
      localStorage.setItem(TIER_STORAGE_KEY, tier);
    } catch {}
  };

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const loggedUser = await signInWithGooglePopup();
      setUser(loggedUser);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed popup
        return;
      }
      if (err.code === 'auth/popup-blocked') {
        setAuthError('Pop-up window was blocked by your browser. Please allow pop-ups for this site or open in a direct tab.');
      } else {
        setAuthError(err.message || 'Unable to sign in with Google. Please try again.');
      }
      throw err;
    }
  };

  const signOut = async () => {
    setAuthError(null);
    try {
      await signOutUser();
      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        subscriptionTier,
        setSubscriptionTier,
        signInWithGoogle,
        signOut,
        isCommercializeModalOpen,
        setIsCommercializeModalOpen,
        authError,
        clearAuthError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
