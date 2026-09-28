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

const ranges = ['This Week', 'This Month', 'All Time'] as const
type Range = typeof ranges[number]

const withinRange = (iso: string, range: Range) => {
  const d = new Date(iso)
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (range === 'This Week') return d >= new Date(startOfDay.getTime() - startOfDay.getDay() * 86400000)
  if (range === 'This Month') return d >= new Date(now.getFullYear(), now.getMonth(), 1)
  return true
}

export default function Activity() {
  const router = useRouter()
  const [range, setRange] = useState<Range>('This Week')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.walletTransactions(getToken())
      .then(res => setTransactions(res?.items ?? []))
      .finally(() => setLoading(false))
  }, [])

  const spent = transactions.filter(tx => tx.type !== 'TOPUP' && withinRange(tx.createdAt, range))
  const total = spent.reduce((sum, tx) => sum + tx.amount, 0)

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
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>My Spending</span>
      </div>

      {/* RANGE TABS */}
      <div style={{ background: 'white', padding: '20px 20px 24px', display: 'flex', gap: 8 }}>
        {ranges.map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: '9px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: range === r ? BLUE : 'transparent',
              color: range === r ? 'white' : '#666',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* TOTAL SPENT */}
        <div style={{ border: `1.5px solid ${BLUE}`, borderRadius: 16, padding: '20px', textAlign: 'center', background: 'white' }}>
          <div style={{ display: 'inline-block', background: '#EEF4FF', borderRadius: 999, padding: '5px 14px', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: BLUE, fontWeight: 500 }}>Total Spent</span>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 4px', letterSpacing: -1 }}>
            {loading ? '—' : `₦${total.toLocaleString()}`}
          </p>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{spent.length} transaction{spent.length === 1 ? '' : 's'} {range.toLowerCase()}</p>
        </div>

        {spent.length === 0 && !loading && (
          <p style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '20px 0' }}>No spending in this period yet</p>
        )}

        {/* VIEW ALL */}
        <button
          onClick={() => router.push('/transaction-history')}
          style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'white' }}
        >
          View all Transactions
        </button>
      </div>
    </div>
  )
}
