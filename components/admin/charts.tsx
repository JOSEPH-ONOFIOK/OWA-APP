"use client";

import { useEffect, useRef, useState } from "react";
import { C } from "@/components/admin/ui";

/* Categorical order validated for light surfaces (lightness band, CVD separation, 3:1 contrast). */
export const SERIES = { Bus: "#6D28D9", Bike: "#D97706", Keke: "#0891B2", Other: "#9CA3AF" } as const;

const GRID = "#eef0f3";
const AXIS_TEXT = C.faint;

export interface Point { label: string; value: number; detail?: string }

/* ---------------- helpers ---------------- */

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** Rounds the axis maximum up to a clean value with 4 even steps. */
const niceMax = (max: number) => {
  if (max <= 0) return 4;
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) ?? 10 * mag;
  return step * 4;
};

export const compact = (v: number, money = false) => {
  const p = money ? "₦" : "";
  if (Math.abs(v) >= 1e6) return `${p}${+(v / 1e6).toFixed(1)}M`;
  if (Math.abs(v) >= 1e4) return `${p}${+(v / 1e3).toFixed(1)}K`;
  return `${p}${v.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
};

const SrTable = ({ caption, points, format }: { caption: string; points: Point[]; format: (v: number) => string }) => (
  <table style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
    <caption>{caption}</caption>
    <tbody>{points.map(p => <tr key={p.label}><th scope="row">{p.label}</th><td>{format(p.value)}</td></tr>)}</tbody>
  </table>
);

function Tooltip({ x, y, title, value, containerWidth }: { x: number; y: number; title: string; value: string; containerWidth: number }) {
  const flip = x > containerWidth - 140;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(${flip ? "calc(-100% - 10px)" : "10px"}, -50%)`, background: "white", border: `1px solid ${GRID}`, borderRadius: 8, padding: "6px 10px", boxShadow: "0 6px 16px rgba(0,0,0,.08)", pointerEvents: "none", whiteSpace: "nowrap", zIndex: 2 }}>
      <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{title}</p>
      <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>{value}</p>
    </div>
  );
}

const PAD = { top: 12, right: 12, bottom: 26, left: 48 };

function YAxis({ max, plotW, plotH, money }: { max: number; plotW: number; plotH: number; money: boolean }) {
  return (
    <>
      {[0, 1, 2, 3, 4].map(i => {
        const v = (max / 4) * i;
        const y = PAD.top + plotH - (plotH * i) / 4;
        return (
          <g key={i}>
            <line x1={PAD.left} x2={PAD.left + plotW} y1={y} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize={10} fill={AXIS_TEXT}>{compact(v, money)}</text>
          </g>
        );
      })}
    </>
  );
}

/** Show at most ~8 x labels so they never collide. */
const labelEvery = (n: number, plotW: number) => Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 56))));

/* ---------------- Line chart (single series) ---------------- */

export function LineChart({ points, height = 220, money = true, caption, color = C.blue }: { points: Point[]; height?: number; money?: boolean; caption: string; color?: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const fmt = (v: number) => (money ? `₦${v.toLocaleString("en-NG")}` : v.toLocaleString());

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(0, ...points.map(p => p.value)));
  const x = (i: number) => PAD.left + (points.length <= 1 ? plotW / 2 : (plotW * i) / (points.length - 1));
  const y = (v: number) => PAD.top + plotH - (plotH * v) / max;

  const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
  const area = points.length ? `${line} L${x(points.length - 1)},${PAD.top + plotH} L${x(0)},${PAD.top + plotH} Z` : "";
  const every = labelEvery(points.length, plotW);

  const onMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rel = e.clientX - rect.left;
    const i = points.length <= 1 ? 0 : Math.round((rel / rect.width) * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, i)));
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={caption}>
          <YAxis max={max} plotW={plotW} plotH={plotH} money={money} />
          <path d={area} fill={color} fillOpacity={0.1} />
          <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => i % every === 0 || i === points.length - 1 ? (
            <text key={i} x={x(i)} y={height - 8} textAnchor="middle" fontSize={10} fill={AXIS_TEXT}>{p.label}</text>
          ) : null)}
          {hover !== null && points[hover] && (
            <>
              <line x1={x(hover)} x2={x(hover)} y1={PAD.top} y2={PAD.top + plotH} stroke={C.faint} strokeWidth={1} />
              <circle cx={x(hover)} cy={y(points[hover].value)} r={5} fill={color} stroke="white" strokeWidth={2} />
            </>
          )}
          <rect x={PAD.left} y={PAD.top} width={plotW} height={plotH} fill="transparent" onMouseMove={onMove} onMouseLeave={() => setHover(null)} />
        </svg>
      )}
      {hover !== null && points[hover] && (
        <Tooltip x={x(hover)} y={y(points[hover].value)} title={points[hover].detail ?? points[hover].label} value={fmt(points[hover].value)} containerWidth={width} />
      )}
      <SrTable caption={caption} points={points} format={fmt} />
    </div>
  );
}

