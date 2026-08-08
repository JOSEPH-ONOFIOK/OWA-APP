"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BLUE = '#0066FF'

const history = [
  { id: 1, group: 'Today', type: 'payment', name: 'Yusuf Toheeb', sub: 'BUS-012', time: 'Today, 08:43 AM', amount: '-₦150', color: '#F94242', icon: 'bus' },
  { id: 2, group: 'Today', type: 'topup',   name: 'Wallet TopUp', sub: 'BUS-012', time: 'Today, 08:43 AM', amount: '+₦1,000', color: '#22c55e', icon: 'wallet' },
  { id: 3, group: 'Yesterday', type: 'topup',   name: 'Wallet TopUp',   sub: null, time: 'Yesterday, 11:43 AM', amount: '+₦500', color: '#22c55e', icon: 'wallet' },
  { id: 4, group: 'Yesterday', type: 'payment', name: 'Bamidele Okiji', sub: 'BUS-008', time: 'Yesterday, 07:20 AM', amount: '-₦200', color: '#F94242', icon: 'bus' },
]

const tabs: Record<string, string | null> = { All: null, Payments: 'payment', TopUp: 'topup' }

const TxIcon = ({ icon }: { icon: string }) => {
  if (icon === 'wallet') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
    </svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="5" width="16" height="12" rx="2"/><circle cx="8" cy="20" r="1.5"/><circle cx="16" cy="20" r="1.5"/>
    </svg>
  )
}

const ReceiptIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

export default function TransactionHistory() {
  const router = useRouter()
  const [tab, setTab] = useState('All')

  const filtered = history.filter(tx => tabs[tab] === null || tx.type === tabs[tab])
  const groups = [...new Set(filtered.map(tx => tx.group))]

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Transaction History</span>
      </div>

      {/* TABS */}
      <div style={{ padding: '24px 20px 0', display: 'flex', gap: 8 }}>
        {Object.keys(tabs).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '9px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: tab === t ? BLUE : '#F5F5F5',
              color: tab === t ? 'white' : '#666',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: '#EFEFEF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <ReceiptIcon />
          </div>
          <p style={{ fontSize: 18, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>No Transaction yet</p>
          <p style={{ fontSize: 14, color: '#999', margin: 0, lineHeight: 1.5 }}>Your daily Transaction will appear here once you have any.</p>
        </div>
      ) : (
        <div style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {groups.map(group => (
            <div key={group}>
              <p style={{ fontSize: 14, color: '#999', margin: '0 0 10px' }}>{group}</p>
              <div style={{ border: '1px solid #F0F0F0', borderRadius: 16, overflow: 'hidden' }}>
                {filtered.filter(tx => tx.group === group).map((tx, i, arr) => (
                  <div key={tx.id} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: tx.icon === 'wallet' ? '#EFFFE7' : '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <TxIcon icon={tx.icon} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{tx.name}</p>
                      <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{tx.sub ? `${tx.sub} · ` : ''}{tx.time}</p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: tx.color, margin: 0 }}>{tx.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
