import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import piggyImg   from '../assets/images/figma-driver-card-piggy.png'
import avatarYusuf from '../assets/images/figma-avatar-yusuf.png'

const BLUE = '#0066FF'

const days     = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']
const values   = [7200, 4000, 8890, 2400, 5150, 3600, 1800]
const maxVal   = Math.max(...values)
const activeDay = 4 // Fri

const transactions = [
  { id: 1, name: 'Anthonia Salako', time: 'Today, 9:00 AM',       amount: '+₦150',   color: '#4FDB5F', type: 'send' },
  { id: 2, name: 'Obed Moses',      time: 'Today, 9:03 PM',       amount: '+₦150',   color: '#4FDB5F', type: 'send' },
  { id: 3, name: 'Withdrawal',      time: 'Yesterday, 08:43 AM',  amount: '-₦8,000', color: '#F94242', type: 'bank' },
]

const IconSend = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)
const IconBank = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/>
    <path d="M2 11l10-7 10 7"/>
  </svg>
)

const NavHome = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? BLUE : 'none'} stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const NavCoin = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)
const NavTx = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const NavUser = ({ active }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function DriverDashboard() {
  const navigate = useNavigate()
  const [showBal, setShowBal] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: 'white', padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={avatarYusuf} alt="Yusuf" style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Welcome Back</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#333', margin: 0 }}>Yusuf Toheeb</p>
        </div>
        <button style={{ width: 38, height: 38, borderRadius: '50%', background: '#F2F2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* BALANCE CARD */}
        <div style={{ borderRadius: 20, background: '#3A3A3A', padding: '20px 20px 22px', position: 'relative', overflow: 'hidden', minHeight: 165 }}>
          {/* Piggy bank — large, right side overflowing */}
          <img src={piggyImg} alt="" style={{ position: 'absolute', right: -20, bottom: -35, width: 190, objectFit: 'contain', pointerEvents: 'none' }} />

          {/* Top row: Total Earnings pill (left) + Transaction History (right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgb(230,230,230)', borderRadius: 999, padding: '5px 14px' }}>
              <span style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>Total Earnings</span>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 13, fontWeight: 400 }}>
              Transaction History
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Balance — white */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: 'white', letterSpacing: -0.5 }}>
              {showBal ? '₦12,200' : '₦• • • •'}
            </span>
            <button onClick={() => setShowBal(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {showBal
                  ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                }
              </svg>
            </button>
          </div>

          {/* Withdraw — white filled, blue text, full width */}
          <button style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'white', border: 'none', borderRadius: 999, padding: '12px', cursor: 'pointer', color: BLUE, fontSize: 15, fontWeight: 600, width: '100%' }}>
            Withdraw
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* DAILY EARNINGS CHART */}
        <div style={{ background: 'white', borderRadius: 16, padding: '16px 16px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 3px' }}>Daily Earnings</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>March 20th, 2026</p>
            </div>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: '#F8F8F8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Bar chart — only active bar has label, active bar is blue */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 120 }}>
            {values.map((val, i) => {
              const isActive = i === activeDay
              const pct = (val / maxVal) * 80
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                  {isActive && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: BLUE, whiteSpace: 'nowrap', marginBottom: 2 }}>₦{val.toLocaleString()}</span>
                  )}
                  <div style={{ width: '100%', height: `${pct}%`, background: isActive ? BLUE : '#E0E0E0', borderRadius: 4, minHeight: 8 }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            {days.map((d, i) => (
              <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: i === activeDay ? '#111' : '#999', fontWeight: i === activeDay ? 700 : 400 }}>{d}</span>
            ))}
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#333', margin: 0 }}>Transactions</p>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: BLUE, fontWeight: 500 }}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {transactions.map(tx => (
              <div key={tx.id} style={{ background: '#FBFBFB', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tx.type === 'send' ? <IconSend /> : <IconBank />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 500, color: '#333', margin: '0 0 2px' }}>{tx.name}</p>
                  <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{tx.time}</p>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: tx.color, margin: 0 }}>{tx.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderTop: '1px solid #F0F0F0', display: 'flex', padding: '10px 0 20px', zIndex: 100 }}>
        {[
          { id: 'home',         label: 'Home',         Icon: NavHome },
          { id: 'earnings',     label: 'Earnings',     Icon: NavCoin },
          { id: 'transactions', label: 'Transactions', Icon: NavTx   },
          { id: 'profile',      label: 'Profile',      Icon: NavUser },
        ].map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button key={id} onClick={() => { setActiveTab(id); if (id === 'profile') navigate('/driver-profile') }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              <Icon active={active} />
              <span style={{ fontSize: 10, fontWeight: 500, color: active ? BLUE : '#666' }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
