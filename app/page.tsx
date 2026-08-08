"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import logoMark from "@/assets/images/Full Logo Mark 1 1.png";
import Image from "next/image";

export default function SplashScreen() {
  const router = useRouter()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#0057FF')
    document.body.style.background = '#0057FF'
    const timer = setTimeout(() => router.push('/onboarding'), 2500)
    return () => {
      clearTimeout(timer)
      document.body.style.background = ''
    }
  }, [router])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0057FF]">
      <Image src={logoMark} alt="OWA" className="w-56 h-auto" priority />
    </div>
  )
}
