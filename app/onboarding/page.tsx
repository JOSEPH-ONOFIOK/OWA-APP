"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import slide1Bg from "@/assets/images/Rectangle 1.png";
import slide2Bg from "@/assets/images/Rectangle 1 (5).png";
import slide3Bg from "@/assets/images/Rectangle 1 (3).png";

const slides = [
  {
    bg: slide1Bg,
    title: { before: 'Skip the ', highlight: 'Cash', after: ' Stress' },
    subtitle: 'No more waiting for change from bus or bike drivers. Pay quickly and get to class on time.',
  },
  {
    bg: slide2Bg,
    title: { before: 'One Wallet for Every ', highlight: 'Ride', after: '' },
    subtitle: 'Fund your OWA wallet once and pay any registered campus driver instantly.',
  },
  {
    bg: slide3Bg,
    title: { before: 'Fast, ', highlight: 'Secure', after: ' and Transparent' },
    subtitle: 'Every payment is recorded to keep both students and drivers safe and accountable.',
  },
]

export default function Onboarding() {
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', '#000000')
    document.body.style.background = '#000000'
    return () => {
      if (meta) meta.setAttribute('content', '#ffffff')
      document.body.style.background = ''
    }
  }, [])

  const goNext = useCallback(() => {
    setCurrent(c => (c + 1) % slides.length)
  }, [])

  // swipeKey resets the auto-advance timer whenever the user interacts
  const [swipeKey, setSwipeKey] = useState(0)

  useEffect(() => {
    const id = setInterval(goNext, 4000)
    return () => clearInterval(id)
  }, [goNext, swipeKey])

  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX
    const onEnd = (ev: TouchEvent) => {
      const dx = ev.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) {
        setCurrent(c => {
          if (dx < 0) return (c + 1) % slides.length
          return (c - 1 + slides.length) % slides.length
        })
        setSwipeKey(k => k + 1)
      }
      document.removeEventListener('touchend', onEnd)
    }
    document.addEventListener('touchend', onEnd)
  }

  const slide = slides[current]

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
    >
      {/* Full-screen background photo */}
      <Image
        src={slide.bg}
        alt=""
        fill
        sizes="100vw"
        priority
        className="object-cover object-top"
      />

      {/* Gradient: solid black at bottom fading to transparent ~75% up */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, #000 0%, rgba(0,0,0,0.92) 38%, rgba(0,0,0,0.45) 58%, transparent 78%)',
        }}
      />

      {/* Vignette — darkens corners and edges for a polished framed look */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Bottom content */}
      <div className="absolute bottom-0 left-5 right-5 flex flex-col gap-4 pt-6 pb-10">

        {/* Title */}
        <h1 className="text-white text-[1.85rem] font-bold leading-snug">
          {slide.title.before}
          <span className="text-[#0066FF]">{slide.title.highlight}</span>
          {slide.title.after}
        </h1>

        {/* Subtitle */}
        <p className="text-white/65 text-[0.875rem] leading-relaxed">
          {slide.subtitle}
        </p>

        {/* Dot indicators — centered */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setSwipeKey(k => k + 1) }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-7 bg-[#0066FF]' : 'w-2 bg-white/35'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/login')}
            className="w-full rounded-full bg-[#0066FF] text-white font-semibold text-base"
            style={{ height: '56px' }}
          >
            Login
          </button>
          <button
            onClick={() => router.push('/role')}
            className="w-full rounded-full bg-white text-[#0066FF] font-semibold text-base"
            style={{ height: '56px' }}
          >
            Sign Up
          </button>
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-white/45">
          joining our app means you agree with our{' '}
          <span className="text-[#0066FF] underline cursor-pointer">Terms of Use</span>
          {' '}and{' '}
          <span className="text-[#0066FF] underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>

    </div>
  )
}
