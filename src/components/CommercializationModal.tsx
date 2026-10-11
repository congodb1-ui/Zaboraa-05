import React, { useState } from 'react';
import { useAuth, SubscriptionTier } from '../context/AuthContext';
import { activateLicenseKey } from '../services/firebaseAuth';
import {
  X,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  CreditCard,
  LogOut,
  AlertCircle,
  Mail,
  Lock,
  User as UserIcon,
  ArrowRight,
  ExternalLink,
  Key,
  RotateCcw,
  Database
} from 'lucide-react';

interface CommercializationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBriefing?: () => void;
}

export const CommercializationModal: React.FC<CommercializationModalProps> = ({
  isOpen,
  onClose,
  onOpenBriefing
}) => {
  const {
    user,
    subscriptionTier,
    setSubscriptionTier,
    signInWithGoogle,
    signInWithGoogleRedirect,
    loginWithEmail,
    registerWithEmail,
    requestPasswordReset,
    quickDemoLogin,
    signOut,
    authError,
    clearAuthError
  } = useAuth();

  const [authTab, setAuthTab] = useState<'google' | 'email' | 'register' | 'key'>('google');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [licenseKeyInput, setLicenseKeyInput] = useState('');
  const [keyFeedback, setKeyFeedback] = useState<{ text: string; success: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Forgot Password flow state
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ text: string; success: boolean } | null>(null);

  if (!isOpen) return null;

  const handleTabChange = (tab: 'google' | 'email' | 'register' | 'key') => {
    setAuthTab(tab);
    setIsForgotPasswordMode(false);
    setResetFeedback(null);
    clearAuthError();
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogle();
      setActionSuccess('Successfully authenticated with Google!');
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRedirect = async () => {
    setIsSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogleRedirect();
    } catch {
      setIsSubmitting(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) return;
    setIsSubmitting(true);
    clearAuthError();
    try {
      if (authTab === 'register') {
        await registerWithEmail(emailInput, passwordInput, nameInput || emailInput.split('@')[0]);
        setActionSuccess('Account created and logged in!');
      } else {
        await loginWithEmail(emailInput, passwordInput);
        setActionSuccess('Signed in successfully!');
      }
      setTimeout(() => setActionSuccess(null), 3000);
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = resetEmailInput.trim() || emailInput.trim();
    if (!targetEmail) {
      setResetFeedback({
        text: 'Please enter a valid email address to request a reset link.',
        success: false
      });
      return;
    }

    setIsResetSubmitting(true);
    setResetFeedback(null);
    clearAuthError();

    try {
      const res = await requestPasswordReset(targetEmail);
      setResetFeedback({
        text: res.message,
        success: res.success
      });
      if (res.success) {
        setActionSuccess(`Password reset email triggered for ${targetEmail}`);
        setTimeout(() => setActionSuccess(null), 4000);
      }
    } catch (err: any) {
      setResetFeedback({
        text: err?.message || 'Unable to request password reset. Please try again.',
        success: false
      });
    } finally {
      setIsResetSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    quickDemoLogin();
    setActionSuccess('Demo Architect Mode activated with Enterprise Pro access!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleActivateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseKeyInput.trim()) return;
    const ok = activateLicenseKey(licenseKeyInput);
    if (ok) {
      setKeyFeedback({
        text: 'License key verified! Enterprise Architect Pro tier unlocked.',
        success: true
      });
      setSubscriptionTier('pro');
    } else {
      setKeyFeedback({
        text: 'Invalid license key. Try demo code: ZABORAA-PRO-2026',
        success: false
      });
    }
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    setActionSuccess(`Switched active tier to ${tier.toUpperCase()}`);
    setTimeout(() => setActionSuccess(null), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-start sm:items-center justify-center animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 p-5 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto text-xs text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Tool Commercialization & Architect Authentication Portal
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                  {subscriptionTier === 'pro'
                    ? 'PRO ARCHITECT'
                    : subscriptionTier === 'enterprise'
                    ? 'ENTERPRISE'
                    : 'COMMUNITY FREE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sign in with Google, register via email, or use instant demo mode to unlock enterprise sizing and blueprint export capabilities.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Feedback Banner */}
        {actionSuccess && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2.5 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {authError && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs flex items-center justify-between gap-2 shadow-md">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{authError}</span>
            </div>
            <button
              onClick={clearAuthError}
              className="text-xs text-rose-400 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* User Status Bar / Sign-in Tabs Container */}
        {user ? (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Architect'}
                  className="w-10 h-10 rounded-full border border-cyan-500/60 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold font-mono">
                  {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{user.displayName || 'Enterprise Architect'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                    {user.provider || 'cloud'} auth
                  </span>
                </div>
                <div className="text-slate-400 text-xs">{user.email || 'N/A'}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={signOut}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 shadow-inner">
            {/* Tab navigation */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleTabChange('google')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    authTab === 'google'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Google Sign-In
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('email')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    authTab === 'email'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Email Login
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('register')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    authTab === 'register'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  New Registration
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('key')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    authTab === 'key'
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  License Key
                </button>
              </div>

              {/* Instant Architect Demo Mode CTA */}
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102"
                title="Instant one-click demo login without credentials"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Demo Mode</span>
              </button>
            </div>

            {/* Google Tab */}
            {authTab === 'google' && (
              <div className="space-y-4 py-2">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Authenticate securely using your Google Workspace or personal Gmail credentials. Compatible with pop-up window verification as well as instant redirect fallback.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer hover:scale-102"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Google (Popup)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGoogleRedirect}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Redirect Flow</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 font-mono">
                  <Database className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Backed by Firebase Authentication & Supabase OAuth layer.</span>
                </div>
              </div>
            )}

            {/* Email Login Tab (With Forgot Password Flow) */}
            {authTab === 'email' && (
              <div className="max-w-md py-2 space-y-4">
                {!isForgotPasswordMode ? (
                  /* Standard Email/Password Form */
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="architect@enterprise-cloud.io"
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-slate-400">Password</label>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPasswordMode(true);
                            setResetEmailInput(emailInput);
                            setResetFeedback(null);
                          }}
                          className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Forgot password?</span>
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{isSubmitting ? 'Verifying...' : 'Sign In with Email'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                ) : (
                  /* Forgot Password Request Form */
                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-3.5 bg-slate-900/90 p-4 rounded-xl border border-cyan-500/30">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 text-cyan-300">
                        <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800">
                          <RotateCcw className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs">Reset Your Password</div>
                          <div className="text-[11px] text-slate-400">
                            Powered by Supabase Auth recovery services
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(false);
                          setResetFeedback(null);
                        }}
                        className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Enter your account email address below. We will send a secure password reset link via Supabase Auth and Firebase to help you reset your credentials.
                    </p>

                    <div>
                      <label className="text-[11px] font-mono text-slate-400 block mb-1">Account Email</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          value={resetEmailInput || emailInput}
                          onChange={(e) => setResetEmailInput(e.target.value)}
                          placeholder="architect@enterprise-cloud.io"
                          className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    {resetFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-start gap-2.5 ${
                          resetFeedback.success
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
                            : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                        }`}
                      >
                        {resetFeedback.success ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-snug">{resetFeedback.text}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isResetSubmitting}
                        className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>{isResetSubmitting ? 'Sending Reset Email...' : 'Send Password Reset Link'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPasswordMode(false);
                          setResetFeedback(null);
                        }}
                        className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Back to Login
                      </button>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1.5 pt-0.5">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Supabase Auth & Firebase Security Compliance</span>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Registration Tab */}
            {authTab === 'register' && (
              <form onSubmit={handleEmailAuth} className="space-y-3 py-2 max-w-md">
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Full Name or Title</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="Wasim Sayyed (Lead Cloud Architect)"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="architect@enterprise-cloud.io"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Create Architect Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {/* License Key Tab */}
            {authTab === 'key' && (
              <form onSubmit={handleActivateKey} className="space-y-3 py-2 max-w-md">
                <p className="text-xs text-slate-400">
                  Enter your client organization activation code to immediately unlock Pro capabilities.
                </p>

                <div className="relative">
                  <Key className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={licenseKeyInput}
                    onChange={(e) => setLicenseKeyInput(e.target.value)}
                    placeholder="Enter code (demo: ZABORAA-PRO-2026)"
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-mono uppercase placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {keyFeedback && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      keyFeedback.success
                        ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                        : 'bg-rose-950/80 border border-rose-800 text-rose-300'
                    }`}
                  >
                    {keyFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{keyFeedback.text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all shadow-md cursor-pointer"
                >
                  Validate & Unlock License
                </button>
              </form>
            )}
          </div>
        )}

        {/* Section: Commercial Subscription Tiers */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">
            Commercial Subscription Tiers for Tooling:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Free Community Tier */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Tier 1 · Starter
                </span>
                <div className="text-lg font-bold text-white">Community Free</div>
                <div className="text-2xl font-mono font-bold text-slate-300">
                  $0 <span className="text-xs text-slate-500 font-sans">/ forever</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Basic RVTools health assessment
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Standard Node & Storage Estimator
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Public architecture diagrams
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTier('free')}
                disabled={subscriptionTier === 'free'}
                className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white font-semibold text-xs cursor-pointer transition-colors"
              >
                {subscriptionTier === 'free' ? 'Current Active Tier' : 'Switch to Free'}
              </button>
            </div>

            {/* Pro Architect Tier */}
            <div className="p-4 rounded-xl bg-slate-950 border-2 border-cyan-500/70 space-y-3 flex flex-col justify-between shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 font-bold text-[9px] font-mono px-3 py-0.5 rounded-bl">
                MOST POPULAR
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                  Tier 2 · Architect Pro
                </span>
                <div className="text-lg font-bold text-white">Enterprise Architect</div>
                <div className="text-2xl font-mono font-bold text-cyan-300">
                  $99 <span className="text-xs text-slate-400 font-sans">/ month</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-900">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> High-precision RVTools Excel export
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Executive PDF & PPTX Runbook generator
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Nutanix NC2 & Aria flow analysis
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Custom branding & watermarks
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTier('pro')}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  subscriptionTier === 'pro'
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300 cursor-default'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md'
                }`}
              >
                {subscriptionTier === 'pro' ? 'Current Active Tier' : 'Upgrade to Pro'}
              </button>
            </div>

            {/* Enterprise Partner Tier */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Tier 3 · Strategic
                </span>
                <div className="text-lg font-bold text-white">Enterprise Custom</div>
                <div className="text-2xl font-mono font-bold text-slate-200">
                  Custom <span className="text-xs text-slate-500 font-sans">/ enterprise</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Dedicated 1-on-1 architecture review
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Custom on-prem migration tooling
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> SLA & multi-cluster automation
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onOpenBriefing) {
                    onClose();
                    onOpenBriefing();
                  }
                }}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs cursor-pointer transition-colors"
              >
                Request Architecture Briefing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
