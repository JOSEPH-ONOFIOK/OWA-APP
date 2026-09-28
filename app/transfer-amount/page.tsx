"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { pushWithState, useWizardState } from "@/lib/wizardState";
import Avatar from "@/components/Avatar";

const BLUE = '#0066FF'

interface TransferAmountState {
  driverId?: string
  tagId?: string
  driverName?: string
}

export default function TransferAmount() {
  const router = useRouter()
  const state = useWizardState<TransferAmountState>()
  const rawDriverId = state?.driverId || state?.tagId
  const driverId = rawDriverId ?? '—'
  const [lookupName, setLookupName] = useState('')

  useEffect(() => {
    if (!rawDriverId) return
    api.driverLookup(rawDriverId, getToken())
      .then(res => setLookupName(res?.fullName || res?.name || ''))
      .catch(() => {})
  }, [rawDriverId])

  const driverName = lookupName || state?.driverName || 'Driver'
  const [amount, setAmount] = useState('')
  const [remark, setRemark] = useState('')
  const [showModal, setShowModal] = useState(false)

  const hasAmount = amount.trim().length > 0 && Number(amount) >= 10

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => router.back()} style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>Transfer Money</span>
        <div style={{ width: 38 }} />
      </div>

      {/* DRIVER PROFILE ROW */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar name={driverName} size={48} />
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 2px' }}>{driverName}</p>
          <p style={{ fontSize: 13, color: '#666', margin: 0 }}>{driverId}</p>
        </div>
      </div>

      {/* AMOUNT CARD */}
      <div style={{ margin: '20px 20px 0', background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '18px 16px' }}>
        <input
          type="number"
          placeholder="₦ 10.00 - 100,000.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{ width: '100%', border: 'none', outline: 'none', fontSize: 22, fontWeight: 600, color: amount ? '#111' : '#999', background: 'transparent', fontFamily: 'inherit' }}
        />
        {amount && <p style={{ fontSize: 13, color: '#999', margin: '4px 0 0' }}>Amount to send</p>}
      </div>

      {/* REMARK CARD */}
      <div style={{ margin: '12px 20px 0', background: 'white', border: '1px solid #E5E7EB', borderRadius: 14, padding: '14px 16px' }}>
        <p style={{ fontSize: 13, color: '#666', margin: '0 0 8px' }}>Remark</p>
        <input
          type="text"
          placeholder="what's this for? (Optional)"
          value={remark}
          onChange={e => setRemark(e.target.value)}
          style={{ width: '100%', border: 'none', borderBottom: '1px solid #E5E7EB', outline: 'none', fontSize: 14, color: '#111', background: 'transparent', padding: '4px 0', fontFamily: 'inherit' }}
        />
      </div>

      {/* CONFIRM BUTTON */}
      <div style={{ padding: '0 20px 40px', marginTop: 'auto' }}>
        <button
          onClick={() => hasAmount && setShowModal(true)}
          style={{ width: '100%', height: 56, borderRadius: 999, background: hasAmount ? BLUE : '#98BDFF', border: 'none', cursor: hasAmount ? 'pointer' : 'default', fontSize: 16, fontWeight: 600, color: 'white' }}
        >
          Confirm
        </button>
      </div>

      {/* REMINDER BOTTOM SHEET */}
      {showModal && (
        <>
          <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, maxWidth: 480, margin: '0 auto', background: 'white', borderRadius: '24px 24px 0 0', zIndex: 50, padding: '24px 20px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>Reminder</span>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#666' }}>×</button>
            </div>
            <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
              Double check the transfer details before you proceed. Please note that successful transfers cannot be reversed.
            </p>
            <div style={{ background: '#F8F9FF', borderRadius: 12, padding: '16px', marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111', margin: '0 0 14px' }}>Transaction Details</p>
              {[
                { label: 'Name', value: driverName },
                { label: 'Driver ID', value: driverId },
                { label: 'Amount', value: `₦${Number(amount).toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: 13, color: '#666' }}>{label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>{value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ flex: 1, height: 52, borderRadius: 999, background: '#F5F5F5', border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: BLUE }}
              >Recheck</button>
              <button
                onClick={() => { setShowModal(false); pushWithState(router, '/enter-pin', { amount, driverName, driverId, remark }) }}
                style={{ flex: 1, height: 52, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'white' }}
              >Pay</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
