import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AuthError, Session } from '@supabase/supabase-js';
import { supabase, getAuthRedirectUrl } from '../lib/supabase';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface AppUser {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface SignUpResult {
  needsConfirmation: boolean;
}

export interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  subscriptionTier: SubscriptionTier;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<SignUpResult | null>;
  signOut: () => Promise<void>;
  redeemLicenseKey: (code: string) => Promise<SubscriptionTier | null>;
  downgradeToFree: () => Promise<boolean>;
  isCommercializeModalOpen: boolean;
  setIsCommercializeModalOpen: (open: boolean) => void;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function describeAuthError(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
    case 'user_not_found':
      return 'Invalid email or password.';
    case 'email_not_confirmed':
      return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
    case 'weak_password':
      return error.message || 'Password is too weak. Use at least 8 characters with a mix of letters and numbers.';
    case 'over_request_rate_limit':
    case 'over_email_send_rate_limit':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'email_address_invalid':
      return 'Please enter a valid email address.';
    case 'signup_disabled':
      return 'New sign-ups are currently disabled.';
    default:
      return 'Something unexpected went wrong. Please try again.';
  }
}

function toAppUser(session: Session | null): AppUser | null {
  const u = session?.user;
  if (!u) return null;
  return {
    id: u.id,
    email: u.email ?? null,
    displayName: (u.user_metadata?.display_name as string | undefined) ?? u.email?.split('@')[0] ?? null,
    photoURL: null
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isCommercializeModalOpen, setIsCommercializeModalOpen] = useState<boolean>(false);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('free');

  const loadProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, subscription_tier')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) {
      setSubscriptionTier('free');
      return;
    }
    setSubscriptionTier((data.subscription_tier as SubscriptionTier) ?? 'free');
    if (data.display_name) {
      setUser(prev => (prev && prev.id === userId ? { ...prev, displayName: data.display_name } : prev));
    }
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const appUser = toAppUser(session);
      setUser(appUser);
      setLoading(false);
      if (appUser) {
        // Deferred so Supabase isn't called from inside its own auth callback.
        setTimeout(() => void loadProfile(appUser.id), 0);
      } else {
        setSubscriptionTier('free');
      }
    });
    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  const signInWithEmail = async (email: string, password: string) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setAuthError(describeAuthError(error));
      return false;
    }
    return true;
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: getAuthRedirectUrl(),
        data: { display_name: displayName.trim() || undefined }
      }
    });
    if (error) {
      setAuthError(describeAuthError(error));
      return null;
    }
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    setAuthError(null);
    await supabase.auth.signOut();
  };

  const redeemLicenseKey = async (code: string) => {
    const { data, error } = await supabase.rpc('redeem_license_key', { p_code: code });
    if (error || !data) return null;
    const tier = data as SubscriptionTier;
    setSubscriptionTier(tier);
    return tier;
  };

  const downgradeToFree = async () => {
    const { error } = await supabase.rpc('downgrade_to_free');
    if (error) return false;
    setSubscriptionTier('free');
    return true;
  };

  const clearAuthError = () => setAuthError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        subscriptionTier,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        redeemLicenseKey,
        downgradeToFree,
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
