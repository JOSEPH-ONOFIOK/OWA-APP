"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api, getToken, getSavedName } from "@/lib/api";
import Avatar from "@/components/Avatar";

import coin1      from "@/assets/images/figma-card-coin1.png";
import coin2      from "@/assets/images/figma-card-coin2.png";
import promoCard1 from "@/assets/images/figma-promo-card1.png";
import promoCard2 from "@/assets/images/figma-promo-card2.png";

const BLUE = '#0066FF'

interface Profile {
  fullName?: string
}

interface Transaction {
  _id: string
  type: string
  amount: number
  metadata?: { remark?: string }
  createdAt: string
}

const timeLabel = (iso: string) => {
  const d = new Date(iso)
  const now = new Date()
  const startOfDay = (dt: Date) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
  const diffDays = Math.round((startOfDay(now).getTime() - startOfDay(d).getTime()) / 86400000)
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (diffDays === 0) return `Today, ${time}`
  if (diffDays === 1) return `Yesterday, ${time}`
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${time}`
}

const TxIcon = ({ isCredit }: { isCredit: boolean }) => isCredit ? (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#69EB23" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/>
    <path d="M2 11l10-7 10 7"/>
  </svg>
) : (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const quickActions = [
  {
    label: 'Transfer', path: '/transfer',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  },
  {
    label: 'Add money', path: '/add-money',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  },
  {
    label: 'Scan QR', path: '/scan-qr',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  },
]

export default function StudentDashboard() {
  const router = useRouter()
  const [showBal, setShowBal] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [promoIdx, setPromoIdx] = useState(0)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const token = getToken()
    api.userProfile(token).then(setProfile).catch(() => {})
    api.walletBalance(token).then(setBalance).catch(() => {})
    api.walletTransactions(token).then(res => setTransactions(res?.items ?? [])).catch(() => {})
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIdx(prev => {
        const next = (prev + 1) % 2
        scrollRef.current?.scrollTo({ left: next * scrollRef.current.offsetWidth, behavior: 'smooth' })
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ minHeight: '100dvh', background: '#fff', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: 'white', padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={profile?.fullName ?? getSavedName()} size={46} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 15, color: '#666', margin: 0, fontWeight: 400 }}>Welcome Back</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#333', margin: 0 }}>{profile?.fullName ?? (getSavedName() || 'Student')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/notifications')} style={{ width: 38, height: 38, borderRadius: '50%', background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
          </button>
          <button onClick={() => router.push('/scan-qr')} style={{ width: 38, height: 38, borderRadius: '50%', background: '#FBFBFB', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* BALANCE CARD — blue-to-purple gradient from Figma */}
        <div style={{
          borderRadius: 20,
          background: 'linear-gradient(135deg, #0055D5 0%, #583AB2 100%)',
          padding: '18px 20px 20px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 160,
        }}>
          {/* Stacked coins */}
          <Image src={coin1} alt="" style={{ position: 'absolute', right: -8, bottom: -16, width: 130, height: 'auto', objectFit: 'contain', pointerEvents: 'none', opacity: 0.85 }} />
          <Image src={coin2} alt="" style={{ position: 'absolute', right: 28, bottom: 4, width: 108, height: 'auto', objectFit: 'contain', pointerEvents: 'none' }} />

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, position: 'relative', zIndex: 1 }}>
            {/* NGN toggle pill — white bg, black circle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'white', borderRadius: 999, padding: '5px 12px 5px 5px' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
              </div>
              <span style={{ color: '#111', fontSize: 11, fontWeight: 700 }}>NGN</span>
            </div>
            <button onClick={() => router.push('/transaction-history')} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 13, fontWeight: 400 }}>
              Transaction History
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Balance — Figma shows rgb(195,195,195) = muted gray on the card */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontSize: 30, fontWeight: 500, color: '#C3C3C3', letterSpacing: -0.5 }}>
                {balance === null ? '—' : showBal ? `₦${balance.toLocaleString()}` : '₦• • • •'}
              </span>
              <button onClick={() => setShowBal(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E2E2E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {showBal
                    ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                    : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  }
                </svg>
              </button>
            </div>
            <p style={{ color: '#C3C3C3', fontSize: 12, fontWeight: 500, margin: 0 }}>Account balance</p>
          </div>

          {/* Add money button */}
          <button
            onClick={() => router.push('/add-money')}
            style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 2, display: 'flex', alignItems: 'center', gap: 6, background: 'white', border: 'none', borderRadius: 999, padding: '10px 16px', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: '#111' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add money
          </button>
        </div>

        {/* QUICK ACTION */}
        <div>
          <p style={{ fontSize: 17, fontWeight: 500, color: '#333', margin: '0 0 12px' }}>Quick Action</p>
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #F0F0F0', padding: '14px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
              {quickActions.map(({ label, icon, path }) => (
                <button
                  key={label}
                  onClick={() => router.push(path)}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FBFBFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {icon}
                  </div>
                  <span style={{ fontSize: 13, color: '#333', fontWeight: 400 }}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* PROMO CAROUSEL */}
        <div>
          <div
            ref={scrollRef}
            style={{ display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory', scrollbarWidth: 'none', borderRadius: 14 }}
            onScroll={e => {
              const el = e.currentTarget
              const idx = Math.round(el.scrollLeft / el.offsetWidth)
              setPromoIdx(idx)
            }}
          >
            {[promoCard1, promoCard2].map((src, i) => (
              <div key={i} style={{ minWidth: '100%', scrollSnapAlign: 'start', flexShrink: 0 }}>
                <Image src={src} alt="" style={{ width: '100%', height: 155, objectFit: 'cover', borderRadius: 14, display: 'block' }} />
              </div>
            ))}
          </div>
          {/* Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
            {[0, 1].map(i => (
              <div key={i} style={{ width: i === promoIdx ? 20 : 6, height: 6, borderRadius: 999, background: i === promoIdx ? BLUE : '#D9D9D9', transition: 'width 0.2s' }} />
            ))}
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 17, fontWeight: 500, color: '#333', margin: 0 }}>Transactions</p>
            <button onClick={() => router.push('/transaction-history')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: BLUE, fontWeight: 500 }}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {transactions.length === 0 ? (
              <p style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '20px 0' }}>No transactions yet</p>
            ) : (
              transactions.slice(0, 3).map(tx => {
                const isCredit = tx.type === 'TOPUP'
                return (
                  <div key={tx._id} style={{ background: 'white', padding: '14px 0', display: 'flex', alignItems: 'center', gap: 14, borderBottom: '1px solid #F5F5F5' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: isCredit ? '#EFFFE7' : '#EAF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <TxIcon isCredit={isCredit} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, color: '#333', margin: '0 0 3px' }}>{tx.metadata?.remark || (isCredit ? 'Wallet Top Up' : tx.type)}</p>
                      <p style={{ fontSize: 12, color: '#666', margin: 0 }}>{timeLabel(tx.createdAt)}</p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: isCredit ? '#69EB23' : '#F94242', margin: 0 }}>
                      {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* BOTTOM NAV — 4 items: Home, Transactions, Activity, Profile */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderTop: '1px solid #F0F0F0', display: 'flex', padding: '10px 0 20px', zIndex: 100 }}>
        {[
          {
            id: 'home', label: 'Home',
            icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? BLUE : 'none'} stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
          },
          {
            id: 'transactions', label: 'Transactions',
            icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
          },
          {
            id: 'activity', label: 'Activity',
            icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
          },
          {
            id: 'profile', label: 'Profile',
            icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
          },
        ].map(({ id, label, icon }) => {
          const active = activeTab === id
          const dest = ({ transactions: '/transaction-history', activity: '/activity', profile: '/profile' } as Record<string, string>)[id]
          return (
            <button key={id} onClick={() => { setActiveTab(id); if (dest) router.push(dest) }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              {icon(active)}
              <span style={{ fontSize: 11, fontWeight: 500, color: active ? BLUE : '#666' }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
