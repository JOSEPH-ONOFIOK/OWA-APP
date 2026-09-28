"use client";

import { useRouter } from "next/navigation";

const BellIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

export default function Notifications() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Notification</span>
      </div>

      {/* EMPTY STATE — no notifications endpoint exists on the backend yet */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: 24, background: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <BellIcon />
        </div>
        <p style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Notifications aren&apos;t available yet</p>
        <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.5 }}>Check back soon — we&apos;re working on this.</p>
      </div>
    </div>
  )
}
