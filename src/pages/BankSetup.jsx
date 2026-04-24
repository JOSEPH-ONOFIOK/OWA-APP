import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Back = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-6 shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  </button>
)

const bankIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/><rect x="5" y="11" width="4" height="10"/><rect x="10" y="11" width="4" height="10"/><rect x="15" y="11" width="4" height="10"/><path d="M2 11l10-7 10 7"/>
  </svg>
)

const inputCls = 'w-full h-14 rounded-2xl border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#1A6BFF] bg-white transition-colors'

export default function BankSetup() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const [form, setForm] = useState({ bank: '', account: '' })

  return (
    <div className="w-full bg-white flex flex-col px-6 pt-12 pb-8" style={{ minHeight: '100dvh' }}>
      <Back onClick={() => navigate(-1)} />

      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-2">Set up bank account</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-8">
        This bank details is where you transfer your OWA money into for personal use.
      </p>

      <div className="flex flex-col gap-5 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {bankIcon}
            <span className="text-[0.82rem] font-semibold text-gray-700">Bank Name</span>
          </div>
          <input
            type="text"
            value={form.bank}
            onChange={e => setForm({ ...form, bank: e.target.value })}
            placeholder="Enter your bank name"
            className={inputCls}
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            {bankIcon}
            <span className="text-[0.82rem] font-semibold text-gray-700">Account Number</span>
          </div>
          <input
            type="tel"
            value={form.account}
            onChange={e => setForm({ ...form, account: e.target.value })}
            placeholder="Enter your 10 digit number"
            maxLength={10}
            className={inputCls}
          />
        </div>
      </div>

      <div className="mt-auto pt-8 flex flex-col gap-3">
        <button
          onClick={() => navigate('/welcome', { state })}
          className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base active:scale-[0.98] transition-transform"
        >
          Save
        </button>
        <button
          onClick={() => navigate('/welcome', { state })}
          className="w-full h-14 rounded-2xl bg-gray-100 text-gray-800 font-semibold text-base active:scale-[0.98] transition-transform"
        >
          Skip for now
        </button>
      </div>
    </div>
  )
}
