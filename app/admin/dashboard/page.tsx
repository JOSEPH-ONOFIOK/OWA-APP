"use client";

import Link from "next/link";
import { useState } from "react";
import { api, getToken } from "@/lib/api";
import { Donut, LineChart, SERIES, Slice } from "@/components/admin/charts";
import { PERIOD_OPTIONS, Period, inPeriod, isSuccessful, txTime, valueOverTime } from "@/components/admin/metrics";
import { Tx, normalizeTx } from "@/components/admin/money";
import {
  C, Card, CardHeader, DataTable, ErrorState, NameCell, PageBody, PageHeader, Pill, Raw, Select, StatCard, StatGrid,
  StatusPill, fmtDateTime, icons, naira, nairaCompact, pickStr, sum, td, useAdminList,
} from "@/components/admin/ui";

const fetchTx = () => api.adminTransactions(getToken());
const fetchDrivers = () => api.adminDrivers(getToken());
const driverStatus = (r: Raw) => pickStr(r, "status", "approvalStatus", "verificationStatus").toLowerCase();

const PERIOD_TEXT: Record<Period, string> = { today: "today", week: "in the last 7 days", month: "in the last 30 days" };

function revenueByVehicle(rides: Tx[]): Slice[] {
  const totals: Record<keyof typeof SERIES, number> = { Bus: 0, Bike: 0, Keke: 0, Other: 0 };
  for (const t of rides) {
    const k = (["Bus", "Bike", "Keke"] as const).find(v => v.toLowerCase() === t.vehicleType.toLowerCase()) ?? "Other";
    totals[k] += t.amount ?? 0;
  }
  return (Object.keys(totals) as (keyof typeof SERIES)[])
    .filter(k => k !== "Other" || totals.Other > 0)
    .map(k => ({ label: k, value: totals[k], color: SERIES[k] }));
}

export default function AdminDashboard() {
  const tx = useAdminList(fetchTx, normalizeTx);
  const drivers = useAdminList(fetchDrivers, driverStatus);
  const [period, setPeriod] = useState<Period>("today");

  const ok = tx.items.filter(t => isSuccessful(t) && inPeriod(t, period));
  const rides = ok.filter(t => t.kind === "ride");
  const approved = drivers.items.filter(s => /approv|active|verified/.test(s) && !/inactive/.test(s)).length;
  const pending = drivers.items.filter(s => !/approv|active|verified|reject|declin/.test(s)).length;

  const series = valueOverTime(tx.items, period);
  const slices = revenueByVehicle(rides);
  const recent = [...tx.items].sort((a, b) => (txTime(b) || 0) - (txTime(a) || 0)).slice(0, 6);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of transport system activity" />
      <PageBody>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <Select label="Period" value={period} onChange={setPeriod} options={PERIOD_OPTIONS} />
        </div>

        <StatGrid>
          <StatCard loading={tx.loading} label="Total Transactions" value={naira(sum(ok.map(t => t.amount)))} icon={icons.trend} tone="blue" />
          <StatCard loading={tx.loading} label="Rides Completed" value={rides.length.toLocaleString()} icon={icons.car} tone="purple" />
          <StatCard loading={drivers.loading} label="Active Drivers" value={approved.toLocaleString()} icon={icons.users} tone="green" />
          <StatCard loading={drivers.loading} label="Pending Approvals" value={pending.toLocaleString()} icon={icons.clock} tone="amber" />
          <StatCard loading={tx.loading} label="Platform Revenue" value={nairaCompact(sum(ok.map(t => t.fee)))} icon={icons.cash} tone="green" />
        </StatGrid>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(260px, 1fr)", gap: 16 }}>
          <Card>
            <CardHeader title="Transactions Over Time" subtitle={`Successful transaction value ${PERIOD_TEXT[period]}`} />
            <div style={{ padding: "0 14px 14px" }}>
              {tx.error ? <ErrorState message={tx.error} onRetry={tx.retry} />
                : tx.loading ? <p style={{ height: 220, margin: 0, color: C.faint, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</p>
                : <LineChart points={series} caption="Successful transaction value over time" />}
            </div>
          </Card>
          <Card>
            <CardHeader title="Revenue Breakdown" subtitle="Ride payments by transport type" />
            <div style={{ padding: "4px 14px 18px" }}>
              {tx.loading ? <p style={{ color: C.faint, fontSize: 13, textAlign: "center" }}>Loading…</p>
                : sum(slices.map(s => s.value)) === 0 ? <p style={{ color: C.faint, fontSize: 13, textAlign: "center", padding: "50px 0" }}>No ride payments {PERIOD_TEXT[period]}.</p>
                : <Donut slices={slices} caption="Ride payment value by transport type" format={v => nairaCompact(v)} />}
            </div>
          </Card>
        </div>

        <Card>
          <CardHeader title="Recent Transactions" right={<Link href="/admin/transactions" style={{ fontSize: 12, fontWeight: 600, color: C.blue, textDecoration: "none" }}>View all</Link>} />
          <DataTable
            columns={["Name", "User", "Date & Time", "Amount", "Type", "Status", ""]}
            loading={tx.loading} error={tx.error} onRetry={tx.retry} isEmpty={recent.length === 0} emptyText="No transactions yet."
          >
            {recent.map(t => (
              <tr key={t.id}>
                <td style={td}><NameCell name={t.userName || "Unknown"} /></td>
                <td style={td}>{t.userRole}</td>
                <td style={{ ...td, color: C.muted }}>{fmtDateTime(t.createdAt)}</td>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{naira(t.amount)}</td>
                <td style={td}><Pill tone="gray" dot={false}>{t.typeLabel}</Pill></td>
                <td style={td}><StatusPill status={t.status} /></td>
                <td style={{ ...td, textAlign: "right" }}>
                  {t.id && <Link href={`/admin/transactions/${encodeURIComponent(t.id)}`} style={{ color: C.blue, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View details</Link>}
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>
    </>
  );
}
