'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, Bell, ChevronLeft, Users, Sparkles } from 'lucide-react';
import { useVerification } from '@/lib/context/VerificationContext';
import { ResponsiveSheet } from '@/components/ui/ResponsiveSheet';
import { FamilyMember } from '@/types/user';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, activeFamilyMember, selectFamilyMember, alerts } = useVerification();

  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const activeAlertCount = alerts.filter((a) => a.active).length;

  if (
    pathname === '/onboarding' ||
    pathname === '/login' ||
    pathname === '/' ||
    pathname === '/prescription/capture' ||
    pathname === '/medicine/scan'
  ) {
    return null;
  }

  const isHome = pathname === '/dashboard';
  const showBack = !isHome;

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dawai Suraksha';
    if (pathname.startsWith('/doctor')) return 'Doctor Portal';
    if (pathname.startsWith('/patient')) return 'Patient Portal';
    if (pathname.startsWith('/pharmacy')) return 'Pharmacy Verification';
    if (pathname === '/prescription/results') return 'Prescription Details';
    if (pathname === '/prescription/confirm') return 'Confirm Prescription';
    if (pathname === '/medicine/verify') return 'Product Verification';
    if (pathname === '/match') return 'Prescription Match';
    if (pathname === '/safety') return 'Safety Report';
    if (pathname === '/history') return 'Verification History';
    if (pathname === '/alerts') return 'Safety Alerts';
    if (pathname === '/interactions') return 'Interaction Check';
    if (pathname === '/records') return 'Health Records Vault';
    if (pathname.startsWith('/health-guide/conditions')) return 'Condition Care Guide';
    if (pathname.startsWith('/health-guide/medicines')) return 'Medicines Directory';
    if (pathname.startsWith('/health-guide')) return 'Health Guide & Conditions';
    if (pathname === '/about') return 'About Dawai Suraksha';
    if (pathname === '/admin') return 'Admin Portal';
    return 'Dawai Suraksha';
  };

  const rawMembers = user?.family_members;
  const familyMemberList: FamilyMember[] = (Array.isArray(rawMembers) && rawMembers.length > 0)
    ? rawMembers.map((m: any, idx: number) => {
        if (typeof m === 'string') {
          return { id: `fam_${idx}`, name: m, relation: 'Family' };
        }
        return {
          id: m?.id || `fam_${idx}`,
          name: m?.name || 'Member',
          relation: m?.relation || 'Family',
        };
      })
    : [
        { id: 'self', name: 'Varun (Self)', relation: 'Self' },
        { id: 'f_1', name: 'Ramesh Sharma (Father)', relation: 'Father' },
        { id: 'f_2', name: 'Priya Sharma (Spouse)', relation: 'Spouse' },
      ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl text-[#0F172A] shadow-xs border-b border-slate-200 h-14 shrink-0">
        <div className="w-full max-w-[480px] md:max-w-none mx-auto px-4 h-full flex items-center justify-between">
          {/* Left: Back Button or Logo */}
          <div className="flex items-center gap-2">
            {showBack ? (
              <button
                onClick={() => router.back()}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95 transition-all flex items-center gap-1 text-xs font-bold border border-slate-200"
              >
                <ChevronLeft className="w-4 h-4 text-[#0F766E]" /> Back
              </button>
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0F766E] to-[#0D9488] text-white font-black flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </Link>
            )}
            <span className="font-extrabold text-sm tracking-tight text-slate-900">
              {getPageTitle()}
            </span>
          </div>

          {/* Right Action: Family Switcher Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFamilyModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold hover:bg-slate-200 active:scale-95 transition-all shadow-xs"
            >
              <Users className="w-3.5 h-3.5 text-[#0F766E]" />
              <span className="text-slate-700 truncate max-w-[85px]">
                {activeFamilyMember?.name ? activeFamilyMember.name.split(' ')[0] : 'Self'}
              </span>
            </button>

            <Link
              href="/alerts"
              className="relative p-2 rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 active:scale-95 text-slate-700 transition-all"
              title="Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E11D48] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-sm">
                  {activeAlertCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Family Member Switcher Modal Sheet */}
      <ResponsiveSheet
        isOpen={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        title="Select Person to Verify For"
      >
        <div className="space-y-2">
          <p className="text-xs text-[#66756E]">
            Prescription verification reports will be logged for the selected family profile.
          </p>
          {familyMemberList.map((member) => {
            const isSelected = (activeFamilyMember?.id || 'self') === member.id;
            const displayName = member.name || 'Family Member';

            return (
              <div
                key={member.id}
                onClick={() => {
                  selectFamilyMember(member);
                  setShowFamilyModal(false);
                }}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-teal-50 border-[#0F766E] font-semibold text-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      isSelected ? 'bg-[#0F766E] text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{displayName}</p>
                    <p className="text-[10px] text-slate-500">{member.relation || 'Family'}</p>
                  </div>
                </div>
                {isSelected && <span className="text-xs font-bold text-[#16C784]">✓ Active</span>}
              </div>
            );
          })}
        </div>
      </ResponsiveSheet>
    </>
  );
};
