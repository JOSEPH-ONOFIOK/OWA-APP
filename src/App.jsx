import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import SplashScreen from './pages/SplashScreen'
import Onboarding from './pages/Onboarding'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import OTPVerification from './pages/OTPVerification'
import UserRoleSelection from './pages/UserRoleSelection'
import DriverInfo from './pages/DriverInfo'
import StudentInfo from './pages/StudentInfo'
import StudentDashboard from './pages/StudentDashboard'
import BankSetup from './pages/BankSetup'
import ResetPassword from './pages/ResetPassword'
import CheckEmail from './pages/CheckEmail'
import CreatePassword from './pages/CreatePassword'
import WelcomeLoading from './pages/WelcomeLoading'
import Transfer from './pages/Transfer'
import SendToDriver from './pages/SendToDriver'
import DriverDashboard from './pages/DriverDashboard'
import PassengerProfile from './pages/PassengerProfile'
import DriverProfile from './pages/DriverProfile'
import AddMoney from './pages/AddMoney'
import PaymentSuccess from './pages/PaymentSuccess'
import TransferAmount from './pages/TransferAmount'
import SetupPin from './pages/SetupPin'
import EnterPin from './pages/EnterPin'
import Receipt from './pages/Receipt'
import DriverDocuments from './pages/DriverDocuments'
import DriverReview from './pages/DriverReview'
import DriverSubmitted from './pages/DriverSubmitted'
import logoMark from './assets/images/Full Logo Mark 1 1.png'
import heroBg from './assets/images/Rectangle 1 (4).png'

const FULL_BLEED = ['/', '/onboarding', '/welcome', '/welcome-back', '/dashboard', '/driver-dashboard', '/transfer', '/send-to-driver', '/transfer-amount', '/enter-pin', '/receipt', '/profile', '/driver-profile', '/add-money', '/payment-success', '/setup-pin', '/driver-documents', '/driver-review', '/driver-submitted']

function Layout({ children }) {
  const { pathname } = useLocation()

  if (FULL_BLEED.includes(pathname)) return <>{children}</>

  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* Brand panel â€” desktop only */}
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
            Pay drivers, track rides, and manage your wallet â€” all from one app.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
            {[
              { icon: 'âš¡', label: 'Instant payments' },
              { icon: 'ðŸ”’', label: 'Secure & transparent' },
              { icon: 'ðŸŽ“', label: 'Built for campus life' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 rounded-2xl px-4 py-3">
                <span className="text-lg">{icon}</span>
                <span className="text-white/80 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 pb-6 text-center text-white/25 text-xs">
          Â© 2025 OWA. All rights reserved.
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
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/bank-setup" element={<BankSetup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/create-password" element={<CreatePassword />} />
          <Route path="/welcome" element={<WelcomeLoading />} />
          <Route path="/welcome-back" element={<WelcomeLoading />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/send-to-driver" element={<SendToDriver />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          <Route path="/profile" element={<PassengerProfile />} />
          <Route path="/driver-profile" element={<DriverProfile />} />
          <Route path="/add-money" element={<AddMoney />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/transfer-amount" element={<TransferAmount />} />
          <Route path="/setup-pin" element={<SetupPin />} />
          <Route path="/enter-pin" element={<EnterPin />} />
          <Route path="/receipt" element={<Receipt />} />
          <Route path="/driver-documents" element={<DriverDocuments />} />
          <Route path="/driver-review" element={<DriverReview />} />
          <Route path="/driver-submitted" element={<DriverSubmitted />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App

