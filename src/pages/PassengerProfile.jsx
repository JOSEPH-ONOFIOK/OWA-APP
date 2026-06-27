import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, getToken, getSavedName, logout } from '../api'
import avatarMe from '../assets/images/figma-avatar-ijandipe.png'

const BLUE = '#0066FF'
const GRAY = '#666'
const DARK = '#333'
const BORDER = '#F5F5F5'

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const IconBox = ({ children }) => (
  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F6F6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {children}
  </div>
)

const MenuItem = ({ icon, title, subtitle, onPress }) => (
  <button
    onClick={onPress}
    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0', borderBottom: `1px solid ${BORDER}`, textAlign: 'left' }}
  >
    <IconBox>{icon}</IconBox>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: 15, fontWeight: 500, color: DARK, margin: '0 0 2px' }}>{title}</p>
      <p style={{ fontSize: 13, color: GRAY, margin: 0 }}>{subtitle}</p>
    </div>
    <ChevronRight />
  </button>
)

const SectionLabel = ({ label }) => (
  <p style={{ fontSize: 13, fontWeight: 500, color: GRAY, margin: '24px 0 4px' }}>{label}</p>
)

// Icon SVGs
const UserIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const ShieldIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
const CardIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
const ReceiptIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const BellIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
const HelpIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const FlagIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
const InfoIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>

export default function PassengerProfile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    api.userProfile(getToken()).then(setProfile).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
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
        <img src={avatarMe} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'white', margin: '0 0 4px' }}>{profile?.fullName ?? getSavedName() || 'Student'}</p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{profile?.phone ?? '—'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgb(87,255,106)', borderRadius: 999, padding: '5px 14px' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{profile?.verified ? 'Verified' : 'Pending'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
      </div>

      {/* MENU */}
      <div style={{ padding: '0 20px', flex: 1 }}>

        <SectionLabel label="Account Settings" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<UserIcon />} title="Personal Information" subtitle="Update your name and details" />
          <MenuItem icon={<ShieldIcon />} title="Security Settings" subtitle="Change password & PIN" onPress={() => navigate('/setup-pin')} />
          <MenuItem icon={<CardIcon />} title="Payment Methods" subtitle="Manage funding options" />
        </div>

        <SectionLabel label="Activity & Preferences" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<ReceiptIcon />} title="Transaction History" subtitle="View all payments" />
          <MenuItem icon={<BellIcon />} title="Notifications" subtitle="Manage alerts" />
        </div>

        <SectionLabel label="Support Section" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<HelpIcon />} title="Help & Support" subtitle="Get assistance" />
          <MenuItem icon={<FlagIcon />} title="Report an Issue" subtitle="Report driver or payment issues" />
        </div>

        <SectionLabel label="About Section" />
        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<InfoIcon />} title="About OWA" subtitle="" />
          <MenuItem icon={<LockIcon />} title="Terms & Privacy Policy" subtitle="" />
        </div>

        {/* LOG OUT */}
        <button
          onClick={handleLogout}
          style={{ width: '100%', marginTop: 28, marginBottom: 16, height: 52, borderRadius: 14, background: 'rgb(252,239,239)', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'rgb(249,66,66)' }}
        >
          Log Out
        </button>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderTop: '1px solid #F0F0F0', display: 'flex', padding: '10px 0 20px', zIndex: 100 }}>
        {[
          { id: 'home', label: 'Home', icon: active => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? BLUE : 'none'} stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
          { id: 'transactions', label: 'Transactions', icon: active => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
          { id: 'profile', label: 'Profile', icon: active => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        ].map(({ id, label, icon }) => (
          <button key={id} onClick={() => id === 'home' && navigate('/dashboard')} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
            {icon(id === 'profile')}
            <span style={{ fontSize: 11, fontWeight: 500, color: id === 'profile' ? BLUE : '#666' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
