"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useWizardState } from "@/lib/wizardState";

const EyeOpen = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOff = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
const lockIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>

interface CreatePasswordState {
  email?: string
}

export default function CreatePassword() {
  const router = useRouter()
  const state = useWizardState<CreatePasswordState>()
  const email = state?.email ?? ''
  const [form, setForm] = useState({ token: '', password: '', confirm: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.token.trim()) e.token = 'Enter the recovery key from your email'
    if (form.password.length < 8) e.password = 'Must be at least 8 characters'
    if (form.confirm !== form.password) e.confirm = 'Both passwords must match'
    setErrors(e)
    return !Object.keys(e).length
  }

  const inputStyle = (hasErr: boolean) => ({
    width: '100%', height: 56, borderRadius: 16,
    border: `1px solid ${hasErr ? '#f87171' : '#e5e7eb'}`,
    padding: '0 48px 0 16px', fontSize: 14, color: '#111827',
    outline: 'none', background: 'white', boxSizing: 'border-box' as const,
  })

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '56px 24px 0' }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 32px 40px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 8 }}>Create New Password</h1>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 40 }}>
          Your new password must be different from previously used passwords.
        </p>

        <form onSubmit={async e => {
          e.preventDefault()
          if (!validate()) return
          setLoading(true)
          setApiError('')
          try {
            await api.resetPassword({ email, token: form.token, password: form.password, confirmPassword: form.confirm })
            router.push('/login')
          } catch (err) {
            setApiError((err as Error).message)
          } finally {
            setLoading(false)
          }
        }} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

            {/* Recovery token */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {lockIcon}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>Recovery Key</span>
              </div>
              <input type="text" value={form.token} onChange={e => setForm({ ...form, token: e.target.value })} placeholder="Paste the key from your email" style={inputStyle(!!errors.token)} />
              {errors.token && <p style={{ fontSize: 12, marginTop: 6, color: '#ef4444' }}>{errors.token}</p>}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {lockIcon}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>Password</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" style={inputStyle(!!errors.password)} />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPwd ? <EyeOpen /> : <EyeOff />}
                </button>
              </div>
              <p style={{ fontSize: 12, marginTop: 6, color: errors.password ? '#ef4444' : '#9ca3af' }}>{errors.password ?? 'Must be at least 8 characters'}</p>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {lockIcon}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>Confirm Password</span>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Enter your password" style={inputStyle(!!errors.confirm)} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showConfirm ? <EyeOpen /> : <EyeOff />}
                </button>
              </div>
              <p style={{ fontSize: 12, marginTop: 6, color: errors.confirm ? '#ef4444' : '#9ca3af' }}>{errors.confirm ?? 'Both passwords must match'}</p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {apiError && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: 0 }}>{apiError}</p>}
            <button type="submit" disabled={loading} style={{ width: '100%', height: 56, borderRadius: 999, background: '#0066FF', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              {loading ? <><span>Resetting</span><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></> : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
