"use client";

import { useSyncExternalStore } from "react";
import OwaLogo from "@/components/OwaLogo";

const DESKTOP_QUERY = "(min-width: 768px)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;
const getServerSnapshot = () => false;

export default function MobileOnlyGate({ children }: { children: React.ReactNode }) {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isDesktop) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center", background: "white" }}>
        <OwaLogo size={56} />
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#111827", margin: "24px 0 10px" }}>
          OWA is a mobile app
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", maxWidth: 340, lineHeight: 1.6, margin: 0 }}>
          Please open this page on your phone to continue. OWA isn&apos;t available on desktop yet.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
