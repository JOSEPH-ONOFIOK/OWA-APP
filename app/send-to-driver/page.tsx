"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { pushWithState } from "@/lib/wizardState";

const BLUE = '#0066FF'

export default function SendToDriver() {
  const router = useRouter()
  const [tagId, setTagId] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const canProceed = tagId.trim().length > 0

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 12, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>Transfer Money</span>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>

        {/* AVAILABLE AMOUNT CARD */}
        <div style={{
          border: `1.5px solid ${BLUE}`,
          borderRadius: 16,
          padding: '20px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 13, color: BLUE, fontWeight: 500, margin: '0 0 8px' }}>Available amount</p>
          <p style={{ fontSize: 38, fontWeight: 700, color: '#111', margin: 0, letterSpacing: -1 }}>₦4,200</p>
        </div>

        {/* DRIVER TAG ID */}
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111', margin: '0 0 10px' }}>Driver Tag ID</p>
          <input
            ref={inputRef}
            type="text"
            value={tagId}
            onChange={e => setTagId(e.target.value)}
            placeholder="Enter Tag ID"
            autoFocus
            style={{
              width: '100%',
              height: 54,
              borderRadius: 14,
              border: '1.5px solid #E5E7EB',
              padding: '0 16px',
              fontSize: 15,
              color: '#111',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
            onFocus={e => (e.target.style.borderColor = BLUE)}
            onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
          />
        </div>

        {/* OR DIVIDER */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: 13, color: '#666', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        {/* SCAN QR CODE */}
        <button
          onClick={() => router.push('/scan-qr')}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 14,
            background: '#EEF4FF',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <path d="M14 17h.01M14 20h3v-3M20 17h.01M20 20h.01"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 500, color: BLUE }}>Scan QR Code</span>
        </button>
      </div>

      {/* PROCEED BUTTON */}
      <div style={{ padding: '0 20px 40px' }}>
        <button
          onClick={() => canProceed && pushWithState(router, '/transfer-amount', { driverId: tagId })}
          style={{
            width: '100%',
            height: 56,
            borderRadius: 999,
            background: canProceed ? BLUE : '#98BDFF',
            border: 'none',
            cursor: canProceed ? 'pointer' : 'default',
            fontSize: 16,
            fontWeight: 600,
            color: 'white',
          }}
        >
          Proceed
        </button>
      </div>
    </div>
  )
}
