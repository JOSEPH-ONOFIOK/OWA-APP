import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import OTPVerification from './pages/OTPVerification'
import UserRoleSelection from './pages/UserRoleSelection'
import DriverInfo from './pages/DriverInfo'
import BankSetup from './pages/BankSetup'
import ResetPassword from './pages/ResetPassword'
import CheckEmail from './pages/CheckEmail'
import CreatePassword from './pages/CreatePassword'
import WelcomeLoading from './pages/WelcomeLoading'
import logoMark from './assets/images/Full Logo Mark 1 1.png'
import heroBg from './assets/images/Rectangle 1 (4).png'

const FULL_BLEED = ['/', '/onboarding', '/welcome', '/welcome-back']

function Layout({ children }) {
  const { pathname } = useLocation()

  if (FULL_BLEED.includes(pathname)) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] sticky top-0 h-screen flex-col overflow-hidden bg-[#0057FF]">
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20 pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-14 text-center">
          <img src={logoMark} alt="OWA" className="w-24 mb-10 drop-shadow-lg" />
          <h2 className="text-white text-[2rem] font-bold leading-snug mb-4">
            Campus transport,<br />
            <span className="text-blue-200">reimagined.</span>
          </h2>
          <p className="text-white/60 text-[0.95rem] leading-relaxed max-w-xs">
            Pay drivers, track rides, and manage your wallet — all from one app.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
            {[
              { icon: '⚡', label: 'Instant payments' },
              { icon: '🔒', label: 'Secure & transparent' },
              { icon: '🎓', label: 'Built for campus life' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <span className="text-lg">{icon}</span>
                <span className="text-white/80 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 pb-6 text-center text-white/25 text-xs">
          © 2025 OWA. All rights reserved.
        </div>
      </div>

      {/* Content panel */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white lg:bg-transparent">
        <div className="flex-1 flex justify-center lg:items-center lg:py-8">
          <div className="w-full max-w-md lg:bg-white lg:rounded-3xl lg:shadow-xl lg:shadow-blue-100/50 lg:mx-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/otp" element={<OTPVerification />} />
          <Route path="/role" element={<UserRoleSelection />} />
          <Route path="/driver-info" element={<DriverInfo />} />
          <Route path="/bank-setup" element={<BankSetup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/welcome" element={<WelcomeLoading />} />
          <Route path="/welcome-back" element={<WelcomeLoading />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
