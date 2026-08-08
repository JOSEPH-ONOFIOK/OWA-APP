"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, formatPhone, saveName } from "@/lib/api";
import { pushWithState, useWizardState } from "@/lib/wizardState";

const GreenCheck = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/>
  </svg>
)

const personIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const emailIcon  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const phoneIcon  = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>

const Label = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
    {icon}
    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{text}</span>
  </div>
)

const inputStyle = {
  width: '100%', height: 56, borderRadius: 16,
  border: '1px solid #e5e7eb', padding: '0 48px 0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box' as const,
}

const lockIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>

const EyeIcon = ({ open }: { open: boolean }) => open
  ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

interface SignUpState {
  role?: 'driver' | 'passenger'
}

export default function SignUp() {
  const router = useRouter()
  const state = useWizardState<SignUpState>()
  const role = state?.role ?? 'passenger'
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ok = {
    name: form.name.trim().length > 1,
    email: form.email.includes('@') && form.email.includes('.'),
    phone: form.phone.trim().length >= 7,
    password: form.password.length >= 6,
  }
  const allOk = Object.values(ok).every(Boolean)

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!allOk) return
    setLoading(true)
    setError('')
    const phone = formatPhone(form.phone)
    try {
      const fn = role === 'driver' ? api.registerDriver : api.registerStudent
      await fn({ fullName: form.name, email: form.email, phone, password: form.password })
      saveName(form.name)
      pushWithState(router, '/otp', { role, phone, email: form.email })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '56px 24px 0' }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 32px 40px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 8 }}>Create Your OWA Account</h1>
        <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 40 }}>Join thousands of students making campus transport easier.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Full name */}
            <div>
              <Label icon={personIcon} text="Full name" />
              <div style={{ position: 'relative' }}>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" style={inputStyle} />
                {ok.name && <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}><GreenCheck /></span>}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label icon={emailIcon} text="Email address" />
              <div style={{ position: 'relative' }}>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email address" style={inputStyle} />
                {ok.email && <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}><GreenCheck /></span>}
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label icon={phoneIcon} text="Phone number" />
              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', height: 56, borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', background: 'white' }}>
                  <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px', fontSize: 14, fontWeight: 500, color: '#1f2937', background: 'transparent', border: 'none', borderRight: '1px solid #e5e7eb', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    +234
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Enter your phone number" style={{ flex: 1, padding: '0 48px 0 16px', fontSize: 14, color: '#111827', outline: 'none', background: 'transparent', border: 'none' }} />
                </div>
                {ok.phone && <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)' }}><GreenCheck /></span>}
              </div>
            </div>

            {/* Password */}
            <div>
              <Label icon={lockIcon} text="Password" />
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter your password"
                  style={inputStyle}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <EyeIcon open={showPwd} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: 0 }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', height: 56, borderRadius: 999, background: allOk ? '#0066FF' : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span>Create Account</span><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></> : 'Create Account'}
            </button>
            <p style={{ textAlign: 'center', fontSize: 14, color: '#6b7280' }}>
              Already have an account?{' '}
              <span onClick={() => router.push('/login')} style={{ color: '#0066FF', fontWeight: 600, cursor: 'pointer' }}>Login</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
