"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { pushWithState, useWizardState } from "@/lib/wizardState";

const Spinner = ({ color }: { color: string }) => (
  <svg className="animate-spin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2">
    <circle cx="12" cy="12" r="10" strokeOpacity=".2"/>
    <path d="M12 2a10 10 0 0110 10"/>
  </svg>
)

interface WelcomeState {
  role?: 'driver' | 'passenger'
}

export default function WelcomeLoadingView({ isReturning }: { isReturning: boolean }) {
  const router = useRouter()
  const state = useWizardState<WelcomeState>()
  const role = state?.role ?? 'passenger'

  useEffect(() => {
    const dest = isReturning
      ? '/login'
      : role === 'driver' ? '/driver-info' : '/student-info'
    const id = setTimeout(() => pushWithState(router, dest, state), 2500)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturning, role])

  /* ── Returning user: blue screen ── */
  if (isReturning) {
    return (
      <div className="fixed inset-0 bg-[#0066FF] flex flex-col">
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
    <div className="fixed inset-0 bg-white flex flex-col px-6 pt-14 pb-10">
      <p className="text-gray-400 text-base mb-0.5">Welcome to</p>
      <h1 className="text-[1.7rem] font-bold text-gray-900 leading-tight mb-8">
        OWA Riders community
      </h1>

      <div className="flex-1 bg-gray-200 rounded-3xl" />

      <div className="flex justify-center pt-8">
        <Spinner color="#0066FF" />
      </div>
    </div>
  )
}
