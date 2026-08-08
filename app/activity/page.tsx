"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BLUE = '#0066FF'
const YELLOW = '#F5A623'

const ranges = {
  'This Week':  { total: 1200, trips: 8,  days: [800, 400, 1100, 200, 1200, 0, 0], bus: 6, bike: 2 },
  'This Month': { total: 5400, trips: 31, days: [1200, 900, 1400, 700, 1600, 300, 300], bus: 22, bike: 9 },
  'All Time':   { total: 18650, trips: 104, days: [2200, 1800, 2600, 1500, 2400, 900, 900], bus: 78, bike: 26 },
}
const days = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun']

export default function Activity() {
  const router = useRouter()
  const [range, setRange] = useState<keyof typeof ranges>('This Week')
  const data = ranges[range]
  const maxVal = Math.max(...data.days, 1)
  const activeDay = data.days.indexOf(Math.max(...data.days))
  const busPct = Math.round((data.bus / (data.bus + data.bike)) * 100)

  return (
    <div style={{ minHeight: '100dvh', background: '#F5F5F5', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <div style={{ background: 'white', padding: '52px 20px 0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 10, background: '#F5F5F5', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span style={{ fontSize: 18, fontWeight: 500, color: '#333' }}>My Spending</span>
      </div>

      {/* RANGE TABS */}
      <div style={{ background: 'white', padding: '20px 20px 24px', display: 'flex', gap: 8 }}>
        {(Object.keys(ranges) as (keyof typeof ranges)[]).map(r => (
          <button
            key={r}
            onClick={() => setRange(r)}
            style={{
              padding: '9px 16px', borderRadius: 999, border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
              background: range === r ? BLUE : 'transparent',
              color: range === r ? 'white' : '#666',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* TOTAL SPENT */}
        <div style={{ border: `1.5px solid ${BLUE}`, borderRadius: 16, padding: '20px', textAlign: 'center', background: 'white' }}>
          <div style={{ display: 'inline-block', background: '#EEF4FF', borderRadius: 999, padding: '5px 14px', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: BLUE, fontWeight: 500 }}>Total Spent</span>
          </div>
          <p style={{ fontSize: 32, fontWeight: 800, color: '#111', margin: '0 0 4px', letterSpacing: -1 }}>
            ₦{data.total.toLocaleString()}
          </p>
          <p style={{ fontSize: 13, color: '#999', margin: 0 }}>{data.trips} trips {range.toLowerCase()}</p>
        </div>

        {/* DAILY BREAKDOWN */}
        <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 3px' }}>Daily Breakdown</p>
              <p style={{ fontSize: 12, color: '#999', margin: 0 }}>March 20th, 2026</p>
            </div>
            <button style={{ width: 32, height: 32, borderRadius: 8, background: '#F8F8F8', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 130 }}>
            {data.days.map((val, i) => {
              const isActive = i === activeDay
              const pct = (val / maxVal) * 80
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                  {isActive && val > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 600, color: BLUE, whiteSpace: 'nowrap', marginBottom: 2 }}>₦{val.toLocaleString()}</span>
                  )}
                  <div style={{ width: '100%', height: `${Math.max(pct, 3)}%`, background: isActive ? BLUE : '#E0E0E0', borderRadius: 4, minHeight: 4 }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', marginTop: 8 }}>
            {days.map((d, i) => (
              <span key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: i === activeDay ? '#111' : '#999', fontWeight: i === activeDay ? 700 : 400 }}>{d}</span>
            ))}
          </div>
        </div>

        {/* BY CATEGORY */}
        <div style={{ background: 'white', borderRadius: 16, padding: '18px 16px' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#111', margin: '0 0 16px' }}>By Category</p>
          <div style={{ display: 'flex', height: 8, borderRadius: 999, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ width: `${busPct}%`, background: BLUE }} />
            <div style={{ width: `${100 - busPct}%`, background: YELLOW }} />
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE }} />
              <span style={{ fontSize: 13, color: '#666' }}>Bus rides: <span style={{ color: BLUE, fontWeight: 600 }}>{data.bus}</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: YELLOW }} />
              <span style={{ fontSize: 13, color: '#666' }}>Bike rides: <span style={{ color: YELLOW, fontWeight: 600 }}>{data.bike}</span></span>
            </div>
          </div>
        </div>

        {/* VIEW ALL */}
        <button
          onClick={() => router.push('/transaction-history')}
          style={{ width: '100%', height: 56, borderRadius: 999, background: BLUE, border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600, color: 'white' }}
        >
          View all Transactions
        </button>
      </div>
    </div>
  )
}
