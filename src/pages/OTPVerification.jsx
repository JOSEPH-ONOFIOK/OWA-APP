import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

export default function OTPVerification() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const role = state?.role ?? 'passenger'

  const [digits, setDigits] = useState(['', '', '', ''])
  const [verifying, setVerifying] = useState(false)
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
    const next = [...digits]
    next[i] = val
    setDigits(next)
    if (val && i < 3) refs[i + 1].current?.focus()
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs[i - 1].current?.focus()
  }

  const handleVerify = () => {
    if (!filled || verifying) return
    setVerifying(true)
    setTimeout(() => { setVerifying(false); navigate('/welcome', { state: { role } }) }, 1500)
  }

  useEffect(() => {
    if (digits.every(d => d !== '') && !verifying) {
      setVerifying(true)
      setTimeout(() => { setVerifying(false); navigate('/welcome', { state: { role } }) }, 1500)
    }
  }, [digits])

  const handleResend = () => {
    setCountdown(59)
    setDigits(['', '', '', ''])
    refs[0].current?.focus()
  }

  return (
    <div className="w-full bg-white flex flex-col px-6 pt-12 pb-10" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-1">Enter the code</h1>
      <p className="text-sm text-gray-500 mb-10">OWA Sent your code via Whatsapp to +2347011286879</p>

      {/* OTP boxes */}
      <div className="flex gap-3">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={refs[i]}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="flex-1 h-17 rounded-2xl border border-gray-200 text-center text-[1.6rem] font-bold text-gray-900 outline-none focus:border-[#1A6BFF] bg-white transition-colors"
          />
        ))}
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-3">
        <button
          onClick={handleVerify}
          disabled={verifying}
          className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${filled ? 'bg-[#1A6BFF] text-white' : 'bg-blue-300 text-white'}`}
        >
          {verifying
            ? <><span>Verifying</span><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></>
            : 'Verify Code'}
        </button>

        {countdown > 0
          ? <p className="text-center text-sm text-gray-500">
              Resend code{' '}
              <span className="text-[#1A6BFF] font-semibold">0:{String(countdown).padStart(2, '0')}s</span>
            </p>
          : <button onClick={handleResend} className="w-full h-14 rounded-2xl bg-blue-300 text-white font-semibold text-base">
              Resend Code
            </button>}
      </div>
    </div>
  )
}
