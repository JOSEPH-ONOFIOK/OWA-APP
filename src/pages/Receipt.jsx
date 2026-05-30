import { useNavigate, useLocation } from 'react-router-dom'
import avatarYusuf from '../assets/images/figma-avatar-yusuf.png'

const BLUE = '#0066FF'

export default function Receipt() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const amount = state?.amount ?? '150'

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>

      {/* BACK */}
      <div style={{ padding: '52px 24px 0' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ width: 38, height: 38, borderRadius: 10, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* RECEIPT CARD */}
      <div style={{ flex: 1, padding: '24px 20px 0' }}>
        <div style={{ background: 'white', borderRadius: 20, position: 'relative', overflow: 'hidden' }}>

          {/* Top section */}
          <div style={{ padding: '32px 24px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Thank you</p>
            <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.5 }}>
              Your payment has been processed<br />successfully
            </p>
          </div>

          {/* Dashed divider with scallop cutouts */}
          <div style={{ position: 'relative', margin: '0 -1px' }}>
            {/* Left cutout */}
            <div style={{ position: 'absolute', left: -12, top: -12, width: 24, height: 24, borderRadius: '50%', background: '#F5F5F5', zIndex: 1 }} />
            {/* Right cutout */}
            <div style={{ position: 'absolute', right: -12, top: -12, width: 24, height: 24, borderRadius: '50%', background: '#F5F5F5', zIndex: 1 }} />
            {/* Dashed line */}
            <div style={{ borderTop: '2px dashed #E5E7EB', margin: '0 14px' }} />
          </div>

          {/* Bottom section — transaction details */}
          <div style={{ padding: '24px 24px 32px' }}>

            {/* Driver tag + Amount row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 4px' }}>DRIVER TAG</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>BUS-012</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 4px' }}>AMOUNT</p>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>₦{Number(amount).toLocaleString()}</p>
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.05em', margin: '0 0 4px' }}>DATE & TIME</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{dateStr} | {timeStr}</p>
            </div>

            {/* Driver row */}
            <div style={{ background: '#F0FFF4', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={avatarYusuf} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>Yusuf Toheeb</p>
                <p style={{ fontSize: 13, color: '#555', margin: 0 }}>
                  Code: <span style={{ color: BLUE, fontWeight: 600 }}>899</span>
                </p>
              </div>
            </div>
          </div>

          {/* Scalloped bottom edge */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: -1, padding: '0 8px' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ width: 20, height: 12, background: '#F5F5F5', borderRadius: '0 0 12px 12px' }} />
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM BUTTONS */}
      <div style={{ padding: '24px 20px 44px', display: 'flex', gap: 12 }}>
        <button style={{ flex: 1, height: 52, borderRadius: 999, background: 'white', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: BLUE, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          Share as image
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          style={{ flex: 1, height: 52, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'white' }}
        >
          Share as PDF
        </button>
      </div>
    </div>
  )
}
