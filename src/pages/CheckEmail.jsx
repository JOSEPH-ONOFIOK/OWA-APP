import { useNavigate } from 'react-router-dom'

export default function CheckEmail() {
  const navigate = useNavigate()

  return (
    <div className="w-full bg-white flex flex-col items-center px-6 pt-12 pb-10" style={{ minHeight: '100dvh' }}>

      {/* Illustration */}
      <div className="flex flex-col items-center mb-8 mt-8">
        <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#1A6BFF] flex items-center justify-center relative">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#60a5fa] border-2 border-white" />
          </div>
        </div>

        <h1 className="text-[1.6rem] font-bold text-gray-900 mb-3 text-center">Check your email</h1>
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          We have sent a password recovery key to your email
        </p>
      </div>

      <div className="w-full flex flex-col gap-3 mt-2">
        <button
          onClick={() => navigate('/create-password')}
          className="w-full h-14 rounded-2xl bg-[#1A6BFF] text-white font-semibold text-base active:scale-[0.98] transition-transform"
        >
          Open email app
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full h-14 rounded-2xl text-gray-600 font-semibold text-base"
        >
          Skip I'll confirm later
        </button>
      </div>

      <p className="mt-auto pt-10 text-center text-xs text-gray-400 leading-relaxed">
        didn't receive the email? Check your spam filler,{' '}
        <br />or{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-[#1A6BFF] cursor-pointer"
        >
          try using your phone number
        </span>
      </p>
    </div>
  )
}
