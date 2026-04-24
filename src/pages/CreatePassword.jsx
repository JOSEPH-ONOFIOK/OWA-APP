import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0 active:scale-[0.95] transition-transform">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

const EyeIcon = ({ open }) => open
  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

const lockIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

export default function CreatePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validate = () => {
    const e = {}
    if (form.password.length < 8) e.password = 'Must be at least 8 characters'
    if (form.confirm !== form.password) e.confirm = 'Both password must match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (validate()) navigate('/login')
  }

  const fieldCls = (hasErr) =>
    `w-full h-14 rounded-2xl border px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-white transition-colors focus:border-[#1A6BFF] ${hasErr ? 'border-red-400!' : 'border-gray-200'}`

  return (
    <div className="w-full bg-white flex flex-col px-6 pt-12 pb-8" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-2">Create New Account</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">
        Your new password must be different from previous used passwords
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex flex-col gap-5">
          {/* Password */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {lockIcon}
              <span className="text-[0.82rem] font-semibold text-gray-700">Password</span>
            </div>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className={fieldCls(errors.password)}
              />
              <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2">
                <EyeIcon open={showPwd} />
              </button>
            </div>
            <p className={`text-xs mt-1.5 ${errors.password ? 'text-red-500' : 'text-gray-400'}`}>
              {errors.password ?? 'Must be at least 8 characters'}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {lockIcon}
              <span className="text-[0.82rem] font-semibold text-gray-700">Confirm Password</span>
            </div>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={form.confirm}
                onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="Enter your password"
                className={fieldCls(errors.confirm)}
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
            <p className={`text-xs mt-1.5 ${errors.confirm ? 'text-red-500' : 'text-gray-400'}`}>
              {errors.confirm ?? 'Both password must match'}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button type="submit" className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base active:scale-[0.98] transition-transform">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  )
}
