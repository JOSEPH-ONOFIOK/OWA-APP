"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api, getToken, getSavedName } from "@/lib/api";
import Avatar from "@/components/Avatar";

import piggyImg   from "@/assets/images/figma-driver-card-piggy.png";

const BLUE = '#0066FF'

interface Profile {
  fullName?: string
  driverTagNumber?: string
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

const IconQr = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 17h.01M14 20h3v-3M20 17h.01M20 20h.01"/>
  </svg>
)

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

const NavHome = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? BLUE : 'none'} stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const NavCoin = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
)
const NavTx = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
)
const NavUser = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? BLUE : '#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

export default function DriverDashboard() {
  const router = useRouter()
  const [showBal, setShowBal] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showDetailsSheet, setShowDetailsSheet] = useState(false)
  const [tagNumber, setTagNumber] = useState('')
  const [picFile, setPicFile] = useState<File | null>(null)
  const [picPreview, setPicPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [detailsError, setDetailsError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const token = getToken()
    api.driverProfile(token).then(setProfile).catch(() => {})
    api.walletBalance(token).then(setBalance).catch(() => {})
    api.walletTransactions(token).then(res => setTransactions(res?.items ?? [])).catch(() => {})
  }, [])

  const handlePicSelect = (file: File) => {
    setPicFile(file)
    setPicPreview(URL.createObjectURL(file))
  }

  const handleSaveDetails = async () => {
    if (saving) return
    setSaving(true)
    setDetailsError('')
    try {
      const fd = new FormData()
      if (picFile) fd.append('profilePicture', picFile)
      if (tagNumber.trim()) fd.append('driverTagNumber', tagNumber.trim())
      await api.driverDetails(fd, getToken())
      setShowDetailsSheet(false)
    } catch (err) {
      setDetailsError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column', paddingBottom: 80 }}>

      {/* HEADER */}
      <div style={{ background: 'white', padding: '52px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div onClick={() => setShowDetailsSheet(true)} style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}>
          <Avatar name={profile?.fullName ?? getSavedName()} src={picPreview} size={46} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderRadius: '50%', background: BLUE, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, color: '#666', margin: 0 }}>Welcome Back</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#333', margin: 0 }}>{profile?.fullName ?? (getSavedName() || 'Driver')}</p>
        </div>
        <button
          onClick={() => profile?.driverTagNumber ? router.push('/my-qr-code') : setShowDetailsSheet(true)}
          aria-label="Show QR code"
          style={{ width: 38, height: 38, borderRadius: '50%', background: '#F2F2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <IconQr />
        </button>
        <button onClick={() => router.push('/notifications')} aria-label="Notifications" style={{ width: 38, height: 38, borderRadius: '50%', background: '#F2F2F2', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292D32" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* BALANCE CARD */}
        <div style={{ borderRadius: 20, background: '#3A3A3A', padding: '20px 20px 22px', position: 'relative', overflow: 'hidden', minHeight: 165 }}>
          {/* Piggy bank — large, right side overflowing */}
          <Image src={piggyImg} alt="" style={{ position: 'absolute', right: -20, bottom: -35, width: 190, height: 'auto', objectFit: 'contain', pointerEvents: 'none' }} />

          {/* Top row: Total Earnings pill (left) + Transaction History (right) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, position: 'relative', zIndex: 1 }}>
            <div style={{ background: 'rgb(230,230,230)', borderRadius: 999, padding: '5px 14px' }}>
              <span style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>Total Earnings</span>
            </div>
            <button onClick={() => router.push('/transaction-history')} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: 'white', fontSize: 13, fontWeight: 400 }}>
              Transaction History
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          {/* Balance — white */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, position: 'relative', zIndex: 1 }}>
            <span style={{ fontSize: 30, fontWeight: 700, color: 'white', letterSpacing: -0.5 }}>
              {balance === null ? '—' : showBal ? `₦${balance.toLocaleString()}` : '₦• • • •'}
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
          <button onClick={() => router.push('/withdrawal')} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'white', border: 'none', borderRadius: 999, padding: '12px', cursor: 'pointer', color: BLUE, fontSize: 15, fontWeight: 600, width: '100%' }}>
            Withdraw
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* TRANSACTIONS */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#333', margin: 0 }}>Transactions</p>
            <button onClick={() => router.push('/transaction-history')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: BLUE, fontWeight: 500 }}>See all</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {transactions.length === 0 ? (
              <p style={{ fontSize: 13, color: '#999', textAlign: 'center', padding: '20px 0' }}>No transactions yet</p>
            ) : (
              transactions.slice(0, 3).map(tx => {
                const isCredit = tx.type === 'TOPUP'
                return (
                  <div key={tx._id} style={{ background: '#FBFBFB', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 12, background: '#EDEDED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isCredit ? <IconBank /> : <IconSend />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, color: '#333', margin: '0 0 2px' }}>{tx.metadata?.remark || (isCredit ? 'Wallet Top Up' : tx.type)}</p>
                      <p style={{ fontSize: 11, color: '#666', margin: 0 }}>{timeLabel(tx.createdAt)}</p>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 700, color: isCredit ? '#4FDB5F' : '#F94242', margin: 0 }}>
                      {isCredit ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* DRIVER DETAILS BOTTOM SHEET */}
      {showDetailsSheet && (
        <>
          <div onClick={() => setShowDetailsSheet(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 40 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderRadius: '24px 24px 0 0', zIndex: 50, padding: '20px 24px 40px' }}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: 0 }}>Update Profile</p>
              <button onClick={() => setShowDetailsSheet(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Profile picture */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Avatar name={profile?.fullName ?? getSavedName()} src={picPreview} size={80} style={{ border: '2px solid #e5e7eb' }} />
                <label style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: BLUE, border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && handlePicSelect(e.target.files[0])} />
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </label>
              </div>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Tap to change photo</p>
            </div>

            {/* Tag number */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Driver Tag Number</p>
              <input
                type="text"
                value={tagNumber}
                onChange={e => setTagNumber(e.target.value)}
                placeholder="e.g. 123456"
                style={{ width: '100%', height: 52, borderRadius: 14, border: '1px solid #e5e7eb', padding: '0 16px', fontSize: 14, color: '#111', outline: 'none', background: 'white', boxSizing: 'border-box' }}
              />
            </div>

            {detailsError && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: '0 0 12px' }}>{detailsError}</p>}

            <button
              onClick={handleSaveDetails}
              disabled={saving || (!picFile && !tagNumber.trim())}
              style={{ width: '100%', height: 52, borderRadius: 999, background: saving || (!picFile && !tagNumber.trim()) ? '#93c5fd' : BLUE, color: 'white', fontWeight: 600, fontSize: 15, border: 'none', cursor: saving || (!picFile && !tagNumber.trim()) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {saving ? <><span>Saving</span><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10"/></svg></> : 'Save Changes'}
            </button>
          </div>
        </>
      )}

      {/* BOTTOM NAV */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderTop: '1px solid #F0F0F0', display: 'flex', padding: '10px 0 20px', zIndex: 100 }}>
        {[
          { id: 'home',         label: 'Home',         Icon: NavHome },
          { id: 'earnings',     label: 'Earnings',     Icon: NavCoin },
          { id: 'transactions', label: 'Transactions', Icon: NavTx   },
          { id: 'profile',      label: 'Profile',      Icon: NavUser },
        ].map(({ id, label, Icon }) => {
          const active = activeTab === id
          const dest = ({ earnings: '/driver-earnings', transactions: '/transaction-history', profile: '/driver-profile' } as Record<string, string>)[id]
          return (
            <button key={id} onClick={() => { setActiveTab(id); if (dest) router.push(dest) }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0' }}>
              <Icon active={active} />
              <span style={{ fontSize: 10, fontWeight: 500, color: active ? BLUE : '#666' }}>{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
