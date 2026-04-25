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
    <div className="fixed inset-0 flex items-center justify-center bg-[#0057FF]">
      <img src={logoMark} alt="OWA" className="w-56 h-auto" />
    </div>
  )
}
