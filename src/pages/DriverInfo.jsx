import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const inputCls = 'w-full h-14 rounded-2xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1A6BFF] bg-white transition-colors'

const FieldLabel = ({ icon, text }) => (
  <div className="flex items-center gap-2 mb-2">
    {icon}
    <span className="text-[0.82rem] font-semibold text-gray-700">{text}</span>
  </div>
)

const personIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const carIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

export default function DriverInfo() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ tag: '', vehicle: '' })
  const [sheet, setSheet] = useState(false)

  const canContinue = form.tag.trim() && form.vehicle.trim()

  return (
    <div className="w-full bg-white flex flex-col px-7 pt-12 pb-10 relative" style={{ minHeight: '100dvh' }}>

      {/* Header row */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <span className="text-base font-bold text-gray-900">Additional Information</span>
      </div>

      {/* Profile picture */}
      <div className="flex justify-center mb-10">
        <div className="relative">
          <div className="w-22 h-22 rounded-full border-2 border-[#1A6BFF] bg-gray-100 flex items-center justify-center overflow-hidden">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#1A6BFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <button
            type="button"
            onClick={() => setSheet(true)}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center shadow-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-col gap-5 flex-1">
        <div>
          <FieldLabel icon={personIcon} text="Driver Tag Number" />
          <input type="text" value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} placeholder="Enter your tag number" className={inputCls} />
        </div>

        <div>
          <FieldLabel icon={carIcon} text="Vehicle Type (Bus / Bike / Keke)" />
          <input type="text" value={form.vehicle} onChange={e => setForm({ ...form, vehicle: e.target.value })} placeholder="Enter your vehicle type" className={inputCls} />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button
          onClick={() => navigate('/bank-setup', { state })}
          className={`w-full h-14 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] active:brightness-90 shadow-none ${canContinue ? 'bg-[#1A6BFF] text-white' : 'bg-blue-300 text-white'}`}
        >
          Continue
        </button>
      </div>

      {/* Bottom sheet */}
      {sheet && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setSheet(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 px-7 pt-5 pb-10 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[1rem] font-bold text-gray-900">Profile picture</span>
              <button onClick={() => setSheet(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {[
              {
                label: 'Take picture',
                color: 'text-gray-800',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
              },
              {
                label: 'Choose from gallery',
                color: 'text-gray-800',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>,
              },
              {
                label: 'Delete picture',
                color: 'text-red-500',
                icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
              },
            ].map(({ label, color, icon }) => (
              <button key={label} onClick={() => setSheet(false)} className="flex items-center gap-4 w-full py-4 border-b border-gray-100 last:border-0">
                {icon}
                <span className={`text-sm font-medium ${color}`}>{label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
