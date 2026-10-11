import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AuthUserProfile,
  getStoredUser,
  getActiveLicenseTier,
  setStoredLicenseTier,
  signInWithGoogle as authSignInWithGoogle,
  signInWithGoogleRedirectFlow,
  signInWithEmail,
  signUpWithEmail,
  signInAsDemoArchitect,
  signOutUser,
  checkRedirectAuth,
  requestPasswordReset as authRequestPasswordReset
} from '../services/firebaseAuth';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface AuthContextType {
  user: AuthUserProfile | null;
  loading: boolean;
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  signInWithGoogle: () => Promise<AuthUserProfile>;
  signInWithGoogleRedirect: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<AuthUserProfile>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<AuthUserProfile>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  quickDemoLogin: () => AuthUserProfile;
  signOut: () => Promise<void>;
  isCommercializeModalOpen: boolean;
  setIsCommercializeModalOpen: (open: boolean) => void;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUserProfile | null>(getStoredUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCommercializeModalOpen, setIsCommercializeModalOpen] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTierState] = useState<SubscriptionTier>(getActiveLicenseTier);

  useEffect(() => {
    // Check initial stored user and handle potential OAuth redirect return
    async function init() {
      try {
        const redirectUser = await checkRedirectAuth();
        if (redirectUser) {
          setUser(redirectUser);
          setSubscriptionTierState(redirectUser.licenseTier);
        } else {
          const stored = getStoredUser();
          if (stored) {
            setUser(stored);
            setSubscriptionTierState(stored.licenseTier);
          }
        }
      } catch (e) {
        console.warn('Auth initialization warning:', e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const setSubscriptionTier = (tier: SubscriptionTier) => {
    setSubscriptionTierState(tier);
    setStoredLicenseTier(tier);
    if (user) {
      setUser({ ...user, licenseTier: tier });
    }
  };

  const signInWithGoogle = async (): Promise<AuthUserProfile> => {
    setAuthError(null);
    try {
      const loggedProfile = await authSignInWithGoogle();
      setUser(loggedProfile);
      setSubscriptionTierState(loggedProfile.licenseTier);
      return loggedProfile;
    } catch (err: any) {
      const msg = err.message || 'Unable to sign in with Google. Please try again.';
      setAuthError(msg);
      throw err;
    }
  };

  const signInWithGoogleRedirect = async (): Promise<void> => {
    setAuthError(null);
    try {
      await signInWithGoogleRedirectFlow();
    } catch (err: any) {
      setAuthError(err.message || 'Unable to initiate Google redirect flow.');
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<AuthUserProfile> => {
    setAuthError(null);
    try {
      const logged = await signInWithEmail(email, pass);
      setUser(logged);
      setSubscriptionTierState(logged.licenseTier);
      return logged;
    } catch (err: any) {
      setAuthError(err.message || 'Email authentication failed.');
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string): Promise<AuthUserProfile> => {
    setAuthError(null);
    try {
      const registered = await signUpWithEmail(email, pass, name);
      setUser(registered);
      setSubscriptionTierState(registered.licenseTier);
      return registered;
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed.');
      throw err;
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; message: string }> => {
    setAuthError(null);
    try {
      return await authRequestPasswordReset(email);
    } catch (err: any) {
      const msg = err.message || 'Unable to process password reset request.';
      setAuthError(msg);
      throw err;
    }
  };

  const quickDemoLogin = (): AuthUserProfile => {
    setAuthError(null);
    const demo = signInAsDemoArchitect();
    setUser(demo);
    setSubscriptionTierState(demo.licenseTier);
    return demo;
  };

  const signOut = async () => {
    setAuthError(null);
    try {
      await signOutUser();
      setUser(null);
      setSubscriptionTierState('free');
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
        signInWithGoogleRedirect,
        loginWithEmail,
        registerWithEmail,
        requestPasswordReset,
        quickDemoLogin,
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
