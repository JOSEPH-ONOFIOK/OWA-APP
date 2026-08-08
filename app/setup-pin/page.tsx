"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { useWizardState } from "@/lib/wizardState";

const BLUE = '#0066FF'

const keys = [
  '1','2','3',
  '4','5','6',
  '7','8','9',
  '','0','⌫',
]

interface SetupPinState {
  role?: 'driver' | 'passenger'
}

export default function SetupPin() {
  const router = useRouter()
  const state = useWizardState<SetupPinState>()
  const dest = state?.role === 'driver' ? '/driver-dashboard' : '/dashboard'
  const [pin, setPin] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleKey = (key: string) => {
    if (success || loading) return
    if (key === '') return
    if (key === '⌫') {
      setPin(prev => prev.slice(0, -1))
    } else if (pin.length < 4) {
      setPin(prev => [...prev, key])
    }
  }

  const handleAddPin = async () => {
    if (pin.length !== 4) return
    setLoading(true)
    setError('')
    try {
      await api.setWalletPin({ pin: pin.join('') }, getToken())
      setSuccess(true)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const pinDisplay = pin.join('')

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* BACK */}
      <div style={{ padding: '52px 24px 0' }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
      </div>

      {/* TITLE */}
      <div style={{ textAlign: 'center', padding: '44px 32px 0' }}>
        <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>Add a transaction PIN</p>
        <p style={{ fontSize: 14, color: '#888', margin: 0, lineHeight: 1.6 }}>
          This PIN helps you confirm payments quickly and securely.
        </p>
      </div>

      {/* PIN BOXES */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 40 }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 68, height: 68,
              borderRadius: 16,
              background: '#F2F2F2',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {pin[i] !== undefined && (
              <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#111' }} />
            )}
          </div>
        ))}
      </div>

      {/* ADD PIN BUTTON */}
      <div style={{ padding: '36px 24px 0' }}>
        <button
          onClick={handleAddPin}
          disabled={pin.length !== 4 || loading}
          style={{
            width: '100%', height: 56, borderRadius: 999,
            background: pin.length === 4 ? BLUE : '#98BDFF',
            border: 'none',
            cursor: pin.length === 4 ? 'pointer' : 'default',
            fontSize: 16, fontWeight: 600, color: 'white',
          }}
        >
          {loading ? 'Saving...' : 'Add Pin'}
        </button>
        {error && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#E11D48', marginTop: 12 }}>{error}</p>
        )}
      </div>

      {/* CUSTOM NUMPAD */}
      <div style={{ padding: '32px 32px 40px', marginTop: 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {keys.map((key, i) => {
            if (key === '') return <div key={i} />
            return (
              <button
                key={i}
                onClick={() => handleKey(key)}
                style={{
                  height: 70,
                  borderRadius: '50%',
                  background: key === '⌫' ? '#1A1A1A' : '#E8E8E8',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 22,
                  fontWeight: 500,
                  color: key === '⌫' ? 'white' : '#111',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {key === '⌫'
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  : key
                }
              </button>
            )
          })}
        </div>
      </div>

      {/* SUCCESS BOTTOM SHEET */}
      {success && (
        <>
          <div
            onClick={() => { setSuccess(false); router.push(dest) }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }}
          />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            maxWidth: 480, margin: '0 auto',
            background: 'white', borderRadius: '24px 24px 0 0',
            zIndex: 50, padding: '20px 24px 48px',
          }}>
            {/* Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button
                onClick={() => { setSuccess(false); router.push(dest) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666', lineHeight: 1 }}
              >×</button>
            </div>

            {/* Green checkmark */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 64, lineHeight: 1 }}>✅</div>
            </div>

            {/* Text */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <p style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Successful</p>
              <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Your transaction PIN is set successfully.</p>
            </div>

            {/* PIN display */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <div style={{ background: '#F2F2F2', borderRadius: 999, padding: '8px 20px' }}>
                <span style={{ fontSize: 14, color: '#666' }}>PIN: </span>
                <span style={{ fontSize: 14, fontWeight: 700, color: BLUE }}>{pinDisplay}</span>
              </div>
            </div>

            {/* Done */}
            <button
              onClick={() => router.push(dest)}
              style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, color: 'white' }}
            >
              Done
            </button>
          </div>
        </>
      )}
    </div>
  )
}
