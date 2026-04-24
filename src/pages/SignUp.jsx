import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0">
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

const GreenCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
)

const personIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const emailIcon  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const phoneIcon  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>

const inputCls = 'w-full h-14 rounded-2xl border border-gray-200 px-4 pr-12 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1A6BFF] bg-white transition-colors'

export default function SignUp() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const role = state?.role ?? 'passenger'

  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const ok = {
    name: form.name.trim().length > 1,
    email: form.email.includes('@') && form.email.includes('.'),
    phone: form.phone.trim().length >= 7,
  }
  const allOk = Object.values(ok).every(Boolean)

  const handleSubmit = (ev) => {
    ev.preventDefault()
    if (!allOk) return
    setLoading(true)
    setTimeout(() => { setLoading(false); navigate('/otp', { state: { role } }) }, 1200)
  }

  return (
    <div className="w-full bg-white flex flex-col px-6 pt-12 pb-8" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-1">Create Your OWA Account</h1>
      <p className="text-sm text-gray-500 mb-8">
        {allOk ? 'Join thousands of students and drivers making campus transport easier.' : 'Join thousands of students making campus transport easier.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="flex flex-col gap-5">
          {/* Full name */}
          <div>
            <FieldLabel icon={personIcon} text="Full name" />
            <div className="relative">
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" className={inputCls} />
              {ok.name && <span className="absolute right-4 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
            </div>
          </div>

          {/* Email */}
          <div>
            <FieldLabel icon={emailIcon} text="Email address" />
            <div className="relative">
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email address" className={inputCls} />
              {ok.email && <span className="absolute right-4 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
            </div>
          </div>

          {/* Phone */}
          <div>
            <FieldLabel icon={phoneIcon} text="Phone number" />
            <div className="relative">
              <div className="flex h-14 rounded-2xl border border-gray-200 overflow-hidden bg-white focus-within:border-[#1A6BFF] transition-colors">
                <button type="button" className="flex items-center gap-1.5 px-4 border-r border-gray-200 text-sm font-medium text-gray-800 shrink-0">
                  +234
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter your phone number" className="flex-1 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent pr-10" />
              </div>
              {ok.phone && <span className="absolute right-4 top-1/2 -translate-y-1/2"><GreenCheck /></span>}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-8 flex flex-col gap-4">
          <button type="submit" disabled={loading} className={`w-full h-14 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${allOk ? 'bg-[#1A6BFF] text-white' : 'bg-blue-300 text-white'}`}>
            {loading
              ? <><span>Create Account</span><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></>
              : 'Create Account'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <span onClick={() => navigate('/login')} className="text-[#1A6BFF] font-semibold cursor-pointer">Login</span>
          </p>
        </div>
      </form>
    </div>
  )
}