/* ---------------- Column chart (single series) ---------------- */

export function ColumnChart({ points, height = 220, money = false, caption, color = C.blue }: { points: Point[]; height?: number; money?: boolean; caption: string; color?: string }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const fmt = (v: number) => (money ? `₦${v.toLocaleString("en-NG")}` : v.toLocaleString());

  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = height - PAD.top - PAD.bottom;
  const max = niceMax(Math.max(0, ...points.map(p => p.value)));
  const band = points.length ? plotW / points.length : 0;
  const barW = Math.min(24, band * 0.6);
  const base = PAD.top + plotH;

  const barPath = (cx: number, h: number) => {
    if (h <= 0) return "";
    const r = Math.min(4, h, barW / 2);
    const l = cx - barW / 2, rgt = cx + barW / 2, top = base - h;
    return `M${l},${base} L${l},${top + r} Q${l},${top} ${l + r},${top} L${rgt - r},${top} Q${rgt},${top} ${rgt},${top + r} L${rgt},${base} Z`;
  };

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={caption}>
          <YAxis max={max} plotW={plotW} plotH={plotH} money={money} />
          {points.map((p, i) => {
            const cx = PAD.left + band * i + band / 2;
            const h = (plotH * p.value) / max;
            return (
              <g key={i}>
                <path d={barPath(cx, h)} fill={color} fillOpacity={hover === null || hover === i ? 1 : 0.45} />
                <text x={cx} y={height - 8} textAnchor="middle" fontSize={10} fill={AXIS_TEXT}>{p.label}</text>
                <rect x={cx - band / 2} y={PAD.top} width={band} height={plotH} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && points[hover] && (
        <Tooltip
          x={PAD.left + band * hover + band / 2 + barW / 2}
          y={Math.max(PAD.top + 16, base - (plotH * points[hover].value) / max)}
          title={points[hover].detail ?? points[hover].label}
          value={fmt(points[hover].value)}
          containerWidth={width}
        />
      )}
      <SrTable caption={caption} points={points} format={fmt} />
    </div>
  );
}

/* ---------------- Donut ---------------- */

export interface Slice { label: string; value: number; color: string }

export function Donut({ slices, caption, format }: { slices: Slice[]; caption: string; format: (v: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const total = slices.reduce((a, s) => a + s.value, 0);
  const size = 168, r = 66, sw = 20, cx = size / 2, cy = size / 2;
  const gapAngle = slices.filter(s => s.value > 0).length > 1 ? 2 / r : 0; // ~2px surface gap

  const sweepOf = (v: number) => (total ? (v / total) * Math.PI * 2 : 0);
  const arcs = slices.map((s, i) => {
    const start = -Math.PI / 2 + slices.slice(0, i).reduce((a, p) => a + sweepOf(p.value), 0);
    const sweep = sweepOf(s.value);
    const a0 = start + gapAngle / 2, a1 = start + sweep - gapAngle / 2;
    if (sweep <= gapAngle) return "";
    if (sweep >= Math.PI * 2 - 1e-6) return `M${cx},${cy - r} A${r},${r} 0 1 1 ${cx - 0.01},${cy - r}`;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 ${large} 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}`;
  });

  const pct = (v: number) => (total ? Math.round((v / total) * 100) : 0);
  const focus = hover !== null ? slices[hover] : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label={caption}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={GRID} strokeWidth={sw} />
          {arcs.map((d, i) => d && (
            <path key={i} d={d} fill="none" stroke={slices[i].color} strokeWidth={hover === i ? sw + 4 : sw}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ cursor: "default", transition: "stroke-width .15s" }} />
          ))}
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
          <p style={{ fontSize: 11, color: C.muted, margin: 0 }}>{focus ? focus.label : "Total"}</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{format(focus ? focus.value : total)}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 16px" }}>
        {slices.map((s, i) => (
          <span key={s.label} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: C.body }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color }} />
            {s.label} ({pct(s.value)}%)
          </span>
        ))}
      </div>
      <SrTable caption={caption} points={slices.map(s => ({ label: s.label, value: s.value }))} format={format} />
    </div>
  );
}
