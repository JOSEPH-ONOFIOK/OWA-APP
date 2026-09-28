"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken, getRoleFromToken, getSavedName, saveName } from "@/lib/api";

const BLUE = '#0066FF'

interface Profile {
  fullName?: string
  email?: string
  phone?: string
}

const inputStyle = {
  width: '100%', height: 52, borderRadius: 14,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box' as const,
}

const readOnlyStyle = { ...inputStyle, background: '#F9FAFB', color: '#6b7280' }

const Label = ({ text }: { text: string }) => (
  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>{text}</p>
)

export default function PersonalInformation() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [fullName, setFullName] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const token = getToken()
    const role = token ? getRoleFromToken(token) : null
    const fetcher = role === 'driver' ? api.driverProfile : api.userProfile
    fetcher(token).then((p: Profile) => {
      setProfile(p)
      setFullName(p?.fullName ?? getSavedName())
    }).catch(() => {
      setFullName(getSavedName())
    })
  }, [])

  const handleSave = () => {
    saveName(fullName)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ width: 38, height: 38, borderRadius: 10, background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: '#333' }}>Personal Information</span>
      </div>

      <div style={{ flex: 1, padding: '24px 20px 40px' }}>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px', lineHeight: 1.6 }}>
          Update your name and details
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <Label text="Full name" />
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <Label text="Email address" />
            <input type="email" value={profile?.email ?? ''} disabled style={readOnlyStyle} />
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 0' }}>Contact support to change your email address</p>
          </div>
          <div>
            <Label text="Phone number" />
            <input type="tel" value={profile?.phone ?? ''} disabled style={readOnlyStyle} />
            <p style={{ fontSize: 12, color: '#9ca3af', margin: '6px 0 0' }}>Contact support to change your phone number</p>
          </div>
        </div>

        {saved && <p style={{ fontSize: 13, color: '#22c55e', textAlign: 'center', margin: '20px 0 0' }}>Saved</p>}

        <button
          onClick={handleSave}
          disabled={!fullName.trim()}
          style={{ width: '100%', height: 56, borderRadius: 999, background: fullName.trim() ? BLUE : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: fullName.trim() ? 'pointer' : 'default', marginTop: 28 }}
        >
          Save
        </button>
      </div>
    </div>
  )
}
