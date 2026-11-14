"use client";

import Link from "next/link";
import { useState } from "react";
import { api, getToken } from "@/lib/api";
import { ColumnChart, LineChart } from "@/components/admin/charts";
import { countLast7Days, txTime, valueLast4Weeks } from "@/components/admin/metrics";
import { normalizeTx } from "@/components/admin/money";
import {
  C, Card, CardHeader, DataTable, ErrorState, NameCell, PageBody, PageHeader, Pill, Raw, SearchInput, Select,
  StatusPill, fmtDateTime, matches, naira, pickBool, pickId, pickName, pickNum, pickStr, statusTone, td, useAdminList,
} from "@/components/admin/ui";

const fetchTx = () => api.adminTransactions(getToken());
const fetchDrivers = () => api.adminDrivers(getToken());

interface DriverPerf { id: string; name: string; photo: string | null; earnings: number | null; approved: boolean; online: boolean }

const normalizeDriver = (r: Raw): DriverPerf => {
  const s = pickStr(r, "status", "approvalStatus", "verificationStatus").toLowerCase();
  return {
    id: pickId(r),
    name: pickName(r, "", "user") || "Unnamed driver",
    photo: pickStr(r, "profilePicture", "avatar", "user.profilePicture") || null,
    earnings: pickNum(r, "totalEarnings", "earnings", "stats.totalEarnings"),
    approved: /approv|active|verified/.test(s) && !/inactive/.test(s),
    online: pickBool(r, "isOnline", "isActive", "online") ?? false,
  };
};

type StatusFilter = "all" | "green" | "amber" | "red";

const ChartBox = ({ loading, error, onRetry, children }: { loading: boolean; error: string; onRetry: () => void; children: React.ReactNode }) => (
  <div style={{ padding: "0 14px 14px" }}>
    {error ? <ErrorState message={error} onRetry={onRetry} />
      : loading ? <p style={{ height: 220, margin: 0, color: C.faint, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>Loading…</p>
      : children}
  </div>
);

export default function AnalyticsPage() {
  const tx = useAdminList(fetchTx, normalizeTx);
  const drivers = useAdminList(fetchDrivers, normalizeDriver);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const logs = [...tx.items]
    .sort((a, b) => (txTime(b) || 0) - (txTime(a) || 0))
    .filter(t => status === "all" || statusTone(t.status) === status)
    .filter(t => matches(query, t.userName, t.typeLabel, t.reference, t.id))
    .slice(0, 10);

  const topDrivers = drivers.items
    .filter(d => d.approved)
    .sort((a, b) => (b.earnings ?? 0) - (a.earnings ?? 0))
    .slice(0, 6);

  return (
    <>
      <PageHeader title="Analytics" subtitle="Overview of transport system activity" />
      <PageBody>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          <Card>
            <CardHeader title="Transaction Volume" subtitle="Number of transactions per day, last 7 days" />
            <ChartBox loading={tx.loading} error={tx.error} onRetry={tx.retry}>
              <ColumnChart points={countLast7Days(tx.items)} caption="Transactions per day, last 7 days" />
            </ChartBox>
          </Card>
          <Card>
            <CardHeader title="Revenue Trend" subtitle="Successful transaction value per week, last 4 weeks" />
            <ChartBox loading={tx.loading} error={tx.error} onRetry={tx.retry}>
              <LineChart points={valueLast4Weeks(tx.items)} caption="Successful transaction value per week" />
            </ChartBox>
          </Card>
        </div>

        <Card>
          <CardHeader
            title="Transaction Logs"
            subtitle="Most recent transaction details"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search..." />
              <Select label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["green", "Completed"], ["amber", "Pending"], ["red", "Failed"]]} />
            </>}
          />
          <DataTable
            columns={["Name", "User", "Date & Time", "Amount", "Type", "Status", ""]}
            loading={tx.loading} error={tx.error} onRetry={tx.retry} isEmpty={logs.length === 0}
            emptyText={tx.items.length ? "No transactions match your filters." : "No transactions yet."}
          >
            {logs.map(t => (
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

        <Card style={{ maxWidth: 560 }}>
          <CardHeader
            title="Driver Performance"
            subtitle="Top earning approved drivers"
            right={<Link href="/admin/active-drivers" style={{ fontSize: 12, fontWeight: 600, color: C.blue, textDecoration: "none" }}>View all</Link>}
          />
          <DataTable
            columns={["Driver", "Earnings", "Status"]}
            loading={drivers.loading} error={drivers.error} onRetry={drivers.retry} isEmpty={topDrivers.length === 0}
            emptyText="No approved drivers yet."
          >
            {topDrivers.map(d => (
              <tr key={d.id}>
                <td style={td}><NameCell name={d.name} src={d.photo} /></td>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{naira(d.earnings)}</td>
                <td style={td}><StatusPill status={d.online ? "active" : "inactive"} /></td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>
    </>
  );
}
