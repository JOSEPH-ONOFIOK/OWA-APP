"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import { getSavedName } from "@/lib/api";

/* ================= Tokens ================= */

export const C = {
  blue: "#0066FF",
  green: "#22C55E",
  red: "#EF4444",
  amber: "#F59E0B",
  purple: "#7C3AED",
  text: "#111827",
  body: "#374151",
  muted: "#6b7280",
  faint: "#9ca3af",
  border: "#eef0f3",
  bg: "#f5f6f8",
};

export type Tone = "green" | "amber" | "red" | "blue" | "gray" | "purple";

const TONES: Record<Tone, { bg: string; fg: string }> = {
  green: { bg: "#ECFDF3", fg: "#16A34A" },
  amber: { bg: "#FFF7E6", fg: "#D97706" },
  red: { bg: "#FEF2F2", fg: C.red },
  blue: { bg: "#EAF2FF", fg: C.blue },
  gray: { bg: "#F3F4F6", fg: "#4B5563" },
  purple: { bg: "#F3E8FF", fg: C.purple },
};

/** Map any backend status word to a colour. */
export const statusTone = (status: string): Tone => {
  const s = status.toLowerCase();
  // Order matters: "inactive" / "unresolved" / "pending_approval" must not fall through to green.
  if (/(fail|reject|declin|inactive|suspend|cancel|blocked)/.test(s)) return "red";
  if (/(pend|process|unresolv|progress|review|unassigned|request)/.test(s)) return "amber";
  if (/(complete|success|active|approv|resolv|paid|verified|assigned|sent)/.test(s)) return "green";
  return "gray";
};

export const titleCase = (s: string) =>
  s.replace(/[_-]+/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase()).trim();

/* ================= Data helpers ================= */

export type Raw = Record<string, unknown>;

const at = (r: unknown, path: string): unknown =>
  path.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Raw)[k] : undefined), r);

export const pickStr = (r: Raw, ...paths: string[]) => {
  for (const p of paths) {
    const v = at(r, p);
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  }
  return "";
};

export const pickNum = (r: Raw, ...paths: string[]): number | null => {
  for (const p of paths) {
    const v = at(r, p);
    const n = typeof v === "number" ? v : typeof v === "string" && v.trim() !== "" ? Number(v) : NaN;
    if (Number.isFinite(n)) return n;
  }
  return null;
};

export const pickBool = (r: Raw, ...paths: string[]): boolean | null => {
  for (const p of paths) {
    const v = at(r, p);
    if (typeof v === "boolean") return v;
  }
  return null;
};

/** Reads a person's name from `fullName`, `name`, or `firstName`+`lastName`, under any of the given prefixes. */
export const pickName = (r: Raw, ...prefixes: string[]) => {
  for (const pre of prefixes.length ? prefixes : [""]) {
    const p = pre ? `${pre}.` : "";
    const full = pickStr(r, `${p}fullName`, `${p}name`);
    if (full) return full;
    const joined = [pickStr(r, `${p}firstName`), pickStr(r, `${p}lastName`)].filter(Boolean).join(" ");
    if (joined) return joined;
  }
  return "";
};

export const pickId = (r: Raw) => pickStr(r, "id", "_id");

export const extractList = (data: unknown): Raw[] => {
  if (Array.isArray(data)) return data as Raw[];
  const d = (data ?? {}) as Raw;
  for (const k of ["items", "data", "results", "docs", "drivers", "vehicles", "passengers", "transactions", "payouts", "reports", "announcements"]) {
    const v = d[k];
    if (Array.isArray(v)) return v as Raw[];
    if (v && typeof v === "object") {
      const nested = extractList(v);
      if (nested.length) return nested;
    }
  }
  return [];
};

export const extractItem = (data: unknown): Raw => {
  const d = (data ?? {}) as Raw;
  for (const k of ["data", "item", "result"]) {
    const v = d[k];
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Raw;
  }
  return d;
};

const validDate = (iso: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

export const fmtDate = (iso: string | null) => {
  const d = validDate(iso);
  return d ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
};

export const fmtDateTime = (iso: string | null) => {
  const d = validDate(iso);
  if (!d) return "—";
  const day = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((day(new Date()) - day(d)) / 86400000);
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }).replace(" ", "");
  if (diff === 0) return `Today, ${time}`;
  if (diff === 1) return `Yesterday, ${time}`;
  return `${fmtDate(iso)}, ${time}`;
};

export const isToday = (iso: string | null) => {
  const d = validDate(iso);
  return !!d && d.toDateString() === new Date().toDateString();
};

export const withinDays = (iso: string | null, days: number) => {
  const d = validDate(iso);
  return !!d && Date.now() - d.getTime() <= days * 86400000;
};

