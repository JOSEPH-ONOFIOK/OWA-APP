import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BLUE = '#0066FF'

export default function AddMoney() {
  const navigate = useNavigate()
  const [amount, setAmount] = useState('')

  const display = amount ? Number(amount).toLocaleString() : '0'
  const canTransfer = amount && Number(amount) > 0

  const handleKey = (key) => {
    if (key === '⌫') {
      setAmount(prev => prev.slice(0, -1))
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + '.')
    } else {
      if (amount.length >= 7) return
      setAmount(prev => (prev === '0' ? key : prev + key))
    }
  }

  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫']

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>Add Money</span>
        <div style={{ width: 38 }} />
      </div>

      {/* AMOUNT DISPLAY */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '36px 24px 32px' }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: BLUE }}>₦</span>
        <span style={{ fontSize: 52, fontWeight: 700, color: BLUE, letterSpacing: -2, lineHeight: 1 }}>
          {display}
        </span>
      </div>

      {/* METHOD */}
      <div style={{ padding: '0 20px', marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: '#999', margin: '0 0 10px' }}>Method</p>
        <div style={{ border: `1.5px solid ${BLUE}`, borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="22" x2="21" y2="22"/>
              <rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/>
              <path d="M2 11l10-7 10 7"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>Bank Transfer</p>
            <p style={{ fontSize: 13, color: '#666', margin: 0 }}>Send money from your bank app</p>
          </div>
        </div>
      </div>

      {/* NUMPAD */}
      <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
        {keys.map(key => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            style={{
              height: 64,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: key === '⌫' ? 20 : 22,
              fontWeight: 500,
              color: key === '⌫' ? '#666' : '#111',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* TRANSFER BUTTON */}
      <div style={{ padding: '16px 20px 40px', marginTop: 'auto' }}>
        <button
          onClick={() => canTransfer && navigate('/enter-pin', { state: { type: 'addMoney', amount: display } })}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 999,
            background: canTransfer ? BLUE : '#98BDFF',
            border: 'none',
            cursor: canTransfer ? 'pointer' : 'default',
            fontSize: 16,
            fontWeight: 600,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {canTransfer ? `Transfer ₦${display}` : 'Enter amount'}
        </button>
      </div>
    </div>
  )
}
