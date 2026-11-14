"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import OwaLogo from "@/components/OwaLogo";
import { api, formatPhone, getRoleFromToken, isAdminRole, saveToken } from "@/lib/api";
import { Button, C } from "@/components/admin/ui";

const input: React.CSSProperties = { width: "100%", height: 42, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 12px", fontSize: 14, outline: "none", background: "white", color: C.text };
const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: C.text, margin: "0 0 6px" };

export default function AdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !password) { setError("Enter your phone number and password."); return; }
    setBusy(true);
    setError("");
    try {
      const { accessToken } = await api.login({ phone: formatPhone(phone), password });
      if (!isAdminRole(getRoleFromToken(accessToken))) {
        setError("This account doesn't have admin access.");
        setBusy(false);
        return;
      }
      saveToken(accessToken);
      router.replace("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <form onSubmit={submit} style={{ width: "100%", maxWidth: 380, background: "white", borderRadius: 14, border: `1px solid ${C.border}`, padding: "32px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22 }}>
          <OwaLogo size={28} />
          <span style={{ fontWeight: 700, fontSize: 19, color: C.blue }}>Owa</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.muted, background: "#f3f4f6", borderRadius: 999, padding: "2px 8px", marginLeft: 4 }}>Admin</span>
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 4px", color: C.text }}>Sign in to the admin console</h1>
        <p style={{ fontSize: 12, color: C.faint, margin: "0 0 22px" }}>For transport department staff only.</p>

        <label style={label} htmlFor="phone">Phone Number</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <span style={{ ...input, width: 64, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontSize: 13 }}>+234</span>
          <input id="phone" style={input} inputMode="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/[^\d]/g, ""))} placeholder="8012345678" />
        </div>

        <label style={label} htmlFor="password">Password</label>
        <div style={{ position: "relative", marginBottom: 18 }}>
          <input id="password" style={{ ...input, paddingRight: 56 }} type={showPw ? "text" : "password"} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", fontSize: 12, fontWeight: 600, color: C.blue, cursor: "pointer" }}>
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p role="alert" style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{error}</p>}
        <Button type="submit" busy={busy} style={{ width: "100%", height: 42, fontSize: 14 }}>Sign in</Button>
      </form>
    </div>
  );
}