export const naira = (n: number | null) =>
  n === null ? "—" : `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 2 })}`;

export const nairaCompact = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `₦${+(n / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `₦${+(n / 1e6).toFixed(2)}M`;
  return naira(n);
};

export const sum = (xs: (number | null)[]) => xs.reduce<number>((a, b) => a + (b ?? 0), 0);

export const matches = (q: string, ...fields: string[]) => {
  const s = q.trim().toLowerCase();
  return !s || fields.some(f => f.toLowerCase().includes(s));
};

export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ================= Data hooks ================= */

/** Loads a list. `fetcher` and `normalize` must be stable (module-level or memoised). */
export function useAdminList<T>(fetcher: () => Promise<unknown>, normalize: (r: Raw) => T) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetcher()
      .then(d => { setItems(extractList(d).map(normalize)); setError(""); })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [fetcher, normalize]);

  useEffect(() => { load(); }, [load]);

  const retry = () => { setLoading(true); setError(""); load(); };
  return { items, setItems, loading, error, retry };
}

/** Loads one record. `fetcher` and `normalize` must be stable. */
export function useAdminItem<T>(fetcher: () => Promise<unknown>, normalize: (r: Raw) => T) {
  const [item, setItem] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetcher()
      .then(d => { setItem(normalize(extractItem(d))); setError(""); })
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [fetcher, normalize]);

  useEffect(() => { load(); }, [load]);

  const retry = () => { setLoading(true); setError(""); load(); };
  return { item, setItem, loading, error, retry };
}

/* ================= Icons ================= */

export const Icon = ({ children, size = 15, color = "currentColor", width = 2 }: { children: React.ReactNode; size?: number; color?: string; width?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

export const icons = {
  users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
  user: <><circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0113 0" /></>,
  activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
  star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
  car: <><rect x="3" y="6" width="18" height="11" rx="2" /><circle cx="7.5" cy="17" r="1.5" /><circle cx="16.5" cy="17" r="1.5" /></>,
  bike: <><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6h2l3 11.5M5.5 17.5L9 9h6l-3.5 8.5" /></>,
  tag: <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
  wallet: <><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 000 4h4v-4z" /></>,
  cash: <><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></>,
  check: <polyline points="20 6 9 17 4 12" />,
  checkCircle: <><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
  clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  xCircle: <><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></>,
  alert: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>,
  flag: <><path d="M4 22V4a1 1 0 011-1h12l-2 4 2 4H5" /></>,
  trend: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
  percent: <><line x1="19" y1="5" x2="5" y2="19" /><circle cx="6.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></>,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
  download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
  upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></>,
  file: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></>,
  back: <path d="M19 12H5M12 19l-7-7 7-7" />,
  send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
  bank: <><path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M12 3l9 5H3z" /></>,
  more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
  refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></>,
  megaphone: <><path d="M3 11v2a1 1 0 001 1h2l5 4V6L6 10H4a1 1 0 00-1 1z" /><path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" /></>,
};

export const Spinner = ({ size = 15 }: { size?: number }) => (
  <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
    <circle cx="12" cy="12" r="10" strokeOpacity=".25" /><path d="M12 2a10 10 0 0110 10" />
  </svg>
);

/* ================= Layout pieces ================= */

export function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const name = getSavedName() || "Admin Officer";
  return (
    <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 28px", background: "white", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <h1 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: C.text }}>{title}</h1>
        <p style={{ fontSize: 12, color: C.faint, margin: "2px 0 0" }}>{subtitle}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, color: C.muted }}>
        <Icon size={18}>{icons.bell}</Icon>
        <Avatar name={name} size={32} />
      </div>
    </header>
  );
}

export const PageBody = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: "22px 28px 40px", display: "flex", flexDirection: "column", gap: 18 }}>{children}</div>
);

export const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: "white", borderRadius: 12, border: `1px solid ${C.border}`, ...style }}>{children}</div>
);

export function CardHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 18px", flexWrap: "wrap" }}>
      <div>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{title}</p>
        {subtitle && <p style={{ fontSize: 11, color: C.faint, margin: "2px 0 0" }}>{subtitle}</p>}
      </div>
      {right && <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>{right}</div>}
    </div>
  );
}

export const StatGrid = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>{children}</div>
);

export function StatCard({ label, value, icon, tone = "blue", loading }: { label: string; value: string; icon: React.ReactNode; tone?: Tone; loading?: boolean }) {
  const t = TONES[tone];
  return (
    <Card style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 38, height: 38, borderRadius: 10, background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={17}>{icon}</Icon>
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 11, color: C.muted, margin: "0 0 3px" }}>{label}</p>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{loading ? "—" : value}</p>
      </div>
    </Card>
  );
}

export function Pill({ tone, children, dot = true }: { tone: Tone; children: React.ReactNode; dot?: boolean }) {
  const t = TONES[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, background: t.bg, color: t.fg, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: t.fg }} />}
      {children}
    </span>
  );
}

export const StatusPill = ({ status }: { status: string }) =>
  status ? <Pill tone={statusTone(status)}>{titleCase(status)}</Pill> : <span style={{ color: C.faint }}>—</span>;

/* ================= Controls ================= */

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ position: "relative", width: 260, maxWidth: "100%" }}>
      <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: C.faint, display: "flex" }}><Icon size={14}>{icons.search}</Icon></span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", height: 34, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 12px 0 32px", fontSize: 12, outline: "none", background: "white" }}
      />
    </div>
  );
}

export function Select<V extends string>({ value, onChange, options, label }: { value: V; onChange: (v: V) => void; options: [V, string][]; label: string }) {
  return (
    <select aria-label={label} value={value} onChange={e => onChange(e.target.value as V)} style={{ height: 34, borderRadius: 8, border: "1px solid #e5e7eb", background: "white", fontSize: 12, padding: "0 10px", color: C.body, cursor: "pointer" }}>
      {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  );
}

type BtnVariant = "primary" | "success" | "danger" | "dangerSoft" | "ghost";
const BTN: Record<BtnVariant, React.CSSProperties> = {
  primary: { background: C.blue, color: "white", border: "none" },
  success: { background: C.green, color: "white", border: "none" },
  danger: { background: C.red, color: "white", border: "none" },
  dangerSoft: { background: "#fef2f2", color: C.red, border: `1px solid ${C.red}` },
  ghost: { background: "white", color: C.body, border: "1px solid #e5e7eb" },
};

export function Button({ variant = "primary", busy, children, style, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; busy?: boolean }) {
  const off = disabled || busy;
  return (
    <button
      {...rest}
      disabled={off}
      style={{ height: 34, padding: "0 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: off ? "default" : "pointer", opacity: off ? 0.6 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, whiteSpace: "nowrap", ...BTN[variant], ...style }}
    >
      {busy && <Spinner size={13} />}
      {children}
    </button>
  );
}

/* ================= Table ================= */

export const th: React.CSSProperties = { textAlign: "left", fontSize: 11, fontWeight: 600, color: C.muted, padding: "11px 14px", background: "#f9fafb", borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap" };
export const td: React.CSSProperties = { padding: "12px 14px", fontSize: 12, color: C.body, borderBottom: "1px solid #f3f4f6", whiteSpace: "nowrap" };

export function DataTable({ columns, loading, error, onRetry, isEmpty, emptyText, children }: {
  columns: string[]; loading: boolean; error: string; onRetry: () => void; isEmpty: boolean; emptyText: string; children: React.ReactNode;
}) {
  const ready = !loading && !error;
  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{columns.map((c, i) => <th key={i} style={th}>{c}</th>)}</tr></thead>
          <tbody>{ready && children}</tbody>
        </table>
      </div>
      {loading && <p style={{ padding: 40, textAlign: "center", color: C.faint, fontSize: 13, margin: 0 }}>Loading…</p>}
      {!loading && error && <ErrorState message={error} onRetry={onRetry} />}
      {ready && isEmpty && <p style={{ padding: 40, textAlign: "center", color: C.faint, fontSize: 13, margin: 0 }}>{emptyText}</p>}
    </>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p style={{ color: C.red, fontSize: 13, margin: "0 0 12px" }}>Couldn&apos;t load data: {message}</p>
      <Button variant="ghost" onClick={onRetry}>Try again</Button>
    </div>
  );
}

export const NameCell = ({ name, src }: { name: string; src?: string | null }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <Avatar name={name} src={src} size={28} />
    <span style={{ fontWeight: 600, color: C.text }}>{name || "—"}</span>
  </div>
);

export const LinkButton = ({ onClick, children }: { onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0 }}>{children}</button>
);

/* ================= Overlays ================= */

export const CloseBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} aria-label="Close" style={{ position: "absolute", top: 12, right: 12, width: 26, height: 26, borderRadius: 7, border: "1px solid #e5e7eb", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted }}>
    <Icon size={12} width={2.5}>{icons.x}</Icon>
  </button>
);

function useEscape(onClose: () => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
}

export function Modal({ children, onClose, highlight, width = 360, align = "center" }: { children: React.ReactNode; onClose: () => void; highlight?: boolean; width?: number; align?: "center" | "left" }) {
  useEscape(onClose);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16 }}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: width, maxHeight: "calc(100dvh - 32px)", overflowY: "auto", background: "white", borderRadius: 14, padding: align === "center" ? "36px 28px 26px" : "22px 22px 20px", textAlign: align, boxShadow: "0 20px 50px rgba(0,0,0,.15)", border: highlight ? `2px solid ${C.blue}` : "none" }}
      >
        <CloseBtn onClick={onClose} />
        {children}
      </div>
    </div>
  );
}

/** Confirmation / result modal body: icon, title, text, then actions. */
export function DialogBody({ icon, title, text, children }: { icon?: React.ReactNode; title: string; text: string; children?: React.ReactNode }) {
  return (
    <>
      {icon && <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>{icon}</div>}
      <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 8px", color: C.text }}>{title}</h2>
      <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.6, margin: children ? "0 0 18px" : 0 }}>{text}</p>
      {children}
    </>
  );
}

export const SuccessIcon = () => <Icon size={54} color={C.green} width={2.6}>{icons.check}</Icon>;
export const FailIcon = () => (
  <div style={{ width: 50, height: 50, borderRadius: "50%", background: C.red, display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
    <Icon size={22} width={3}>{icons.x}</Icon>
  </div>
);

export function Drawer({ title, onClose, footer, children }: { title: string; onClose: () => void; footer?: React.ReactNode; children: React.ReactNode }) {
  useEscape(onClose);
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(17,24,39,.25)", zIndex: 40 }} />
      <aside role="dialog" aria-modal="true" style={{ position: "fixed", top: 12, right: 12, bottom: 12, width: 360, maxWidth: "calc(100vw - 24px)", background: "white", borderRadius: 14, zIndex: 50, display: "flex", flexDirection: "column", boxShadow: "0 20px 50px rgba(0,0,0,.15)" }}>
        <div style={{ position: "relative", padding: "16px 18px 0" }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.muted, margin: 0 }}>{title}</p>
          <CloseBtn onClick={onClose} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "14px 18px" }}>{children}</div>
        {footer && <div style={{ display: "flex", gap: 10, padding: "14px 18px", borderTop: "1px solid #f3f4f6" }}>{footer}</div>}
      </aside>
    </>
  );
}

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: 12, fontWeight: 700, color: C.text, margin: "18px 0 8px" }}>{children}</p>
);

export const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "7px 0", fontSize: 12 }}>
    <span style={{ color: C.muted }}>{label}</span>
    <span style={{ color: C.text, fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{value || "—"}</span>
  </div>
);

export function DocRow({ label, url }: { label: string; url: string | null }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", border: `1px solid ${C.border}`, borderRadius: 8 }}>
      <span style={{ color: C.muted, display: "flex" }}><Icon>{icons.file}</Icon></span>
      <span style={{ flex: 1, fontSize: 12 }}>{label}</span>
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 600, color: C.blue, textDecoration: "none" }}>View</a>
      ) : (
        <span style={{ fontSize: 11, color: C.faint }}>Not uploaded</span>
      )}
    </div>
  );
}

/* ================= Detail page pieces ================= */

export const BackLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: C.body, textDecoration: "none" }}>
    <Icon size={13}>{icons.back}</Icon>{children}
  </Link>
);

export function AmountTile({ label, value, tone }: { label: string; value: string; tone?: "green" | "red" }) {
  return (
    <div style={{ flex: "1 1 120px" }}>
      <p style={{ fontSize: 11, color: C.muted, margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, margin: 0, color: tone === "green" ? "#16A34A" : tone === "red" ? C.red : C.text }}>{value}</p>
    </div>
  );
}

export type TimelineStep = { label: string; time?: string | null; state: "done" | "failed" | "pending" };

export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {steps.map((s, i) => {
        const color = s.state === "done" ? C.green : s.state === "failed" ? C.red : "#d1d5db";
        return (
          <div key={s.label} style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {s.state !== "pending" && <Icon size={8} width={4}>{s.state === "done" ? icons.check : icons.x}</Icon>}
              </span>
              {i < steps.length - 1 && <span style={{ width: 2, flex: 1, minHeight: 18, background: s.state === "done" ? "#bbf7d0" : "#e5e7eb" }} />}
            </div>
            <div style={{ paddingBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: s.state === "pending" ? C.faint : C.text, margin: 0 }}>{s.label}</p>
              {s.time && <p style={{ fontSize: 11, color: C.faint, margin: "2px 0 0" }}>{fmtDateTime(s.time)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PartyRow({ role, name, detail }: { role: string; name: string; detail?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
      <Avatar name={name || "?"} size={32} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, color: C.faint, margin: 0 }}>{role}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{name || "—"}</p>
      </div>
      {detail && <span style={{ fontSize: 11, color: C.muted }}>{detail}</span>}
    </div>
  );
}
