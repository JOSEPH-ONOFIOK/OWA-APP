import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
