import React, { useState } from 'react';
import { useAuth, SubscriptionTier } from '../context/AuthContext';
import { EmailAuthForm } from './auth/EmailAuthForm';
import { LicenseKeyForm } from './auth/LicenseKeyForm';
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
    downgradeToFree,
    signOut,
    isCommercializeModalOpen,
    setIsCommercializeModalOpen,
    clearAuthError
  } = useAuth();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
  const [tierNotice, setTierNotice] = useState<string | null>(null);

  if (!isCommercializeModalOpen) return null;

  const handleSelectTier = async (tier: SubscriptionTier) => {
    setTierNotice(null);
    if (tier === subscriptionTier) return;
    if (!user) {
      setTierNotice('Sign in or create an account above to manage your plan.');
      return;
    }
    if (tier === 'free') {
      const ok = await downgradeToFree();
      if (ok) {
        setUpgradeSuccess('Your account is now on the FREE plan.');
        setTimeout(() => setUpgradeSuccess(null), 3000);
      } else {
        setTierNotice('Unable to change your plan right now. Please try again.');
      }
      return;
    }
    setTierNotice(
      `Online checkout for the ${tier.toUpperCase()} plan is coming soon. Activate it now with a license key below.`
    );
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
                    Account: {user.email}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="font-bold text-white text-sm flex items-center gap-2">
                  <span>Sign Up / Log In</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-semibold">
                    Instant Access
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Create an account with your email to unlock cloud projects, sync saved TCO sizing models, and manage client licenses.
                </p>
              </div>
            )}

            {user && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={signOut}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950 hover:text-rose-300 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {user ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <LicenseKeyForm />
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <EmailAuthForm />
            </div>
          )}

          {tierNotice && (
            <div role="status" className="p-3.5 rounded-xl bg-cyan-950/70 border border-cyan-700 text-cyan-100 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
              <span>{tierNotice}</span>
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
