"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setFile } from "@/lib/fileStore";
import { pushWithState, useWizardState } from "@/lib/wizardState";

const BLUE = '#0066FF'

const UploadBox = ({ label, subtitle, fileName, onUpload }: { label: string; subtitle: string; fileName?: string; onUpload: (file: File) => void }) => (
  <div style={{ border: `2px dashed ${fileName ? BLUE : '#e5e7eb'}`, borderRadius: 20, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: fileName ? '#eff6ff' : '#fafafa', transition: 'all 0.2s' }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: fileName ? '#dbeafe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {fileName ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      )}
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: fileName ? BLUE : '#374151', margin: '0 0 4px' }}>
        {fileName || label}
      </p>
      <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{fileName ? 'Tap to replace' : subtitle}</p>
    </div>
    <label style={{ cursor: 'pointer' }}>
      <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
      <div style={{ paddingInline: 20, height: 36, borderRadius: 999, background: fileName ? BLUE : 'white', border: `1.5px solid ${fileName ? BLUE : '#e5e7eb'}`, display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: fileName ? 'white' : '#374151' }}>
        {fileName ? 'Replace' : 'Tap to upload'}
      </div>
    </label>
  </div>
)

export default function DriverDocuments() {
  const router = useRouter()
  const state = useWizardState<Record<string, unknown>>()
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const canContinue = licenseFile && idCardFile

  const handleLicense = (file: File) => { setFile('driversLicense', file); setLicenseFile(file) }
  const handleIdCard  = (file: File) => { setFile('idCard', file);        setIdCardFile(file) }

  return (
    <div style={{ minHeight: '100dvh', background: 'white', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '56px 24px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => router.back()} style={{ width: 40, height: 40, borderRadius: 12, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Driver Onboarding</p>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Step 2 of 2</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '16px 24px 0' }}>
        <div style={{ height: 4, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%', background: BLUE, borderRadius: 999 }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 24px 40px' }}>

        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>Upload Documents</h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 32px', lineHeight: 1.6 }}>
          Upload your documents before submitting. Accepted formats: JPG, PNG, PDF.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <UploadBox
            label="Driver's License"
            subtitle="Upload a clear photo of your license"
            fileName={licenseFile?.name}
            onUpload={handleLicense}
          />
          <UploadBox
            label="OAU Staff / School ID"
            subtitle="Upload your OAU-issued ID card"
            fileName={idCardFile?.name}
            onUpload={handleIdCard}
          />
        </div>

        <button
          onClick={() => canContinue && pushWithState(router, '/driver-review', { ...state, licenseFileName: licenseFile.name, idCardFileName: idCardFile.name })}
          style={{ width: '100%', height: 56, borderRadius: 999, background: canContinue ? BLUE : '#93c5fd', color: 'white', fontWeight: 600, fontSize: 16, border: 'none', cursor: canContinue ? 'pointer' : 'default', marginTop: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  )
}
