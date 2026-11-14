import type { Point } from "@/components/admin/charts";
import type { Tx } from "@/components/admin/money";
import { statusTone } from "@/components/admin/ui";

export type Period = "today" | "week" | "month";
export const PERIOD_OPTIONS: [Period, string][] = [["today", "Today"], ["week", "Last 7 days"], ["month", "Last 30 days"]];

const DAY = 86400000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const periodStart = (p: Period, now = new Date()) => {
  const today = startOfDay(now);
  if (p === "today") return today;
  return new Date(today.getTime() - (p === "week" ? 6 : 29) * DAY);
};

export const txTime = (t: Tx) => (t.createdAt ? Date.parse(t.createdAt) : NaN);
export const isSuccessful = (t: Tx) => statusTone(t.status) === "green";
export const inPeriod = (t: Tx, p: Period, now = new Date()) => {
  const ms = txTime(t);
  return Number.isFinite(ms) && ms >= periodStart(p, now).getTime() && ms <= now.getTime();
};

const hourLabel = (h: number) => `${h % 12 || 12}${h < 12 ? "AM" : "PM"}`;
const dayLabel = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const weekday = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short" });

/** Successful transaction value over the period: 2-hour buckets for today, daily otherwise. */
export function valueOverTime(txs: Tx[], p: Period, now = new Date()): Point[] {
  const ok = txs.filter(t => isSuccessful(t) && inPeriod(t, p, now));
  if (p === "today") {
    const buckets = Array.from({ length: 12 }, (_, i) => ({ label: hourLabel(i * 2), detail: `${hourLabel(i * 2)} – ${hourLabel((i * 2 + 2) % 24)}`, value: 0 }));
    for (const t of ok) buckets[Math.floor(new Date(txTime(t)).getHours() / 2)].value += t.amount ?? 0;
    return buckets;
  }
  const days = p === "week" ? 7 : 30;
  const start = periodStart(p, now).getTime();
  const buckets = Array.from({ length: days }, (_, i) => {
    const d = new Date(start + i * DAY);
    return { label: p === "week" ? weekday(d) : dayLabel(d), detail: dayLabel(d), value: 0 };
  });
  for (const t of ok) {
    const i = Math.floor((startOfDay(new Date(txTime(t))).getTime() - start) / DAY);
    if (buckets[i]) buckets[i].value += t.amount ?? 0;
  }
  return buckets;
}

/** Number of transactions (any status) on each of the last 7 days. */
export function countLast7Days(txs: Tx[], now = new Date()): Point[] {
  const start = periodStart("week", now).getTime();
  const buckets = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start + i * DAY);
    return { label: weekday(d), detail: dayLabel(d), value: 0 };
  });
  for (const t of txs) {
    const ms = txTime(t);
    if (!Number.isFinite(ms)) continue;
    const i = Math.floor((startOfDay(new Date(ms)).getTime() - start) / DAY);
    if (buckets[i]) buckets[i].value += 1;
  }
  return buckets;
}

/** Successful transaction value per week for the last 4 weeks (oldest first). */
export function valueLast4Weeks(txs: Tx[], now = new Date()): Point[] {
  const end = startOfDay(now).getTime() + DAY;
  const buckets = Array.from({ length: 4 }, (_, i) => {
    const from = new Date(end - (4 - i) * 7 * DAY);
    const to = new Date(end - (3 - i) * 7 * DAY - DAY);
    return { label: `Week ${i + 1}`, detail: `${dayLabel(from)} – ${dayLabel(to)}`, value: 0 };
  });
  for (const t of txs) {
    const ms = txTime(t);
    if (!isSuccessful(t) || !Number.isFinite(ms) || ms >= end) continue;
    const i = 3 - Math.floor((end - 1 - ms) / (7 * DAY));
    if (buckets[i]) buckets[i].value += t.amount ?? 0;
  }
  return buckets;
}
