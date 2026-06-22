import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api, saveToken, getRoleFromToken } from '../api'

export default function OTPVerification() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const role  = state?.role  ?? 'passenger'
  const phone = state?.phone ?? ''
  const email = state?.email ?? ''

  const [digits, setDigits] = useState(['', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(59)
  const refs = [useRef(), useRef(), useRef(), useRef()]
  const filled = digits.every(d => d !== '')

  useEffect(() => {
    if (countdown <= 0) return
    const id = setInterval(() => setCountdown(c => c - 1), 1000)
    return () => clearInterval(id)
  }, [countdown])

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]; next[i] = val; setDigits(next)
    if (val && i < 3) refs[i + 1].current?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  const doVerify = async (code) => {
    if (verifying) return
    setVerifying(true)
    setError('')
    try {
      const { accessToken } = await api.verify({ email, code })
      saveToken(accessToken)
      const resolvedRole = getRoleFromToken(accessToken) ?? role
      navigate('/welcome', { state: { role: resolvedRole, phone } })
    } catch (err) {
      setError(err.message)
      setVerifying(false)
    }
  }

  const handleVerify = () => { if (filled) doVerify(digits.join('')) }

  useEffect(() => {
    if (digits.every(d => d !== '') && !verifying) doVerify(digits.join(''))
  }, [digits])

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '56px 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 32px 40px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 8 }}>Enter the code</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>OWA sent your code to <strong>{email || 'your email'}</strong></p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {digits.map((d, i) => (
            <input
              key={i} ref={refs[i]}
              type="tel" inputMode="numeric" maxLength={1} value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{ width: '100%', height: 64, borderRadius: 16, border: `1px solid ${d ? '#0066FF' : '#e5e7eb'}`, textAlign: 'center', fontSize: 26, fontWeight: 700, color: '#111827', outline: 'none', background: 'white', boxSizing: 'border-box' }}
            />
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: 0 }}>{error}</p>}
          <button onClick={handleVerify} disabled={verifying} style={{ width: '100%', height: 56, borderRadius: 999, background: filled ? '#0066FF' : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {verifying ? <><span>Verifying</span><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></> : 'Verify Code'}
          </button>
          {countdown > 0
            ? <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280' }}>Resend code <span style={{ color: '#0066FF', fontWeight: 600 }}>0:{String(countdown).padStart(2, '0')}s</span></p>
            : <button onClick={() => { setCountdown(59); setDigits(['','','','']); refs[0].current?.focus() }} style={{ width: '100%', height: 56, borderRadius: 999, background: '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>Resend Code</button>
          }
        </div>
      </div>
    </div>
  )
}

