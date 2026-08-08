import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function EnterPin() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Auto-focus brings up native keyboard immediately
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = (e) => {
    if (loading) return
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setPin(val)
    if (val.length === 4) {
      setLoading(true)
      const dest = state?.type === 'addMoney'
        ? { pathname: '/payment-success', state: { type: 'addMoney', amount: state?.amount } }
        : state?.type === 'withdrawal'
        ? { pathname: '/payment-success', state: { type: 'withdrawal', amount: state?.amount } }
        : { pathname: '/payment-success', state: { ...state, type: 'driver', driverName: 'Yusuf' } }
      setTimeout(() => navigate(dest.pathname, { state: dest.state }), 1500)
    }
  }

  return (
    <div
      style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Hidden native input — triggers phone keyboard */}
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        pattern="[0-9]*"
        value={pin}
        onChange={handleChange}
        maxLength={4}
        style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
        autoFocus
      />

      {/* BACK */}
      <div style={{ padding: '52px 24px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* TITLE */}
      <div style={{ textAlign: 'center', padding: '48px 24px 0' }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>Enter your 4 digit PIN</p>
        <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Please confirm your PIN to proceed</p>
      </div>

      {/* PIN DOTS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 48 }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 58, height: 54, borderRadius: 12,
              background: '#EBEBEB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {pin[i] !== undefined && (
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#111' }} />
            )}
          </div>
        ))}
      </div>

      {/* LOADING SPINNER */}
      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: '3px solid #D0D0D0',
            borderTopColor: '#888',
            animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Tap anywhere hint */}
      {!loading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: '#aaa', marginTop: 32 }}>
          Tap anywhere to show keyboard
        </p>
      )}
    </div>
  )
}
