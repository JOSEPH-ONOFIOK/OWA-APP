import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Spinner = ({ color }) => (
  <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
    <circle cx="12" cy="12" r="10" strokeOpacity=".2"/>
    <path d="M12 2a10 10 0 0110 10"/>
  </svg>
)

export default function WelcomeLoading() {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  const isReturning = pathname === '/welcome-back'
  const role = state?.role ?? 'passenger'

  useEffect(() => {
    const dest = isReturning
      ? '/login'
      : role === 'driver' ? '/driver-info' : '/login'
    const id = setTimeout(() => navigate(dest, { state }), 2500)
    return () => clearTimeout(id)
  }, [navigate, isReturning, role, state])

  /* ── Returning user: blue screen ── */
  if (isReturning) {
    return (
      <div className="w-full bg-[#1A6BFF] flex flex-col" style={{ height: '100dvh' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-white px-8">
            <p className="text-xl font-normal opacity-80 mb-1">OWA Says</p>
            <p className="text-[1.75rem] font-bold">Welcome Back!</p>
          </div>
        </div>
        <div className="flex justify-center pb-14">
          <Spinner color="rgba(255,255,255,0.7)" />
        </div>
      </div>
    )
  }

  /* ── New user: white riders community screen ── */
  return (
    <div className="w-full bg-white flex flex-col px-6 pt-14 pb-10" style={{ height: '100dvh' }}>
      <p className="text-gray-400 text-base mb-0.5">Welcome to</p>
      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-8">
        OWA Riders community
      </h1>

      <div className="flex-1 bg-gray-200 rounded-3xl" />

      <div className="flex justify-center pt-8">
        <Spinner color="#1A6BFF" />
      </div>
    </div>
  )
}
