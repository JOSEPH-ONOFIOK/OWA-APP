import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const bankIcon = <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="22" x2="21" y2="22"/><rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/><path d="M2 11l10-7 10 7"/></svg>

const inputStyle = {
  width: '100%', height: 56, borderRadius: 16,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box',
}

const Label = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
    {icon}
    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>{text}</span>
  </div>
)

export default function BankSetup() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ bank: '', account: '' })

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      <div style={{ padding: '56px 24px 0' }}>
        <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 32px 40px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 8 }}>Set up bank account</h1>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 40 }}>
          This is where your OWA earnings will be transferred to for personal use.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          <div>
            <Label icon={bankIcon} text="Bank Name" />
            <input type="text" value={form.bank} onChange={e => setForm({ ...form, bank: e.target.value })} placeholder="Enter your bank name" style={inputStyle} />
          </div>
          <div>
            <Label icon={bankIcon} text="Account Number" />
            <input type="tel" value={form.account} onChange={e => setForm({ ...form, account: e.target.value })} placeholder="Enter your 10 digit number" maxLength={10} style={inputStyle} />
          </div>
        </div>

        <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => navigate('/welcome', { state })} style={{ width: '100%', height: 56, borderRadius: 999, background: '#1A6BFF', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            Save
          </button>
          <button onClick={() => navigate('/welcome', { state })} style={{ width: '100%', height: 56, borderRadius: 999, background: '#f3f4f6', color: '#1f2937', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
