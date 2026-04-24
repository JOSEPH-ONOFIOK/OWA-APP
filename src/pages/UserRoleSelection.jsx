import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

export default function UserRoleSelection() {
  const [selected, setSelected] = useState('passenger')
  const navigate = useNavigate()

  return (
    <div className="w-full bg-white flex flex-col px-6 pt-12 pb-8" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-2">
        Are you a passenger or a driver?
      </h1>
      <p className="text-sm text-gray-400 mb-10">You can change the mode later</p>

      <div className="grid grid-cols-2 gap-4">
        {[
          {
            id: 'passenger',
            label: 'Passenger',
            icon: (active) => (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            ),
          },
          {
            id: 'driver',
            label: 'Driver',
            icon: (active) => (
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={active ? '#1A6BFF' : '#9ca3af'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            ),
          },
        ].map(({ id, label, icon }) => {
          const active = selected === id
          return (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`flex flex-col items-center justify-center gap-3 py-7 rounded-2xl border-2 transition-all ${active ? 'border-[#1A6BFF]' : 'border-gray-200'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-blue-50' : 'bg-gray-100'}`}>
                {icon(active)}
              </div>
              <span className={`text-sm font-semibold ${active ? 'text-[#1A6BFF]' : 'text-gray-500'}`}>{label}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-auto pt-10">
        <button
          onClick={() => navigate('/signup', { state: { role: selected } })}
          className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
