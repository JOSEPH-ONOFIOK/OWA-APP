import Image from "next/image";
import logoMark from "@/assets/images/Full Logo Mark 1 1.png";
import heroBg from "@/assets/images/Rectangle 1 (4).png";

const FEATURES = [
  { icon: "⚡", label: "Instant payments" },
  { icon: "🔒", label: "Secure & transparent" },
  { icon: "🎓", label: "Built for campus life" },
];

export default function ShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#f0f4ff]">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[40%] sticky top-0 h-screen flex-col overflow-hidden bg-[#0057FF]">
        <Image
          src={heroBg}
          alt=""
          fill
          sizes="40vw"
          className="object-cover object-center opacity-20 pointer-events-none"
        />
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-14 text-center">
          <Image src={logoMark} alt="OWA" className="w-24 mb-10 drop-shadow-lg" />
          <h2 className="text-white text-[2rem] font-bold leading-snug mb-4">
            Campus transport,<br />
            <span className="text-blue-200">reimagined.</span>
          </h2>
          <p className="text-white/60 text-[0.95rem] leading-relaxed max-w-xs">
            Pay drivers, track rides, and manage your wallet — all from one app.
          </p>

          {/* Feature pills */}
          <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
            {FEATURES.map(({ icon, label }) => (
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
  );
}
