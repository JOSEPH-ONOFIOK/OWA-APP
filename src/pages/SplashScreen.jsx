import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logoMark from '../assets/images/Full Logo Mark 1 1.png'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/onboarding'), 2500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex items-center justify-center w-full bg-[#0057FF]" style={{ height: '100dvh' }}>
      <img src={logoMark} alt="OWA" className="w-56 h-auto" />
    </div>
  )
}
