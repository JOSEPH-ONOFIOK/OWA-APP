import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const BLUE = '#0066FF'

const Corner = ({ top, bottom, left, right }) => (
  <div style={{
    position: 'absolute',
    top: top ?? 'auto', bottom: bottom ?? 'auto', left: left ?? 'auto', right: right ?? 'auto',
    width: 22, height: 22,
    borderTop: top !== undefined ? '3px solid #4ADE80' : 'none',
    borderBottom: bottom !== undefined ? '3px solid #4ADE80' : 'none',
    borderLeft: left !== undefined ? '3px solid #4ADE80' : 'none',
    borderRight: right !== undefined ? '3px solid #4ADE80' : 'none',
  }} />
)

export default function ScanQRCode() {
  const navigate = useNavigate()
  const [torchOn, setTorchOn] = useState(false)

  // Simulate a QR detection so the flow completes without a real camera
  useEffect(() => {
    const id = setTimeout(() => {
      navigate('/transfer-amount', { state: { driverName: 'Yusuf Toheeb', driverId: 'BUS-012' } })
    }, 3500)
    return () => clearTimeout(id)
  }, [navigate])

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Scan QR Code</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: BLUE }}>Album</span>
      </div>

      {/* VIEWFINDER */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 20px 0' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '1 / 1' }}>
          <Corner top={0} left={0} />
          <Corner top={0} right={0} />
          <Corner bottom={0} left={0} />
          <Corner bottom={0} right={0} />
          <div style={{
            position: 'absolute', inset: 16, borderRadius: 20, border: `2px solid ${BLUE}`,
            overflow: 'hidden', background: '#FAFBFF',
          }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #4ADE80, transparent)',
              animation: 'scanline 2s ease-in-out infinite',
            }} />
          </div>
          <style>{`
            @keyframes scanline {
              0% { top: 8%; }
              50% { top: 88%; }
              100% { top: 8%; }
            }
          `}</style>
        </div>

        <button
          onClick={() => setTorchOn(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 40 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={torchOn ? '#333' : 'none'} stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2h6l1 5-3 2v9a2 2 0 01-4 0v-9L6 7z"/>
          </svg>
        </button>

        <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: '24px 0 0', lineHeight: 1.5, maxWidth: 280 }}>
          Use your device camera to scan the QR code to make payment.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%', maxWidth: 320, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>
      </div>

      {/* INPUT TAG NUMBER */}
      <div style={{ padding: '0 20px 40px' }}>
        <button
          onClick={() => navigate('/send-to-driver')}
          style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, color: 'white' }}
        >
          Input tag number
        </button>
      </div>
    </div>
  )
}
