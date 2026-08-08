"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { pushWithState } from "@/lib/wizardState";

import bankImg from "@/assets/images/figma-transfer-bank-img.png";
import busImg  from "@/assets/images/figma-transfer-bus-img.png";
import owaImg  from "@/assets/images/figma-transfer-owa-img.png";

const cards = [
  { id: 'bank', label: 'Bank account', bg: '#0057D9', img: bankImg },
  { id: 'bus',  label: 'Bus Driver',   bg: '#F5A623', img: busImg  },
  { id: 'owa',  label: 'Owa User',     bg: '#3DC45A', img: owaImg  },
]

export default function Transfer() {
  const router = useRouter()

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
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>Transfer Money</span>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: '32px 20px' }}>
        <p style={{ fontSize: 15, fontWeight: 500, color: '#666', margin: '0 0 20px' }}>Transfer to</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {cards.map(({ id, label, bg, img }) => (
            <button
              key={id}
              onClick={() => pushWithState(router, '/send-to-driver', { type: id })}
              style={{
                background: bg,
                border: 'none',
                borderRadius: 18,
                height: 130,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                padding: '0 0 0 20px',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: 18, fontWeight: 500, color: 'white', paddingBottom: 20, position: 'relative', zIndex: 1 }}>{label}</span>
              <Image
                src={img}
                alt={label}
                style={{ height: '100%', width: 'auto', objectFit: 'contain', objectPosition: 'bottom right', flexShrink: 0 }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
