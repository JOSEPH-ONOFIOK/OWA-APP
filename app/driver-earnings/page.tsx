"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";

const BLUE = '#0066FF'

interface Transaction {
  _id: string
  type: string
  amount: number
  createdAt: string
}

const ranges = ['Today', 'This Week', 'This Month', 'This Year'] as const
type Range = typeof ranges[number]

const withinRange = (iso: string, range: Range) => {
  const d = new Date(iso)
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (range === 'Today') return d >= startOfDay
  if (range === 'This Week') return d >= new Date(startOfDay.getTime() - startOfDay.getDay() * 86400000)
  if (range === 'This Month') return d >= new Date(now.getFullYear(), now.getMonth(), 1)
  return d >= new Date(now.getFullYear(), 0, 1)
}

export default function DriverEarnings() {
  const router = useRouter()
  const [range, setRange] = useState<Range>('Today')
  const [available, setAvailable] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const token = getToken()
    api.walletBalance(token).then(setAvailable).catch(() => {})
    api.walletTransactions(token).then(res => setTransactions(res?.items ?? [])).catch(() => {})
  }, [])

  const inRange = transactions.filter(tx => withinRange(tx.createdAt, range))
  const totalEarned = inRange.filter(tx => tx.type === 'TOPUP').reduce((sum, tx) => sum + tx.amount, 0)
  const totalWithdrawn = inRange.filter(tx => tx.type !== 'TOPUP').reduce((sum, tx) => sum + tx.amount, 0)

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ background: 'white', padding: '52px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>My Earnings</span>
      </div>

      {/* RANGE TABS */}
      <div style={{ background: 'white', padding: '20px 20px 24px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: '9px 16px', borderRadius: 999, border: range === r ? 'none' : '1px solid #E5E7EB', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
              background: range === r ? '#EEF4FF' : 'white',
              color: range === r ? BLUE : '#666',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 20px 110px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* TOTAL EARNED */}
        <div style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0055D5 0%, #583AB2 100%)',
          padding: '20px 20px 22px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Total Earned</span>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: 0, letterSpacing: -1 }}>₦{totalEarned.toLocaleString()}</p>
        </div>

        {/* YOUR MONEY */}
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 12px' }}>Your Money</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'white', border: '1.5px solid #BBF7D0', borderRadius: 16, padding: '16px' }}>
              <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px' }}>Available Now</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#22c55e', margin: '0 0 4px' }}>{available === null ? '—' : `₦${available.toLocaleString()}`}</p>
              <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Ready to withdraw</p>
            </div>
            <div style={{ background: 'white', border: '1.5px solid #FECACA', borderRadius: 16, padding: '16px' }}>
              <p style={{ fontSize: 12, color: '#666', margin: '0 0 8px' }}>Withdrawn</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#F94242', margin: '0 0 4px' }}>₦{totalWithdrawn.toLocaleString()}</p>
              <p style={{ fontSize: 11, color: '#999', margin: 0 }}>Sent to bank</p>
            </div>
          </div>
        </div>

        {/* WITHDRAW BUTTON */}
        <button
          onClick={() => router.push('/withdrawal')}
          style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'white' }}
        >
          Withdraw {available === null ? '' : `₦${available.toLocaleString()}`}
        </button>

        {/* GOOD TO KNOW */}
        <div style={{ background: '#EEF4FF', border: `1px solid #C9DCFF`, borderRadius: 16, padding: '16px', display: 'flex', gap: 12 }}>
          <div style={{ width: 22, height: 22, borderRadius: '50%', background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 700 }}>!</span>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 4px' }}>Good to Know</p>
            <p style={{ fontSize: 13, color: '#555', margin: 0, lineHeight: 1.5 }}>
              Money shown in &quot;Available Now&quot; can be withdrawn to your bank account anytime. Withdrawals usually arrive within 1-2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
