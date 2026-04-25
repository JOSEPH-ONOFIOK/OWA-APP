import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0 active:scale-[0.95] transition-transform">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

const FieldLabel = ({ icon, text }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon}
    <span className="text-[0.82rem] font-semibold text-gray-700">{text}</span>
  </div>
)

const EyeIcon = ({ open }) => open
  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

const phoneIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
const lockIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>

const inputCls = 'w-full h-14 rounded-2xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1A6BFF] bg-white transition-colors'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ phone: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (validate()) navigate('/welcome-back')
  }

  return (
    <div className="w-full bg-white flex flex-col px-6 pt-12 pb-10" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-1">Welcome Back</h1>
      <p className="text-sm text-gray-500 mb-8">Log in to continue using OWA.</p>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex flex-col gap-5">
          {/* Phone */}
          <div>
            <FieldLabel icon={phoneIcon} text="Phone number" />
            <div className={`flex h-14 rounded-2xl border overflow-hidden bg-white focus-within:border-[#1A6BFF] transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}>
              <button type="button" className="flex items-center gap-1.5 px-4 border-r border-gray-200 text-sm font-medium text-gray-800 shrink-0">
                +234
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter your phone number" className="flex-1 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent" />
            </div>
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <FieldLabel icon={lockIcon} text="Password" />
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className={`${inputCls} pr-12 ${errors.password ? 'border-red-400!' : ''}`}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2">
                <EyeIcon open={showPwd} />
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <p onClick={() => navigate('/reset-password')} className="text-[0.85rem] font-bold text-gray-900 cursor-pointer">
            Forgot Password?
          </p>
        </div>

        <div className="mt-auto pt-8 flex flex-col gap-4">
          <button type="submit" className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base active:scale-[0.98] transition-transform">
            Login
          </button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <span onClick={() => navigate('/role')} className="text-[#1A6BFF] font-semibold cursor-pointer">Sign Up</span>
          </p>
        </div>
      </form>
    </div>
  )
}
