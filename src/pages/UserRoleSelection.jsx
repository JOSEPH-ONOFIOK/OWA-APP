import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function UserRoleSelection() {
  const [selected, setSelected] = useState('passenger')
  const navigate = useNavigate()

  const passengerIcon = (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )
  const driverIcon = (active) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '56px 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 32px 40px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 8 }}>Are you a passenger or a driver?</h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 48 }}>You can change the mode later</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 8 }}>
          {[
            { id: 'passenger', label: 'Passenger', icon: passengerIcon },
            { id: 'driver', label: 'Driver', icon: driverIcon },
          ].map(({ id, label, icon }) => {
            const active = selected === id
            return (
              <button
                key={id}
                onClick={() => setSelected(id)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 12, padding: '32px 16px', borderRadius: 16,
                  border: `2px solid ${active ? '#1A6BFF' : '#e5e7eb'}`,
                  background: 'white', cursor: 'pointer',
                }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: active ? '#eff6ff' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icon(active)}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: active ? '#1A6BFF' : '#6b7280' }}>{label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 48 }}>
          <button onClick={() => navigate('/signup', { state: { role: selected } })} style={{ width: '100%', height: 56, borderRadius: 999, background: '#1A6BFF', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
