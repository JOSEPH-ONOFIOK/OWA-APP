"use client";

import { useRouter } from "next/navigation";

const DARK = '#333'
const GRAY = '#666'
const BORDER = '#F5F5F5'

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 40, height: 40, borderRadius: 10, background: '#F6F6F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {children}
  </div>
)

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const LockIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
const PinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 018 0v3"/><circle cx="12" cy="15" r="1.5"/></svg>

const MenuItem = ({ icon, title, subtitle, onPress }: { icon: React.ReactNode; title: string; subtitle: string; onPress: () => void }) => (
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

export default function SecuritySettings() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: DARK }}>Security Settings</span>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ background: '#EEF4FF', border: '1px solid #C9DCFF', borderRadius: 14, padding: '14px 16px', marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.5 }}>
            Once you change either your password or transaction PIN, your previous one will be nullified.
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 12 }}>
          <MenuItem icon={<LockIcon />} title="Change Password" subtitle="Update your login password" onPress={() => router.push('/change-password')} />
          <MenuItem icon={<PinIcon />} title="Change Transaction PIN" subtitle="Set a new payment PIN" onPress={() => router.push('/setup-pin')} />
        </div>
      </div>
    </div>
  )
}
