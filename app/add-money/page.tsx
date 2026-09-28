"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { BANKS } from "@/lib/banks";

const BLUE = '#0066FF'

interface WalletProfile {
  wallet?: { bankName?: string; accountNumber?: string; accountName?: string }
}

type Method = 'bank' | 'card' | 'ussd'

const inputStyle = {
  width: '100%', height: 52, borderRadius: 14,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box' as const,
}

const Label = ({ text }: { text: string }) => (
  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>{text}</p>
)

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
  </svg>
)

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const Spinner = () => (
  <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: BLUE, animation: 'spin 0.8s linear infinite' }} />
)

function Row({ label, value, big, copyKey, copied, onCopy }: { label: string; value: string; big?: boolean; copyKey: string; copied: string; onCopy: (key: string, value: string) => void }) {
  return (
    <div>
      <p style={{ fontSize: 12, color: '#999', margin: '0 0 4px' }}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontSize: big ? 22 : 15, fontWeight: 700, color: '#111', letterSpacing: big ? -0.5 : 0 }}>{value}</span>
        <button
          onClick={() => onCopy(copyKey, value)}
          style={{ background: '#EEF4FF', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
        >
          {copied === copyKey ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
    </div>
  )
}

// ─── BANK TRANSFER TAB ───────────────────────────────────────────────
function BankTab() {
  const [profile, setProfile] = useState<WalletProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  useEffect(() => {
    api.walletDetails(getToken())
      .then(setProfile)
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [])

  const wallet = profile?.wallet
  const hasAccount = Boolean(wallet?.accountNumber)

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(''), 1500)
    }).catch(() => {})
  }

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: 60 }}><Spinner /></div>

  if (!hasAccount) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6 }}>
          {error || "We couldn't load your wallet account details. Please try again."}
        </p>
      </div>
    )
  }

  return (
    <>
      <p style={{ fontSize: 14, color: '#666', margin: '0 0 24px', lineHeight: 1.6, textAlign: 'center' }}>
        Transfer any amount from your bank app to this account. Your OWA wallet balance updates automatically once we receive it.
      </p>
      <div style={{ border: `1.5px solid ${BLUE}`, borderRadius: 20, padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Row label="Bank Name" value={wallet!.bankName ?? '—'} copyKey="bank" copied={copied} onCopy={handleCopy} />
        <div style={{ borderTop: '1px dashed #E5E7EB' }} />
        <Row label="Account Number" value={wallet!.accountNumber ?? '—'} big copyKey="acct" copied={copied} onCopy={handleCopy} />
        <div style={{ borderTop: '1px dashed #E5E7EB' }} />
        <Row label="Account Name" value={wallet!.accountName ?? '—'} copyKey="name" copied={copied} onCopy={handleCopy} />
      </div>
    </>
  )
}

// ─── CARD TAB ────────────────────────────────────────────────────────
function CardTab() {
  const [stage, setStage] = useState<'form' | 'otp' | 'success'>('form')
  const [amount, setAmount] = useState('')
  const [number, setNumber] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [otp, setOtp] = useState('')
  const [txnRef, setTxnRef] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = Number(amount) > 0 && number.length >= 12 && expiryMonth.length === 2 && expiryYear.length === 4 && cvv.length >= 3

  const handleSubmit = async () => {
    if (!canSubmit || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await api.walletTopup({
        amount: Number(amount),
        method: 'card',
        opts: { card: { number, expiryMonth, expiryYear, cvv } },
      }, getToken())

      const otpData = res?.raw?.otpData
      if (res?.requiresOtp || res?.raw?.status === 'OTP_AUTHORIZATION_REQUIRED') {
        setTxnRef(res?.transactionReference ?? res?.raw?.transactionReference ?? '')
        setTokenId(otpData?.id ?? '')
        setStage('otp')
      } else {
        setStage('success')
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleOtpSubmit = async () => {
    if (otp.length < 4 || loading) return
    setLoading(true)
    setError('')
    try {
      await api.authorizeCardOtp({ transactionReference: txnRef, tokenId, token: otp }, getToken())
      setStage('success')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'success') {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <p style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Card top-up successful</p>
        <p style={{ fontSize: 14, color: '#666', margin: 0 }}>₦{Number(amount).toLocaleString()} has been added to your wallet.</p>
      </div>
    )
  }

  if (stage === 'otp') {
    return (
      <div>
        <p style={{ fontSize: 14, color: '#666', margin: '0 0 20px', lineHeight: 1.6, textAlign: 'center' }}>
          Enter the one-time code your bank sent to authorize this card payment.
        </p>
        <Label text="OTP" />
        <input
          type="tel" inputMode="numeric" value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="Enter OTP" style={inputStyle}
        />
        {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: '16px 0 0' }}>{error}</p>}
        <button
          onClick={handleOtpSubmit}
          disabled={otp.length < 4 || loading}
          style={{ width: '100%', height: 56, borderRadius: 999, background: otp.length >= 4 ? BLUE : '#98BDFF', border: 'none', cursor: otp.length >= 4 ? 'pointer' : 'default', fontSize: 16, fontWeight: 600, color: 'white', marginTop: 24 }}
        >
          {loading ? 'Verifying...' : 'Verify & Add Money'}
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Label text="Amount" />
        <input
          type="text" inputMode="decimal" value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
          placeholder="₦ 0.00" style={inputStyle}
        />
      </div>
      <div>
        <Label text="Card Number" />
        <input
          type="text" inputMode="numeric" autoComplete="cc-number" value={number}
          onChange={e => setNumber(e.target.value.replace(/\D/g, '').slice(0, 19))}
          placeholder="1234 5678 9012 3456" style={inputStyle}
        />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Label text="Expiry Month" />
          <input
            type="text" inputMode="numeric" autoComplete="cc-exp-month" value={expiryMonth}
            onChange={e => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
            placeholder="MM" style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Label text="Expiry Year" />
          <input
            type="text" inputMode="numeric" autoComplete="cc-exp-year" value={expiryYear}
            onChange={e => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="YYYY" style={inputStyle}
          />
        </div>
        <div style={{ flex: 1 }}>
          <Label text="CVV" />
          <input
            type="password" inputMode="numeric" autoComplete="cc-csc" value={cvv}
            onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="123" style={inputStyle}
          />
        </div>
      </div>
      {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: 0 }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        style={{ width: '100%', height: 56, borderRadius: 999, background: canSubmit ? BLUE : '#98BDFF', border: 'none', cursor: canSubmit ? 'pointer' : 'default', fontSize: 16, fontWeight: 600, color: 'white', marginTop: 8 }}
      >
        {loading ? 'Processing...' : amount ? `Add ₦${Number(amount).toLocaleString()}` : 'Enter amount'}
      </button>
    </div>
  )
}

// ─── USSD TAB ────────────────────────────────────────────────────────
function UssdTab() {
  const [stage, setStage] = useState<'form' | 'result'>('form')
  const [amount, setAmount] = useState('')
  const [bank, setBank] = useState<{ name: string; code: string } | null>(null)
  const [dropOpen, setDropOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const canSubmit = Number(amount) > 0 && Boolean(bank)

  const handleSubmit = async () => {
    if (!canSubmit || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await api.walletTopup({
        amount: Number(amount),
        method: 'ussd',
        opts: { bankCode: bank!.code },
      }, getToken())
      setMessage(res?.providerResponse?.responseMessage || res?.raw?.message || 'USSD prompt sent. Follow the instructions on your phone to complete this top-up.')
      setStage('result')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (stage === 'result') {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📱</div>
        <p style={{ fontSize: 17, fontWeight: 700, color: '#111', margin: '0 0 8px' }}>Check your phone</p>
        <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6 }}>{message}</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ fontSize: 14, color: '#666', margin: 0, lineHeight: 1.6, textAlign: 'center' }}>
        Enter an amount and pick your bank — we&apos;ll trigger a USSD prompt on your registered phone number to complete the top-up.
      </p>
      <div style={{ position: 'relative' }}>
        <Label text="Bank" />
        <button
          onClick={() => setDropOpen(v => !v)}
          style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: bank ? '#111827' : '#9ca3af', height: 52 }}
        >
          <span>{bank ? bank.name : 'Select your bank'}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        {dropOpen && (
          <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', borderRadius: 14, border: '1px solid #e5e7eb', overflow: 'hidden auto', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', maxHeight: 220 }}>
            {BANKS.map(b => (
              <button key={b.code} onClick={() => { setBank(b); setDropOpen(false) }} style={{ width: '100%', padding: '12px 16px', background: bank?.code === b.code ? '#eff6ff' : 'white', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: bank?.code === b.code ? 600 : 400, color: bank?.code === b.code ? BLUE : '#374151' }}>
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <Label text="Amount" />
        <input
          type="text" inputMode="decimal" value={amount}
          onChange={e => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
          placeholder="₦ 0.00" style={inputStyle}
        />
      </div>
      {error && <p style={{ fontSize: 13, color: '#ef4444', textAlign: 'center', margin: 0 }}>{error}</p>}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        style={{ width: '100%', height: 56, borderRadius: 999, background: canSubmit ? BLUE : '#98BDFF', border: 'none', cursor: canSubmit ? 'pointer' : 'default', fontSize: 16, fontWeight: 600, color: 'white' }}
      >
        {loading ? 'Sending...' : amount ? `Add ₦${Number(amount).toLocaleString()} via USSD` : 'Enter amount'}
      </button>
    </div>
  )
}

// ─── PAGE ────────────────────────────────────────────────────────────
export default function AddMoney() {
  const router = useRouter()
  const [method, setMethod] = useState<Method>('bank')

  const tabs: { id: Method; label: string }[] = [
    { id: 'bank', label: 'Bank Transfer' },
    { id: 'card', label: 'Card' },
    { id: 'ussd', label: 'USSD' },
  ]

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>Add Money</span>
        <div style={{ width: 38 }} />
      </div>

      {/* METHOD TABS */}
      <div style={{ padding: '20px 20px 0', display: 'flex', gap: 8 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setMethod(t.id)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 999, border: method === t.id ? 'none' : '1px solid #E5E7EB', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: method === t.id ? BLUE : 'white',
              color: method === t.id ? 'white' : '#666',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, padding: '28px 20px 40px' }}>
        {method === 'bank' && <BankTab />}
        {method === 'card' && <CardTab />}
        {method === 'ussd' && <UssdTab />}
      </div>

      {/* DONE BUTTON (bank tab only — card/ussd have their own submit buttons) */}
      {method === 'bank' && (
        <div style={{ padding: '0 20px 40px' }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, color: 'white' }}
          >
            Done
          </button>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
