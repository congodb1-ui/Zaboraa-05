import React, { useId, useState } from 'react';
import { Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LicenseKeyForm: React.FC<{ inputRef?: React.Ref<HTMLInputElement> }> = ({ inputRef }) => {
  const { user, redeemLicenseKey } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const id = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyInput.trim()) return;
    if (!user) {
      setMessage({ text: 'Sign in first to activate a license key on your account.', success: false });
      return;
    }
    setSubmitting(true);
    const tier = await redeemLicenseKey(keyInput);
    setSubmitting(false);
    if (tier) {
      setMessage({ text: `License activated. Your account is now on the ${tier.toUpperCase()} plan.`, success: true });
      setKeyInput('');
    } else {
      setMessage({ text: 'That license key is invalid or no longer active.', success: false });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor={`${id}-key`} className="font-semibold text-white text-sm flex items-center gap-2">
          <Key className="w-4 h-4 text-amber-400" aria-hidden="true" />
          <span>Activate License Key</span>
        </label>
        <span className="text-[10px] font-mono text-slate-400">Demo key: ZABORAA-PRO-2026</span>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          id={`${id}-key`}
          ref={inputRef}
          type="text"
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          placeholder="ZABORAA-PRO-2026"
          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono text-xs uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500/60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-sm disabled:opacity-60"
        >
          {submitting ? 'Activating...' : 'Activate Key'}
        </button>
      </form>
      {message && (
        <div
          role={message.success ? 'status' : 'alert'}
          className={`p-2.5 rounded-lg border text-xs font-mono ${
            message.success ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300' : 'bg-rose-950/80 border-rose-500/60 text-rose-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};
