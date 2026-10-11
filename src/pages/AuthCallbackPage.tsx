import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsCommercializeModalOpen } = useAuth();
  const [status, setStatus] = useState<'working' | 'confirmed' | 'error'>('working');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      setStatus('error');
      return;
    }
    let cancelled = false;
    // getSession waits for supabase-js to finish exchanging the ?code= in the URL.
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      if (data.session) {
        navigate('/', { replace: true });
      } else {
        setStatus('confirmed');
      }
    });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
        {status === 'working' && <p className="text-sm text-slate-300">Completing sign-in...</p>}
        {status === 'confirmed' && (
          <>
            <h1 className="text-lg font-bold text-white">Email confirmed</h1>
            <p className="text-sm text-slate-400">Your email is verified. Sign in to continue.</p>
            <button
              type="button"
              onClick={() => {
                navigate('/', { replace: true });
                setIsCommercializeModalOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Sign In
            </button>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-lg font-bold text-white">This link is invalid or expired</h1>
            <p className="text-sm text-slate-400">Request a new confirmation email by signing up again.</p>
            <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold">
              Back to home
            </Link>
          </>
        )}
      </div>
    </main>
  );
};
