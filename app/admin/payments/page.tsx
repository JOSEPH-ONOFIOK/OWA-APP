"use client";

import Link from "next/link";
import { useState } from "react";
import Avatar from "@/components/Avatar";
import { api, getToken } from "@/lib/api";
import { Payout, PayoutActions, isPendingPayout, maskAccount, normalizePayout } from "@/components/admin/money";
import {
  C, Card, CardHeader, DataTable, ErrorState, PageBody, PageHeader, Pill, SearchInput, Select, StatCard, StatGrid,
  StatusPill, fmtDateTime, icons, matches, naira, nairaCompact, statusTone, sum, td, useAdminList,
} from "@/components/admin/ui";

const fetchPayouts = () => api.adminPayouts(getToken());

type StatusFilter = "all" | "green" | "amber" | "red";

export default function PaymentsPage() {
  const { items, setItems, loading, error, retry } = useAdminList(fetchPayouts, normalizePayout);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const setPayoutStatus = (id: string) => (s: string) =>
    setItems(ps => ps.map(p => (p.id === id ? { ...p, status: s } : p)));

  const pending = items.filter(p => isPendingPayout(p.status));
  const completed = items.filter(p => statusTone(p.status) === "green");
  const history = items
    .filter(p => !isPendingPayout(p.status))
    .filter(p => status === "all" || statusTone(p.status) === status)
    .filter(p => matches(query, p.name, p.id, p.reference, p.bankName));

  return (
    <>
      <PageHeader title="Payments & Withdrawals" subtitle="Manage driver payouts and platform commissions" />
      <PageBody>
        <StatGrid>
          <StatCard loading={loading} label="Pending Withdrawals" value={nairaCompact(sum(pending.map(p => p.amount)))} icon={icons.clock} tone="amber" />
          <StatCard loading={loading} label="Total Paid Out" value={nairaCompact(sum(completed.map(p => p.net ?? p.amount)))} icon={icons.cash} tone="green" />
          <StatCard loading={loading} label="Platform Commission" value={nairaCompact(sum(completed.map(p => p.fee)))} icon={icons.percent} tone="purple" />
          <StatCard loading={loading} label="Processing" value={items.filter(p => /process/i.test(p.status)).length.toLocaleString()} icon={icons.refresh} tone="blue" />
        </StatGrid>

        <Card>
          <CardHeader title="Pending Withdrawals" subtitle="Review and approve driver payout requests" />
          {loading && <p style={{ padding: "0 18px 20px", color: C.faint, fontSize: 13, margin: 0 }}>Loading…</p>}
          {!loading && error && <ErrorState message={error} onRetry={retry} />}
          {!loading && !error && pending.length === 0 && (
            <p style={{ padding: "0 18px 20px", color: C.faint, fontSize: 13, margin: 0 }}>No withdrawals waiting for approval.</p>
          )}
          {!loading && !error && pending.map(p => <PendingRow key={p.id} p={p} onStatus={setPayoutStatus(p.id)} />)}
        </Card>

        <Card>
          <CardHeader
            title="Payment History"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search payments..." />
              <Select label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["green", "Completed"], ["amber", "Processing"], ["red", "Failed / Rejected"]]} />
            </>}
          />
          <DataTable
            columns={["Driver/ Entity", "Payout ID", "Amount", "Type", "Status", "Date & Time", ""]}
            loading={loading} error={error} onRetry={retry} isEmpty={history.length === 0}
            emptyText={items.length ? "No payments match your filters." : "No payouts yet."}
          >
            {history.map(p => (
              <tr key={p.id}>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{p.name}</td>
                <td style={{ ...td, fontFamily: "ui-monospace, monospace", fontSize: 11 }}>{p.reference || p.id.slice(-8).toUpperCase()}</td>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{naira(p.amount)}</td>
                <td style={td}><Pill tone="gray" dot={false}>{p.type}</Pill></td>
                <td style={td}><StatusPill status={p.status} /></td>
                <td style={{ ...td, color: C.muted }}>{fmtDateTime(p.createdAt)}</td>
                <td style={{ ...td, textAlign: "right" }}>
                  <Link href={`/admin/payments/${encodeURIComponent(p.id)}`} style={{ color: C.blue, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>View details</Link>
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>
    </>
  );
}

function PendingRow({ p, onStatus }: { p: Payout; onStatus: (s: string) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderTop: "1px solid #f3f4f6", flexWrap: "wrap" }}>
      <Avatar name={p.name} src={p.photo} size={36} />
      <Link href={`/admin/payments/${encodeURIComponent(p.id)}`} style={{ flex: 1, minWidth: 180, textDecoration: "none", color: "inherit" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{p.name}</p>
        <p style={{ fontSize: 11, color: C.faint, margin: "2px 0 0" }}>
          {[p.bankName, maskAccount(p.accountNumber), fmtDateTime(p.createdAt)].filter(Boolean).join(" · ")}
        </p>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: "4px 0 0" }}>{naira(p.amount)}</p>
      </Link>
      <PayoutActions payout={p} onStatus={onStatus} size="sm" />
    </div>
  );
}
