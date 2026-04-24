import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

const lockIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
)

const inputCls = 'w-full h-14 rounded-2xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1A6BFF] bg-white transition-colors'

export default function CreatePassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})

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
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className={`${inputCls} ${errors.password ? '!border-red-400' : ''}`}
            />
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
            <input
              type="password"
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
              placeholder="Enter your password"
              className={`${inputCls} ${errors.confirm ? '!border-red-400' : ''}`}
            />
            <p className={`text-xs mt-1.5 ${errors.confirm ? 'text-red-500' : 'text-gray-400'}`}>
              {errors.confirm ?? 'Both password must match'}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-8">
          <button type="submit" className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base">
            Reset Password
          </button>
        </div>
      </form>
    </div>
  )
}
