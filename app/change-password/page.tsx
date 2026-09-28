"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BLUE = '#0066FF'

const EyeOpen = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
const EyeOff = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>

const inputStyle = (hasErr: boolean) => ({
  width: '100%', height: 56, borderRadius: 16,
  border: `1px solid ${hasErr ? '#f87171' : '#e5e7eb'}`,
  padding: '0 48px 0 16px', fontSize: 14, color: '#111827',
  outline: 'none', background: 'white', boxSizing: 'border-box' as const,
})

export default function ChangePassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const passwordErr = password.length > 0 && password.length < 8
  const confirmErr = confirm.length > 0 && confirm !== password
  const canSubmit = password.length >= 8 && confirm === password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || loading) return
    setLoading(true)
    setError('')
    // No authenticated "change my password" endpoint exists yet on the backend
    // (only the forgot-password recovery flow, which needs an email token).
    setTimeout(() => {
      setLoading(false)
      setError("Changing your password from here isn't available yet — check back soon.")
    }, 500)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ width: 38, height: 38, borderRadius: 10, background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: '#333' }}>Change Password</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px 32px 40px' }}>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 32 }}>
          Choose a new password for your account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Password</p>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  style={inputStyle(passwordErr)}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPwd ? <EyeOpen /> : <EyeOff />}
                </button>
              </div>
              <p style={{ fontSize: 12, marginTop: 6, color: passwordErr ? '#ef4444' : '#9ca3af' }}>Must be at least 8 characters</p>
            </div>

            <div>
              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Confirm Password</p>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Re-enter your new password"
                  style={inputStyle(confirmErr)}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showConfirm ? <EyeOpen /> : <EyeOff />}
                </button>
              </div>
              <p style={{ fontSize: 12, marginTop: 6, color: confirmErr ? '#ef4444' : '#9ca3af' }}>Both passwords must match</p>
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 40 }}>
            {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: '0 0 12px' }}>{error}</p>}
            <button
              type="submit"
              disabled={!canSubmit || loading}
              style={{ width: '100%', height: 56, borderRadius: 999, background: canSubmit ? BLUE : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: canSubmit ? 'pointer' : 'default' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
