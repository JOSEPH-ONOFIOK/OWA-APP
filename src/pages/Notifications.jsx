import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BLUE = '#0066FF'

const notifications = [
  { id: 1, title: 'Wallet TopUp',    desc: [{ t: 'Wallet topup of ' }, { t: '₦500', c: '#22c55e' }, { t: ' was sent to your wallet' }], date: 'April 08, 2026', time: '5:43', unread: true },
  { id: 2, title: 'Payment Sent',    desc: [{ t: 'You paid ' }, { t: '₦150', c: '#F94242' }, { t: ' to Yusuf Toheeb (BUS-012)' }], date: 'April 08, 2026', time: '9:03', unread: true },
  { id: 3, title: 'Withdrawal',      desc: [{ t: 'Your withdrawal of ' }, { t: '₦8,000', c: '#F94242' }, { t: ' was sent to your bank' }], date: 'April 06, 2026', time: '10:12', unread: false },
  { id: 4, title: 'Account Verified', desc: [{ t: 'Your OWA account has been verified successfully' }], date: 'April 02, 2026', time: '8:00', unread: false },
]

const BellIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

export default function Notifications() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('Unread')
  const [items, setItems] = useState(notifications)

  const filtered = items.filter(n => (tab === 'Unread' ? n.unread : !n.unread))

  const markRead = (id) => setItems(prev => prev.map(n => (n.id === id ? { ...n, unread: false } : n)))

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Notification</span>
      </div>

      {/* TABS */}
      <div style={{ padding: '32px 20px 0' }}>
        <div style={{ display: 'inline-flex', background: '#EDEDED', borderRadius: 999, padding: 4 }}>
          {['Unread', 'Read'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '10px 28px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 600,
                background: tab === t ? 'white' : 'transparent',
                color: '#111',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* LIST / EMPTY STATE */}
      {filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <BellIcon />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>No Notifications yet</p>
          <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.5 }}>Notifications will appear here once you have any.</p>
        </div>
      ) : (
        <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(n => (
            <div key={n.id} style={{ border: '1px solid #F0F0F0', borderRadius: 16, padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: 0 }}>{n.title}</p>
                {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#F94242', flexShrink: 0, marginTop: 4 }} />}
              </div>
              <p style={{ fontSize: 13, color: '#666', margin: 0, lineHeight: 1.5 }}>
                {n.desc.map((part, i) => (
                  <span key={i} style={part.c ? { color: part.c, fontWeight: 600 } : undefined}>{part.t}</span>
                ))}
              </p>
              <div style={{ borderTop: '1px solid #F0F0F0', margin: '12px 0 10px' }} />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#999' }}>{n.date} {n.time}</span>
                <button
                  onClick={() => { markRead(n.id); navigate('/transaction-history') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 500, color: BLUE }}
                >
                  View
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
