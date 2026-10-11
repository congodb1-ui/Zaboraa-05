import React, { useRef } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Lock,
  ArrowRight,
  Key,
  Calendar,
  Layers,
  FileSpreadsheet,
  FileText,
  LogOut,
  UserCheck,
  CreditCard,
  Building2,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmailAuthForm } from './auth/EmailAuthForm';
import { LicenseKeyForm } from './auth/LicenseKeyForm';

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
  const { user: currentUser, subscriptionTier: licenseTier, signOut, downgradeToFree } = useAuth();
  const licenseInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 my-auto max-h-[90vh] overflow-y-auto text-xs text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Tool Commercialization & Enterprise Access
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                  {licenseTier === 'enterprise' ? 'ENTERPRISE' : licenseTier === 'pro' ? 'PRO ARCHITECT' : 'COMMUNITY FREE'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monetize your VMware cloud engineering tools, and manage client licenses.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Account Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-semibold">
              <UserCheck className="w-4 h-4 text-cyan-400" />
              <span>Account</span>
            </div>
            {currentUser ? (
              <p className="text-xs text-slate-400">
                Signed in as <strong className="text-cyan-300">{currentUser.displayName}</strong> ({currentUser.email})
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                Sign up with your work email to sync assessments, save custom blueprints, and unlock pro exports.
              </p>
            )}
          </div>

          {currentUser && (
            <button
              type="button"
              onClick={signOut}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
        {!currentUser && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <EmailAuthForm />
          </div>
        )}

        {/* Section 2: Commercial Pricing Tiers */}
        <div className="space-y-3">
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
                <div className="text-2xl font-mono font-bold text-slate-300">$0 <span className="text-xs text-slate-500 font-sans">/ forever</span></div>
                <ul className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Basic RVTools health assessment</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Standard Node & Storage Estimator</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-slate-500" /> Public architecture diagrams</li>
                </ul>
              </div>
              <button
                type="button"
                disabled={licenseTier === 'free' || !currentUser}
                onClick={() => void downgradeToFree()}
                className="w-full py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-xs enabled:hover:text-white enabled:cursor-pointer disabled:cursor-default"
              >
                {licenseTier === 'free' ? 'Current Active Tier' : 'Downgrade'}
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
                <div className="text-2xl font-mono font-bold text-cyan-300">$99 <span className="text-xs text-slate-400 font-sans">/ month</span></div>
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-900">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Unlimited RVTools wave grouping & exports</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Formal 2-Page Executive DR PDF reports</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Color-coded Excel sizing comparisons</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Nutanix NC2 TCO assessment engine</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  licenseInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  licenseInputRef.current?.focus();
                }}
                className={`w-full py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                  licenseTier !== 'free'
                    ? 'bg-cyan-950 border border-cyan-500 text-cyan-300'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md'
                }`}
              >
                {licenseTier !== 'free' ? 'Active Pro License' : 'Upgrade to Pro ($99/mo)'}
              </button>
            </div>

            {/* Hyperscaler Consulting Practice Tier */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  Tier 3 · Consulting Firm
                </span>
                <div className="text-lg font-bold text-white">Hyperscaler Practice</div>
                <div className="text-2xl font-mono font-bold text-indigo-300">$499 <span className="text-xs text-slate-400 font-sans">/ month</span></div>
                <ul className="space-y-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> White-label client PDF branding & logo</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Multi-tenant assessment workspace</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Monthly 1-on-1 strategy call with Wasim</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Dedicated custom watermark branding</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenBriefing) onOpenBriefing();
                }}
                className="w-full py-2 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-700 text-indigo-200 font-bold text-xs cursor-pointer"
              >
                Contact for Practice Tier
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Commercial Services & High-Value Engagements */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Turnkey Commercial Architecture Engagements</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Fixed-Price Delivery</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white">Full Migration Wave Assessment</div>
              <div className="text-xs font-mono text-emerald-300 font-semibold">$15,000 fixed price</div>
              <p className="text-[11px] text-slate-400">End-to-end RVTools audit, HCX network design, and wave runbook sequencing.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white">Zero-Trust NSX Microsegmentation</div>
              <div className="text-xs font-mono text-emerald-300 font-semibold">$8,500 fixed price</div>
              <p className="text-[11px] text-slate-400">Aria flow discovery, DFW security grouping, and policy audit.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="font-bold text-white">1-on-1 Architectural Review</div>
              <div className="text-xs font-mono text-emerald-300 font-semibold">$1,500 per briefing</div>
              <p className="text-[11px] text-slate-400">Direct 2-hour technical deep dive with Principal Architect Wasim Sayyed.</p>
            </div>
          </div>
        </div>

        {/* Section 4: License Key Activation */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <LicenseKeyForm inputRef={licenseInputRef} />
        </div>
      </div>
    </div>
  );
};
