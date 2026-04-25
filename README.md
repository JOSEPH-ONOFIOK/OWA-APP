# OWA — On-Wheels App

A React-based mobile-first web app for an on-demand driver/delivery service. Built with Vite, React 19, React Router, and Tailwind CSS.

## Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | SplashScreen | App launch screen |
| `/onboarding` | Onboarding | Intro slides |
| `/welcome` | WelcomeLoading | Loading/transition screen |
| `/role` | UserRoleSelection | Choose Driver or Rider |
| `/signup` | SignUp | Phone number registration |
| `/otp` | OTPVerification | OTP code entry |
| `/create-password` | CreatePassword | Set account password |
| `/login` | Login | Phone + password login |
| `/check-email` | CheckEmail | Password reset email prompt |
| `/reset-password` | ResetPassword | Set new password |
| `/driver-info` | DriverInfo | Driver profile + photo setup |
| `/bank-setup` | BankSetup | Driver bank account setup |
| `/student-info` | StudentInfo | Passenger profile photo upload |
| `/dashboard` | StudentDashboard | Student home — balance, quick actions, transactions |

## Tech Stack

- **React 19** with hooks
- **React Router v7** for navigation
- **Tailwind CSS v4** for styling
- **Vite 8** for bundling

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
```
