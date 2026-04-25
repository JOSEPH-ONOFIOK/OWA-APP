import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.includes('@')) navigate('/check-email')
  }

  return (
    <div className="w-full bg-white flex flex-col px-7 pt-12 pb-10" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-2 text-center">Reset Password</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-8 text-center">
        Enter the email registered with your account and we'll send an email with a{' '}
        <span className="font-bold text-gray-900">password key</span> to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="text-[0.82rem] font-semibold text-gray-700">Email address</span>
          </div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full h-14 rounded-2xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1A6BFF] bg-white transition-colors"
          />
        </div>

        <div className="mt-auto pt-8">
          <button type="submit" className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base active:scale-[0.98] active:brightness-90 transition-all shadow-none">
            Send Instructions
          </button>
        </div>
      </form>
    </div>
  )
}
