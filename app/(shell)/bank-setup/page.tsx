"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { pushWithState, useWizardState } from "@/lib/wizardState";

const BANKS = [
  { name: 'Access Bank',        code: '044' },
  { name: 'First Bank',         code: '011' },
  { name: 'GTBank',             code: '058' },
  { name: 'Zenith Bank',        code: '057' },
  { name: 'UBA',                code: '033' },
  { name: 'Fidelity Bank',      code: '070' },
  { name: 'Sterling Bank',      code: '232' },
  { name: 'Union Bank',         code: '032' },
  { name: 'FCMB',               code: '214' },
  { name: 'Stanbic IBTC',       code: '221' },
  { name: 'Wema Bank',          code: '035' },
  { name: 'Polaris Bank',       code: '076' },
  { name: 'OPay',               code: '999992' },
  { name: 'Palmpay',            code: '999991' },
  { name: 'Kuda Bank',          code: '50211' },
  { name: 'Moniepoint',         code: '50515' },
]

const inputStyle = {
  width: '100%', height: 56, borderRadius: 16,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box' as const,
}

export default function BankSetup() {
  const router = useRouter()
  const state = useWizardState<Record<string, unknown>>()
  const [selectedBank, setSelectedBank] = useState<{ name: string; code: string } | null>(null)
  const [accountNumber, setAccountNumber] = useState('')
  const [dropOpen, setDropOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSave = selectedBank && accountNumber.length === 10

  const handleSave = async () => {
    if (!canSave || loading) return
    setLoading(true)
    setError('')
    try {
      await api.driverBank({
        bankName: selectedBank.name,
        accountNumber,
        bankCode: selectedBank.code,
      }, getToken())
      pushWithState(router, '/setup-pin', state)
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.3, marginBottom: 8 }}>Set up bank account</h1>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6, marginBottom: 40 }}>
          This is where your OWA earnings will be transferred to for personal use.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>

          {/* Bank dropdown */}
          <div style={{ position: 'relative' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Bank Name</p>
            <button
              onClick={() => setDropOpen(v => !v)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: selectedBank ? '#111827' : '#9ca3af', height: 56 }}
            >
              <span>{selectedBank ? selectedBank.name : 'Select your bank'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden auto', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxHeight: 260 }}>
                {BANKS.map(b => (
                  <button key={b.code} onClick={() => { setSelectedBank(b); setDropOpen(false) }} style={{ width: '100%', padding: '14px 20px', background: selectedBank?.code === b.code ? '#eff6ff' : 'white', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: selectedBank?.code === b.code ? 600 : 400, color: selectedBank?.code === b.code ? '#0066FF' : '#374151' }}>
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account number */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Account Number</p>
            <input
              type="tel"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter your 10-digit account number"
              maxLength={10}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ paddingTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: 0 }}>{error}</p>}
          <button onClick={handleSave} disabled={!!loading} style={{ width: '100%', height: 56, borderRadius: 999, background: canSave ? '#0066FF' : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: canSave ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><span>Saving</span><svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></> : 'Save'}
          </button>
          <button onClick={() => pushWithState(router, '/setup-pin', state)} style={{ width: '100%', height: 56, borderRadius: 999, background: '#f3f4f6', color: '#1f2937', fontWeight: 600, fontSize: 16, border: 'none', cursor: 'pointer' }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}
