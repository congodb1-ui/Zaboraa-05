import React, { useState } from 'react';
import { useAuth, SubscriptionTier } from '../context/AuthContext';
import {
  X,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  CreditCard,
  Building,
  Briefcase,
  Users,
  FileSpreadsheet,
  Lock,
  ArrowRight,
  Check,
  Cpu,
  LogOut,
  AlertCircle
} from 'lucide-react';

export const CommercializeModal: React.FC = () => {
  const {
    user,
    subscriptionTier,
    setSubscriptionTier,
    signInWithGoogle,
    signOut,
    isCommercializeModalOpen,
    setIsCommercializeModalOpen,
    authError,
    clearAuthError
  } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);

  if (!isCommercializeModalOpen) return null;

  const handleGoogleAuth = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      // Handled in context
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    setUpgradeSuccess(`Successfully updated subscription to ${tier.toUpperCase()} tier!`);
    setTimeout(() => setUpgradeSuccess(null), 3000);
  };

  const tiers = [
    {
      id: 'free' as SubscriptionTier,
      name: 'Community Explorer',
      badge: 'Free Tier',
      price: '$0',
      period: 'forever',
      description: 'Ideal for independent architects evaluating single clusters or learning multi-cloud migration topologies.',
      features: [
        'RVTools inventory analysis up to 50 VMs',
        'Basic node sizing estimation for AVS & GCVE',
        'Web-based architecture diagrams with hotspots',
        'Standard disaster recovery RPO/RTO calculations',
        'Community discussion & knowledge base access'
      ],
      cta: 'Current Default',
      highlighted: false
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Professional Consultant',
      badge: 'Most Popular',
      price: billingCycle === 'annual' ? '$119' : '$149',
      period: '/month',
      description: 'For pre-sales architects and cloud consultants building client-facing business cases and migration waves.',
      features: [
        'Unlimited VM inventory ingestion across multi-vCenter files',
        'Automated 3-way cost modeling: AVS vs GCVE vs VMC vs Nutanix',
        'Executive 2-Page Branded PDF Runbooks with TCO calculations',
        'RVTools HCX migration wave planning & Excel batch exports',
        'Decoupled Azure NetApp Files & Amazon FSx storage calculators',
        'Email architecture support with 24-hour turnaround'
      ],
      cta: 'Upgrade to Pro Consultant',
      highlighted: true
    },
    {
      id: 'enterprise' as SubscriptionTier,
      name: 'Global Practice License',
      badge: 'Enterprise SI',
      price: billingCycle === 'annual' ? '$399' : '$499',
      period: '/month',
      description: 'Designed for System Integrators (SIs), MSPs, and hyperscaler consulting practices delivering recurring migrations.',
      features: [
        'Complete white-label client dossiers with custom corporate branding',
        'Remove default watermark & apply custom practice watermark',
        'Production Terraform & Azure Bicep IaC template export',
        'Multi-seat license for up to 10 enterprise architects',
        'Direct REST API access for automated CI/CD sizing ingestion',
        'Quarterly 1-on-1 advisory session with Lead Architect Wasim Sayyed'
      ],
      cta: 'Deploy Practice License',
      highlighted: false
    }
  ];

  const advisoryPackages = [
    {
      title: 'Architectural Migration Audit',
      fee: '$4,500',
      duration: '1-Week Engagement',
      deliverable: 'End-to-end workload analysis, HCX network extension design, right-sizing BOM, and formal certification signed by Lead Architect.'
    },
    {
      title: 'Cutover & Disaster Recovery Readiness',
      fee: '$12,500',
      duration: '3-Week Engagement',
      deliverable: 'Automated SRM/DRAAS runbook construction, live replication verification, NSX-T micro-segmentation ruleset, and cutover weekend on-call support.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 lg:p-10 flex items-center justify-center animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-8 my-auto max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80">
                COMMERCIALIZATION & PRACTICE LICENSING
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Monetize Engineering Tools</span>
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5 tracking-tight">
              Commercialize Your Advisory & Tools Practice
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monetize the RVTools Migration Engine, Node Sizing Tool, Disaster Recovery TCO Planner, and Custom Architecture Deliverables.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              clearAuthError();
              setIsCommercializeModalOpen(false);
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="space-y-8 overflow-y-auto flex-1 pr-1">
          {/* User Authentication Status Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            {user ? (
              <div className="flex items-center gap-3.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User Avatar'}
                    className="w-11 h-11 rounded-full border-2 border-cyan-400 object-cover shrink-0 shadow-md"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 flex items-center justify-center font-bold text-base shrink-0">
                    {user.email ? user.email[0].toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      {user.displayName || user.email}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/80 uppercase font-bold">
                      {subscriptionTier} PLAN ACTIVE
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Google Account: {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>Sign Up / Log In with Google</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                    Instant Access
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your Google account to unlock cloud projects, sync saved TCO sizing models, and manage client licenses.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 shrink-0">
              {user ? (
                <button
                  type="button"
                  onClick={signOut}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSigningIn}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center gap-2.5 transition-all shadow-lg hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                >
                  {/* Google Icon SVG */}
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isSigningIn ? 'Connecting Google...' : 'Continue with Google'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Auth Error Notification */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{authError}</span>
              </div>
              <button onClick={clearAuthError} className="p-1 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Upgrade Success Notification */}
          {upgradeSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{upgradeSuccess}</span>
            </div>
          )}

          {/* Billing Interval Toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
              Monthly Invoicing
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 rounded-full bg-slate-800 p-1 flex items-center transition-colors cursor-pointer border border-slate-700"
            >
              <div
                className={`w-4 h-4 rounded-full bg-cyan-400 transition-transform ${
                  billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingCycle === 'annual' ? 'text-cyan-300' : 'text-slate-400'}`}>
              <span>Annual Practice (Save 20%)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                PROMO
              </span>
            </span>
          </div>

          {/* SaaS Pricing Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const isCurrent = subscriptionTier === tier.id;
              return (
                <div
                  key={tier.id}
                  className={`rounded-2xl p-6 flex flex-col justify-between border transition-all duration-200 ${
                    tier.highlighted
                      ? 'bg-slate-900/90 border-cyan-400 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {tier.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700">
                          ACTIVE PLAN
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tier.description}</p>
                    </div>

                    <div className="pt-2">
                      <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                      <span className="text-xs text-slate-400 font-mono ml-1">{tier.period}</span>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                      <div className="text-[11px] font-mono uppercase text-slate-400 font-bold">
                        Included Features:
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => handleSelectTier(tier.id)}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                        isCurrent
                          ? 'bg-slate-800 text-slate-300 border border-slate-700 cursor-default'
                          : tier.highlighted
                          ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-cyan-500/20'
                          : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active Subscription</span>
                        </>
                      ) : (
                        <>
                          <span>{tier.cta}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* High-Ticket Advisory Retainers Section */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  <span>High-Ticket Enterprise Advisory Retainers</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Comprehensive custom delivery packages for mission-critical enterprise datacenter migrations.
                </p>
              </div>
              <span className="text-[11px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 self-start sm:self-auto">
                B2B Advisory Revenue
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advisoryPackages.map((pkg, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{pkg.title}</span>
                    <span className="font-extrabold text-cyan-400 text-base">{pkg.fee}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    Duration: {pkg.duration}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {pkg.deliverable}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Secure billing powered by Stripe. Cancel anytime with 1-click.</span>
          </div>
          <button
            type="button"
            onClick={() => setIsCommercializeModalOpen(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
