"use client";

import Link from "next/link";
import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import OwaLogo from "@/components/OwaLogo";
import { getRoleFromToken, getSavedName, getToken, isAdminRole, logout } from "@/lib/api";

const BLUE = "#0066FF";

type NavItem = { label: string; href?: string; icon: React.ReactNode };

const ic = (d: React.ReactNode) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard", href: "/admin/dashboard", icon: ic(<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>) },
      { label: "Analytics", href: "/admin/analytics", icon: ic(<><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></>) },
    ],
  },
  {
    section: "MANAGEMENT",
    items: [
      { label: "Driver Approvals", href: "/admin/driver-approvals", icon: ic(<><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><polyline points="16 11 18 13 22 9" /></>) },
      { label: "Active Drivers", href: "/admin/active-drivers", icon: ic(<><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>) },
      { label: "Vehicles/ Tags", href: "/admin/vehicles", icon: ic(<><rect x="3" y="6" width="18" height="11" rx="2" /><circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" /></>) },
      { label: "Passenger", href: "/admin/passengers", icon: ic(<><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0113 0" /></>) },
    ],
  },
  {
    section: "FINANCE",
    items: [
      { label: "Transactions", href: "/admin/transactions", icon: ic(<><path d="M7 7h13l-3-3M17 17H4l3 3" /></>) },
      { label: "Payments", href: "/admin/payments", icon: ic(<><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>) },
    ],
  },
  {
    section: "SYSTEM",
    items: [
      { label: "Report/ Issues", href: "/admin/reports", icon: ic(<><path d="M4 22V4a1 1 0 011-1h12l-2 4 2 4H5" /></>) },
      { label: "System Announcement", href: "/admin/announcements", icon: ic(<><path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z" /><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" /></>) },
      { label: "Settings", icon: ic(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></>) },
    ],
  },
];

/** Turned off for now: admin pages are open without signing in. Set to true to require an admin login. */
const REQUIRE_ADMIN_LOGIN = false;

/* Admin access: "pending" until the browser has been checked (avoids a server/client mismatch). */
type Access = "pending" | "allowed" | "denied";

const subscribeStorage = (cb: () => void) => {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
};
const readAccess = (): Access => {
  if (!REQUIRE_ADMIN_LOGIN) return "allowed";
  const token = getToken();
  return token && isAdminRole(getRoleFromToken(token)) ? "allowed" : "denied";
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const access = useSyncExternalStore(subscribeStorage, readAccess, (): Access => (REQUIRE_ADMIN_LOGIN ? "pending" : "allowed"));

  useEffect(() => {
    if (!isLogin && access === "denied") router.replace("/admin/login");
  }, [isLogin, access, router]);

  if (isLogin) return <>{children}</>;
  if (access !== "allowed") return <div style={{ minHeight: "100dvh", background: "#f5f6f8" }} />;

  const name = getSavedName() || "Admin Officer";

  return (
    <div style={{ minHeight: "100dvh", background: "#f5f6f8", display: "flex", fontSize: 14, color: "#111827" }}>
      <aside style={{ width: 232, flexShrink: 0, background: "white", borderRight: "1px solid #eef0f3", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100dvh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "22px 22px 18px" }}>
          <OwaLogo size={26} />
          <span style={{ fontWeight: 700, fontSize: 18, color: BLUE }}>Owa</span>
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
          {NAV.map(group => (
            <div key={group.section} style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".06em", color: "#9ca3af", margin: "6px 10px 6px" }}>{group.section}</p>
              {group.items.map(item => {
                const active = !!item.href && pathname?.startsWith(item.href);
                const style: React.CSSProperties = {
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8,
                  fontSize: 13, textDecoration: "none", marginBottom: 2,
                  background: active ? "#eaf2ff" : "transparent",
                  color: active ? BLUE : item.href ? "#374151" : "#9ca3af",
                  fontWeight: active ? 600 : 500,
                };
                return item.href ? (
                  <Link key={item.label} href={item.href} style={style}>{item.icon}{item.label}</Link>
                ) : (
                  <div key={item.label} style={{ ...style, cursor: "not-allowed" }} title="Coming soon">{item.icon}{item.label}</div>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: 14, borderTop: "1px solid #eef0f3" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Avatar name={name} size={34} />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>Transport Dept</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.replace("/admin/login"); }}
            style={{ width: "100%", height: 34, borderRadius: 8, background: "#fef2f2", color: "#ef4444", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
          >
            {ic(<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>)}
            Logout
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
