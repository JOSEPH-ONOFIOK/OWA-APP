"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { pushWithState } from "@/lib/wizardState";

const BLUE = '#0066FF'

interface WalletProfile {
  wallet?: { balance?: number; bankName?: string; accountNumber?: string }
}

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/>
    <path d="M2 11l10-7 10 7"/>
  </svg>
)

export default function Withdrawal() {
  const router = useRouter()
  const [profile, setProfile] = useState<WalletProfile | null>(null)
  const [selected, setSelected] = useState(true)

  useEffect(() => {
    api.walletDetails(getToken()).then(setProfile).catch(() => {})
  }, [])

  const wallet = profile?.wallet
  const balance = wallet?.balance ?? 0
  const hasBank = Boolean(wallet?.bankName)
  const canWithdraw = hasBank && selected && balance > 0

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
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Withdrawal</span>
      </div>

      <div style={{ flex: 1, padding: '32px 20px 0' }}>

        {/* AVAILABLE AMOUNT */}
        <div style={{ border: `1.5px solid ${BLUE}`, borderRadius: 16, padding: '20px', textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-block', background: '#EEF4FF', borderRadius: 999, padding: '5px 14px', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: BLUE, fontWeight: 500 }}>Available amount</span>
          </div>
          <p style={{ fontSize: 34, fontWeight: 800, color: '#111', margin: 0, letterSpacing: -1 }}>
            ₦{balance.toLocaleString()}
          </p>
        </div>

        {/* WITHDRAW TO */}
        <p style={{ fontSize: 15, color: '#666', margin: '0 0 12px' }}>Withdraw to</p>

        {hasBank && wallet && (
          <button
            onClick={() => setSelected(true)}
            style={{
              width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
              borderRadius: 16, border: `1.5px solid ${selected ? BLUE : '#E5E7EB'}`,
              padding: '16px', marginBottom: 16, background: 'white', cursor: 'pointer',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <BankIcon />
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{wallet.bankName}</p>
              <p style={{ fontSize: 13, color: '#999', margin: 0 }}>
                {'*'.repeat(4)}{String(wallet.accountNumber ?? '').slice(-6)}
              </p>
            </div>
          </button>
        )}

        <button
          onClick={() => router.push('/bank-setup')}
          style={{
            width: '100%', borderRadius: 16, border: '2px dashed #D5D5D5',
            padding: '24px 16px', background: 'none', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}
        >
          <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#111', margin: '0 0 2px' }}>Link New Account</p>
            <p style={{ fontSize: 13, color: '#999', margin: 0 }}>Add a new bank or debit card</p>
          </div>
        </button>
      </div>

      {/* WITHDRAW BUTTON */}
      <div style={{ padding: '20px 20px 40px' }}>
        <button
          onClick={() => canWithdraw && pushWithState(router, '/enter-pin', { type: 'withdrawal', amount: balance })}
          disabled={!canWithdraw}
          style={{
            width: '100%', height: 56, borderRadius: 999, border: 'none',
            background: canWithdraw ? BLUE : '#98BDFF',
            cursor: canWithdraw ? 'pointer' : 'default',
            fontSize: 16, fontWeight: 600, color: 'white',
          }}
        >
          {hasBank ? `Withdraw ₦${balance.toLocaleString()}` : 'Link a bank account to withdraw'}
        </button>
      </div>
    </div>
  )
}
