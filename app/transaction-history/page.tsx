"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";

const BLUE = '#0066FF'

interface Transaction {
  _id: string
  type: string
  amount: number
  metadata?: { remark?: string }
  createdAt: string
}

const tabs: Record<string, string | null> = { All: null, TopUp: 'TOPUP', Other: 'OTHER' }

const TxIcon = ({ isCredit }: { isCredit: boolean }) => isCredit ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const ReceiptIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)

const groupLabel = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  const diffDays = Math.round((startOfDay(now).getTime() - startOfDay(d).getTime()) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export default function TransactionHistory() {
  const router = useRouter()
  const [tab, setTab] = useState('All')
  const [items, setItems] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.walletTransactions(getToken())
      .then(res => setItems(res?.items ?? []))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(tx => {
    const want = tabs[tab]
    if (want === null) return true
    if (want === 'TOPUP') return tx.type === 'TOPUP'
    return tx.type !== 'TOPUP'
  })
  const groups = [...new Set(filtered.map(tx => groupLabel(tx.createdAt)))]

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

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: BLUE, animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: '#999', lineHeight: 1.5 }}>{error}</p>
        </div>
      ) : filtered.length === 0 ? (
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
                {filtered.filter(tx => groupLabel(tx.createdAt) === group).map((tx, i, arr) => {
                  const isCredit = tx.type === 'TOPUP'
                  return (
                    <div key={tx._id} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: i < arr.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                      <div style={{ width: 42, height: 42, borderRadius: 12, background: isCredit ? '#EFFFE7' : '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <TxIcon isCredit={isCredit} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{tx.metadata?.remark || (isCredit ? 'Wallet TopUp' : tx.type)}</p>
                        <p style={{ fontSize: 12, color: '#999', margin: 0 }}>{timeLabel(tx.createdAt)}</p>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: isCredit ? '#22c55e' : '#F94242', margin: 0 }}>
                        {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
