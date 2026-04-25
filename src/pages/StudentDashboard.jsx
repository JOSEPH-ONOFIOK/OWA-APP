import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const transactions = [
  { id: 1, name: 'Wallet Top Up', time: 'Today, 08:43 AM', amount: '+₦1,000', color: '#22c55e', bg: '#f0fdf4', icon: 'bank' },
  { id: 2, name: 'Joseph Onofiok', time: 'Yesterday, 03:20 PM', amount: '-₦150', color: '#ef4444', bg: '#fff1f2', icon: 'send' },
  { id: 3, name: 'Wallet Top Up', time: 'Mon, 10:15 AM', amount: '+₦2,000', color: '#22c55e', bg: '#f0fdf4', icon: 'bank' },
]

const BankIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/><rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/><path d="M2 11l10-7 10 7"/>
  </svg>
)
const SendIcon = ({ color }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [showBal, setShowBal] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div style={{ minHeight: '100dvh', background: '#f5f7ff', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* ── Header ── */}
      <div style={{ background: 'white', padding: '56px 20px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Avatar */}
        <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#fed7aa', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        {/* Name */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 2 }}>Welcome Back</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Ijandipe David</p>
        </div>

        {/* Icons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── Balance Card ── */}
        <div style={{ borderRadius: 20, background: 'linear-gradient(135deg, #1A6BFF 0%, #2332CC 100%)', padding: '20px 20px 24px', position: 'relative', overflow: 'hidden', minHeight: 160 }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.35)', borderRadius: 999, padding: '4px 10px 4px 6px' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#111' }} />
              </div>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>NGN</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 13, fontWeight: 500 }}>
              Transaction History
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Balance */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: -1 }}>
              {showBal ? '₦4,200' : '₦••••'}
            </span>
            <button onClick={() => setShowBal(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}>
              {showBal
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              }
            </button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>Account balance</p>

          {/* Coin illustration */}
          <div style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.95 }}>
            {/* Stack of coins */}
            <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
              <ellipse cx="72" cy="80" rx="38" ry="14" fill="#B45309" opacity="0.6"/>
              <ellipse cx="72" cy="74" rx="38" ry="14" fill="#D97706"/>
              <ellipse cx="72" cy="68" rx="38" ry="14" fill="#B45309" opacity="0.6"/>
              <ellipse cx="72" cy="62" rx="38" ry="14" fill="#F59E0B"/>
              <ellipse cx="72" cy="56" rx="38" ry="14" fill="#FBBF24"/>
              <ellipse cx="72" cy="50" rx="38" ry="14" fill="#FCD34D"/>
              <text x="52" y="55" fontSize="13" fontWeight="800" fill="#92400E" textAnchor="middle">₦</text>
            </svg>
          </div>

          {/* Add money button */}
          <div style={{ position: 'absolute', right: 20, bottom: 20 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: 'none', borderRadius: 999, padding: '10px 16px', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1A6BFF' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A6BFF" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add money
            </button>
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Quick Action</p>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', padding: '20px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {[
                { label: 'Transfer', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> },
                { label: 'Add money', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
                { label: 'Scan QR', icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
              ].map(({ label, icon }) => (
                <button key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}>
                  {icon}
                  <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Promo Banner ── */}
        <div style={{ overflowX: 'auto', scrollSnapType: 'x mandatory', display: 'flex', gap: 12, scrollbarWidth: 'none' }}>
          {/* Card 1 */}
          <div style={{ minWidth: '85%', scrollSnapAlign: 'start', borderRadius: 20, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '24px 20px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, bottom: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(34,197,94,0.15)' }} />
            <div style={{ position: 'absolute', right: 20, bottom: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.2)' }} />
            <p style={{ color: 'white', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Tap. Pay. Move.</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, lineHeight: 1.6, marginBottom: 20, maxWidth: '60%' }}>Tap with your OWA card for fast, contactless rides .. no cash, no delays.</p>
            <div style={{ display: 'inline-block', background: 'white', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#111827' }}>Coming Soon</div>
          </div>
          {/* Card 2 */}
          <div style={{ minWidth: '85%', scrollSnapAlign: 'start', borderRadius: 20, background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)', padding: '24px 20px', flexShrink: 0 }}>
            <p style={{ color: 'white', fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Refer & Earn</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>Invite friends to OWA and earn ₦200 for every successful signup.</p>
            <div style={{ display: 'inline-block', background: 'white', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#7c3aed' }}>Invite Now</div>
          </div>
        </div>

        {/* Dot indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: -8 }}>
          <div style={{ width: 24, height: 6, borderRadius: 999, background: '#1A6BFF' }} />
          <div style={{ width: 6, height: 6, borderRadius: 999, background: '#d1d5db' }} />
        </div>

        {/* ── Transactions ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Transactions</p>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A6BFF', fontSize: 13, fontWeight: 600 }}>See all</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ background: 'white', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: tx.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tx.icon === 'bank' ? <BankIcon color={tx.color} /> : <SendIcon color={tx.color} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 3 }}>{tx.name}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{tx.time}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: tx.color }}>{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #f3f4f6', display: 'flex', padding: '10px 0 24px', zIndex: 100 }}>
        {[
          { id: 'home', label: 'Home', icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#1A6BFF' : 'none'} stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
          { id: 'transactions', label: 'Transactions', icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
          { id: 'profile', label: 'Profile', icon: (active) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        ].map(({ id, label, icon }) => {
          const active = activeTab === id
          return (
            <button key={id} onClick={() => setActiveTab(id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
              {icon(active)}
              <span style={{ fontSize: 11, fontWeight: 500, color: active ? '#1A6BFF' : '#9ca3af' }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
