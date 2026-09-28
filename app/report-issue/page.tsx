"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BLUE = '#0066FF'

const ISSUE_TYPES = ['Driver dispute', 'Payment/Network issue', 'App bug', 'Other']

const inputStyle = {
  width: '100%', height: 52, borderRadius: 14,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box' as const,
}

const Label = ({ text }: { text: string }) => (
  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>{text}</p>
)

export default function ReportIssue() {
  const router = useRouter()
  const [issueType, setIssueType] = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = issueType && description.trim().length > 0

  const handleSubmit = () => {
    if (!canSubmit || loading) return
    setLoading(true)
    setError('')
    // No issue-reporting endpoint exists yet on the backend.
    setTimeout(() => {
      setLoading(false)
      setError("Submitting reports isn't available yet — check back soon.")
    }, 500)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ width: 38, height: 38, borderRadius: 10, background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 500, color: '#333' }}>Report an Issue</span>
      </div>

      <div style={{ flex: 1, padding: '24px 20px 40px' }}>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 28px', lineHeight: 1.6 }}>
          Report driver or payment issues
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ position: 'relative' }}>
            <Label text="Type of Issue" />
            <button
              onClick={() => setDropOpen(v => !v)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: issueType ? '#111827' : '#9ca3af', height: 52 }}
            >
              <span>{issueType || 'Select type of issue'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                {ISSUE_TYPES.map(t => (
                  <button key={t} onClick={() => { setIssueType(t); setDropOpen(false) }} style={{ width: '100%', padding: '14px 16px', background: issueType === t ? '#eff6ff' : 'white', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: issueType === t ? 600 : 400, color: issueType === t ? BLUE : '#374151' }}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label text="Report" />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Please briefly describe your issue so our support team can understand it and provide assistance"
              rows={6}
              style={{ ...inputStyle, height: 'auto', padding: '14px 16px', resize: 'none', fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: '20px 0 0' }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit || loading}
          style={{ width: '100%', height: 56, borderRadius: 999, background: canSubmit ? BLUE : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: canSubmit ? 'pointer' : 'default', marginTop: 28 }}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}
