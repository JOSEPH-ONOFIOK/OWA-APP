"use client";

import { useRouter } from "next/navigation";

const BLUE = '#0066FF'

export default function DriverSubmitted() {
  const router = useRouter()

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' }}>

      {/* Checkmark circle */}
      <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>

      {/* Text */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: '0 0 12px', textAlign: 'center' }}>
        Application Submitted!
      </h1>
      <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 1.7, margin: '0 0 12px', maxWidth: 300 }}>
        Your documents and vehicle details are under review. We&apos;ll notify you once approved.
      </p>
      <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', margin: '0 0 48px' }}>
        This usually takes 24–48 hours.
      </p>

      {/* Steps */}
      <div style={{ width: '100%', background: '#f9fafb', borderRadius: 20, padding: '20px', marginBottom: 40 }}>
        {[
          { label: 'Application received', done: true },
          { label: 'Document verification', done: false },
          { label: 'OAU approval', done: false },
          { label: 'Account activated', done: false },
        ].map(({ label, done }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBlock: 10, borderBottom: i < 3 ? '1px solid #f3f4f6' : 'none' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? '#22c55e' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af' }}>{i + 1}</span>
              )}
            </div>
            <span style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? '#111827' : '#9ca3af' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Dashboard button */}
      <button
        onClick={() => router.push('/driver-dashboard')}
        style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        Go to Dashboard
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  )
}
