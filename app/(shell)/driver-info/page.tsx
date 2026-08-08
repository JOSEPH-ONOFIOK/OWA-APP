"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushWithState, useWizardState } from "@/lib/wizardState";

const BLUE = '#0066FF'

const vehicleTypes = ['Bus', 'Bike', 'Keke']

const inputStyle = {
  width: '100%', height: 56, borderRadius: 16,
  border: '1px solid #e5e7eb', padding: '0 16px',
  fontSize: 14, color: '#111827', outline: 'none',
  background: 'white', boxSizing: 'border-box' as const,
}

const Label = ({ text }: { text: string }) => (
  <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>{text}</p>
)

export default function DriverInfo() {
  const router = useRouter()
  const state = useWizardState<Record<string, unknown>>()
  const [form, setForm] = useState({ plateNumber: '', vehicle: '' })
  const [dropOpen, setDropOpen] = useState(false)
  const canContinue = form.plateNumber.trim() && form.vehicle.trim()

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Driver Onboarding</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Step 1 of 2</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '50%', background: BLUE, borderRadius: 999 }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 40px' }}>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Vehicle Details</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 32px', lineHeight: 1.6 }}>
          Enter your vehicle information to get started.
        </p>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>
          <div>
            <Label text="Plate Number" />
            <input
              type="text"
              value={form.plateNumber}
              onChange={e => setForm({ ...form, plateNumber: e.target.value.toUpperCase() })}
              placeholder="e.g. KTU886AM"
              style={inputStyle}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Label text="Vehicle Type" />
            <button
              onClick={() => setDropOpen(v => !v)}
              style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: form.vehicle ? '#111827' : '#9ca3af', height: 56 }}
            >
              <span>{form.vehicle || 'Select vehicle type'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {dropOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'white', borderRadius: 16, border: '1px solid #e5e7eb', overflow: 'hidden', zIndex: 10, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                {vehicleTypes.map(v => (
                  <button key={v} onClick={() => { setForm({ ...form, vehicle: v }); setDropOpen(false) }} style={{ width: '100%', padding: '16px 20px', background: form.vehicle === v ? '#eff6ff' : 'white', border: 'none', borderBottom: '1px solid #f3f4f6', cursor: 'pointer', textAlign: 'left', fontSize: 14, fontWeight: form.vehicle === v ? 600 : 400, color: form.vehicle === v ? BLUE : '#374151' }}>
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Continue button */}
        <button
          onClick={() => canContinue && pushWithState(router, '/driver-documents', { ...state, plateNumber: form.plateNumber, vehicleType: form.vehicle })}
          style={{ width: '100%', height: 56, borderRadius: 999, background: canContinue ? BLUE : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: canContinue ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Continue <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}
