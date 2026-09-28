"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { api, getToken } from "@/lib/api";
import { encodeDriverQr } from "@/lib/qr";

const BLUE = '#0066FF'

interface Profile {
  fullName?: string
  driverTagNumber?: string
}

export default function MyQrCode() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.driverProfile(getToken())
      .then(setProfile)
      .catch(err => setError((err as Error).message))
  }, [])

  useEffect(() => {
    if (!profile?.driverTagNumber) return
    let cancelled = false
    QRCode.toDataURL(encodeDriverQr(profile.driverTagNumber), { width: 320, margin: 1, color: { dark: '#111827', light: '#ffffff' } })
      .then(url => { if (!cancelled) setDataUrl(url) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [profile?.driverTagNumber])

  const handleDownload = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `owa-qr-code-${profile?.driverTagNumber ?? 'code'}.png`
    a.click()
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ padding: '52px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Payment QR Code</span>
      </div>

      <div style={{ flex: 1, padding: '28px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ fontSize: 14, color: '#666', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.5 }}>
          Riders scan this to pay you instantly
        </p>

        {!profile?.driverTagNumber ? (
          <p style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 40, lineHeight: 1.6 }}>
            {error || 'Set a driver tag number from your dashboard to get your payment code.'}
          </p>
        ) : (
          <>
            <div style={{ width: '100%', maxWidth: 320, background: BLUE, borderRadius: 24, padding: '24px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', margin: '0 0 4px' }}>Paying</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: '0 0 18px' }}>{profile.fullName ?? 'Driver'}</p>

              <div style={{ background: 'white', borderRadius: 16, padding: 16, width: '100%', display: 'flex', justifyContent: 'center' }}>
                {dataUrl
                  // eslint-disable-next-line @next/next/no-img-element -- data: URL generated client-side, not a next/image-compatible source
                  ? <img src={dataUrl} alt="Your OWA payment QR code" width={260} height={260} />
                  : (
                    <div style={{ width: 260, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #E5E7EB', borderTopColor: BLUE, animation: 'spin 0.8s linear infinite' }} />
                    </div>
                  )
                }
              </div>

              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '18px 0 2px' }}>Driver Tag</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'white', margin: 0, letterSpacing: 1 }}>{profile.driverTagNumber}</p>
            </div>

            <button
              onClick={handleDownload}
              disabled={!dataUrl}
              style={{ width: '100%', maxWidth: 320, height: 52, borderRadius: 999, background: 'white', border: '1.5px solid #E5E7EB', cursor: dataUrl ? 'pointer' : 'default', fontSize: 14, fontWeight: 600, color: '#111', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Code
            </button>
          </>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
