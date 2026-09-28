"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, getSavedName, logout } from "@/lib/api";
import Avatar from "@/components/Avatar";

const BLUE = '#0066FF'
const GRAY = '#666'
const DARK = '#333'
const BORDER = '#F5F5F5'

interface Profile {
  fullName?: string
  vehicleType?: string
  driverTagNumber?: string
  verified?: boolean
  wallet?: { bankName?: string; accountName?: string; accountNumber?: string }
}

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F6F6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {children}
  </div>
)

const MenuItem = ({ icon, title, subtitle, onPress }: { icon: React.ReactNode; title: string; subtitle: string; onPress?: () => void }) => (
  <button onClick={onPress} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0', borderBottom: `1px solid ${BORDER}`, textAlign: 'left' }}>
    <IconBox>{icon}</IconBox>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 15, fontWeight: 500, color: DARK, margin: '0 0 2px' }}>{title}</p>
      {subtitle ? <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>{subtitle}</p> : null}
    </div>
    <ChevronRight />
  </button>
)

const SectionLabel = ({ label }: { label: string }) => (
  <p style={{ fontSize: 13, fontWeight: 500, color: GRAY, margin: '24px 0 4px' }}>{label}</p>
)

const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const ShieldIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const CardIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const ReceiptIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const ChartIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
const HelpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const FlagIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
const InfoIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const BankIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/><path d="M2 11l10-7 10 7"/></svg>

export default function DriverProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    api.driverProfile(getToken()).then(setProfile).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); router.push('/login') }

  const completionFactors = [Boolean(profile?.driverTagNumber), Boolean(profile?.wallet), Boolean(profile?.verified)]
  const completionPct = profile ? Math.round((completionFactors.filter(Boolean).length / completionFactors.length) * 100) : null

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: DARK }}>My Profile</span>
        <div style={{ width: 38 }} />
      </div>

      {/* PROFILE CARD */}
      <div style={{
        margin: '0 20px',
        borderRadius: 16,
        background: '#333',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        padding: '24px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{ position: 'relative' }}>
          <Avatar name={(profile?.fullName ?? getSavedName()) || 'Driver'} size={72} style={{ border: '2px solid rgba(255,255,255,0.3)' }} />
          {/* Bus Driver badge */}
          <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', background: 'white', borderRadius: 999, padding: '2px 10px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: DARK }}>{profile?.vehicleType ?? 'Driver'}</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'white', margin: '0 0 4px' }}>{(profile?.fullName ?? getSavedName()) || 'Driver'}</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Tag No. : {profile?.driverTagNumber ?? '—'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgb(87,255,106)', borderRadius: 999, padding: '5px 14px' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{profile?.verified ? 'Verified by OAU' : 'Pending Verification'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
      </div>

      {/* PROFILE COMPLETION */}
      <div style={{ margin: '14px 20px 0', background: 'white', border: '1px solid #F0F0F0', borderRadius: 14, padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: DARK, margin: 0 }}>
            {completionPct === null ? 'Loading profile completion...' : `Your profile is ${completionPct}% complete`}
          </p>
        </div>
        <p style={{ fontSize: 12, color: GRAY, margin: '0 0 10px' }}>Account Verification</p>
        <div style={{ height: 6, background: '#E5E7EB', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${completionPct ?? 0}%`, background: 'rgb(31,54,201)', borderRadius: 999 }} />
        </div>
      </div>

      {/* PAYOUT ACCOUNT */}
      <div style={{ margin: '14px 20px 0', background: 'white', border: '1px solid #F0F0F0', borderRadius: 14, padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <BankIcon />
          <span style={{ fontSize: 15, fontWeight: 600, color: DARK }}>Payout Account</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <p style={{ fontSize: 11, color: GRAY, margin: '0 0 2px' }}>Bank Name</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: DARK, margin: 0 }}>{profile?.wallet?.bankName ?? '—'}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: GRAY, margin: '0 0 2px' }}>Account Name</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: DARK, margin: 0 }}>{profile?.wallet?.accountName ?? '—'}</p>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <p style={{ fontSize: 11, color: GRAY, margin: '0 0 2px' }}>Account No.</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: DARK, margin: 0 }}>{profile?.wallet?.accountNumber ?? '—'}</p>
        </div>
        <button onClick={() => router.push('/bank-setup')} style={{ width: '100%', height: 44, borderRadius: 10, background: 'white', border: '1.5px solid #E5E7EB', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: DARK }}>
          {profile?.wallet ? 'Edit Account' : 'Add Bank Account'}
        </button>
      </div>

      {/* MY QR CODE */}
      <div style={{ margin: '14px 20px 0' }}>
        <button
          onClick={() => router.push('/my-qr-code')}
          style={{ width: '100%', height: 52, borderRadius: 14, background: 'white', border: '1px solid #F0F0F0', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: DARK, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 17h.01M14 20h3v-3M20 17h.01M20 20h.01"/>
          </svg>
          My Payment QR Code
        </button>
      </div>

      {/* MENU */}
      <div style={{ padding: '0 20px', flex: 1 }}>

        <SectionLabel label="Account Settings" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<UserIcon />} title="Personal Information" subtitle="Update your name and details" onPress={() => router.push('/personal-information')} />
          <MenuItem icon={<ShieldIcon />} title="Security Settings" subtitle="Change password & PIN" onPress={() => router.push('/security-settings')} />
          <MenuItem icon={<CardIcon />} title="Payment Methods" subtitle="Manage funding options" />
        </div>

        <SectionLabel label="Activity & Preferences" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<ReceiptIcon />} title="Transaction History" subtitle="View all payments" onPress={() => router.push('/transaction-history')} />
          <MenuItem icon={<ChartIcon />} title="Earnings Summary" subtitle="View your earnings breakdown" onPress={() => router.push('/driver-earnings')} />
        </div>

        <SectionLabel label="Support Section" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<HelpIcon />} title="Help & Support" subtitle="Get assistance" />
          <MenuItem icon={<FlagIcon />} title="Report an Issue" subtitle="Report passenger or payment issues" onPress={() => router.push('/report-issue')} />
        </div>

        <SectionLabel label="About Section" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<InfoIcon />} title="About OWA" subtitle="" />
          <MenuItem icon={<LockIcon />} title="Terms & Privacy Policy" subtitle="" />
        </div>

        {/* LOG OUT */}
        <button onClick={handleLogout} style={{ width: '100%', marginTop: 28, marginBottom: 16, height: 52, borderRadius: 14, background: 'rgb(252,239,239)', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'rgb(249,66,66)' }}>
          Log Out
        </button>
      </div>

      {/* BOTTOM NAV — 4 items */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderTop: '1px solid #F0F0F0', display: 'flex', padding: '10px 0 20px', zIndex: 100 }}>
        {[
          { id: 'home', label: 'Home', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? BLUE : 'none'} stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
          { id: 'earnings', label: 'Earnings', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
          { id: 'transactions', label: 'Transactions', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
          { id: 'profile', label: 'Profile', icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        ].map(({ id, label, icon }) => (
          <button key={id} onClick={() => router.push(({ home: '/driver-dashboard', earnings: '/driver-earnings', transactions: '/transaction-history', profile: '/driver-profile' } as Record<string, string>)[id])} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
            {icon(id === 'profile')}
            <span style={{ fontSize: 10, fontWeight: 500, color: id === 'profile' ? BLUE : '#666' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
