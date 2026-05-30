import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const personIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const carIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>

const inputStyle = {
  width: '100%', height: 56, borderRadius: 16,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box',
}

const Label = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
    {icon}
    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{text}</span>
  </div>
)

export default function DriverInfo() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ tag: '', vehicle: '' })
  const [sheet, setSheet] = useState(false)
  const canContinue = form.tag.trim() && form.vehicle.trim()

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Header row */}
      <div style={{ padding: '56px 24px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Additional Information</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '40px 32px 40px' }}>

        {/* Profile picture */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', border: '2px solid #0066FF', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <button type="button" onClick={() => setSheet(true)} style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: '#e5e7eb', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          <div>
            <Label icon={personIcon} text="Driver Tag Number" />
            <input type="text" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="Enter your tag number" style={inputStyle} />
          </div>
          <div>
            <Label icon={carIcon} text="Vehicle Type (Bus / Bike / Keke)" />
            <input type="text" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} placeholder="Enter your vehicle type" style={inputStyle} />
          </div>
        </div>

        {/* Continue button */}
        <div style={{ paddingTop: 40 }}>
          <button onClick={() => navigate('/bank-setup', { state })} style={{ width: '100%', height: 56, borderRadius: 999, background: canContinue ? '#0066FF' : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            Continue
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      {sheet && (
        <>
          <div onClick={() => setSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '24px 24px 0 0', zIndex: 50, padding: '20px 32px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Profile picture</span>
              <button onClick={() => setSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {[
              { label: 'Take picture', color: '#1f2937', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg> },
              { label: 'Choose from gallery', color: '#1f2937', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg> },
              { label: 'Delete picture', color: '#ef4444', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg> },
            ].map(({ label, color, icon }) => (
              <button key={label} onClick={() => setSheet(false)} style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', padding: '16px 0', borderBottom: '1px solid #f3f4f6', background: 'none', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                {icon}
                <span style={{ fontSize: 14, fontWeight: 500, color }}>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

