import React, { useId, useState } from 'react';
import { AlertCircle, CheckCircle2, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const EmailAuthForm: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const id = useId();

  const switchMode = () => {
    clearAuthError();
    setNotice(null);
    setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setSubmitting(true);
    try {
      if (mode === 'sign-in') {
        await signInWithEmail(email, password);
      } else {
        const result = await signUpWithEmail(email, password, displayName);
        if (result?.needsConfirmation) {
          setNotice('Account created. Check your inbox to confirm your email, then sign in.');
          setPassword('');
          setMode('sign-in');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 focus:border-cyan-500';

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3" aria-describedby={authError ? `${id}-error` : undefined}>
      <div className="flex flex-col sm:flex-row gap-3">
        {mode === 'sign-up' && (
          <div className="flex-1 space-y-1">
            <label htmlFor={`${id}-name`} className="text-[11px] font-mono uppercase text-slate-400">
              Display name
            </label>
            <input
              id={`${id}-name`}
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Jane Architect"
              className={inputClass}
            />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <label htmlFor={`${id}-email`} className="text-[11px] font-mono uppercase text-slate-400">
            Email
          </label>
          <input
            id={`${id}-email`}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div className="flex-1 space-y-1">
          <label htmlFor={`${id}-password`} className="text-[11px] font-mono uppercase text-slate-400">
            Password
          </label>
          <input
            id={`${id}-password`}
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>
      </div>

      {authError && (
        <div id={`${id}-error`} role="alert" className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
          <span>{authError}</span>
        </div>
      )}
      {notice && (
        <div role="status" className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <span>{notice}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <button
          type="button"
          onClick={switchMode}
          className="text-xs text-slate-400 hover:text-cyan-300 underline-offset-2 hover:underline cursor-pointer self-start"
        >
          {mode === 'sign-in' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mode === 'sign-in' ? <LogIn className="w-4 h-4" aria-hidden="true" /> : <UserPlus className="w-4 h-4" aria-hidden="true" />}
          <span>
            {submitting ? 'Please wait...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}
          </span>
        </button>
      </div>
    </form>
  );
};
