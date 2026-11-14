"use client";

import Link from "next/link";
import { useState } from "react";
import { api, getToken } from "@/lib/api";
import { normalizeTx, Tx, TxKind } from "@/components/admin/money";
import {
  Button, C, Card, CardHeader, DataTable, Icon, NameCell, PageBody, PageHeader, Pill, SearchInput, Select, StatCard,
  StatGrid, StatusPill, downloadCsv, fmtDateTime, icons, matches, naira, nairaCompact, statusTone, sum, td, useAdminList,
} from "@/components/admin/ui";

const fetchTx = () => api.adminTransactions(getToken());

type KindFilter = "all" | TxKind;
type StatusFilter = "all" | "green" | "amber" | "red";

export default function TransactionsPage() {
  const { items, loading, error, retry } = useAdminList(fetchTx, normalizeTx);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  const visible = items
    .filter(t => kind === "all" || t.kind === kind)
    .filter(t => status === "all" || statusTone(t.status) === status)
    .filter(t => matches(query, t.userName, t.counterpartyName, t.reference, t.id, t.typeLabel));

  const ok = items.filter(t => statusTone(t.status) === "green");

  const exportCsv = () =>
    downloadCsv(`owa-transactions-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Transaction ID", "Name", "User", "Date", "Amount", "Type", "Status", "Reference"],
      ...visible.map((t: Tx) => [t.id, t.userName, t.userRole, t.createdAt ?? "", t.amount ?? "", t.typeLabel, t.status, t.reference]),
    ]);

  return (
    <>
      <PageHeader title="Transactions" subtitle="View and monitor all platform transactions" />
      <PageBody>
        <StatGrid>
          <StatCard loading={loading} label="Total Volume" value={nairaCompact(sum(ok.map(t => t.amount)))} icon={icons.trend} tone="blue" />
          <StatCard loading={loading} label="Successful Transactions" value={ok.length.toLocaleString()} icon={icons.checkCircle} tone="green" />
          <StatCard loading={loading} label="Pending Transactions" value={items.filter(t => statusTone(t.status) === "amber").length.toLocaleString()} icon={icons.clock} tone="amber" />
          <StatCard loading={loading} label="Failed Transactions" value={items.filter(t => statusTone(t.status) === "red").length.toLocaleString()} icon={icons.xCircle} tone="red" />
        </StatGrid>

        <Card>
          <CardHeader
            title="All Transactions"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search transactions..." />
              <Select label="Type" value={kind} onChange={setKind} options={[["all", "All types"], ["ride", "Ride Payment"], ["topup", "Wallet Top-up"], ["withdrawal", "Withdrawal"], ["other", "Other"]]} />
              <Select label="Status" value={status} onChange={setStatus} options={[["all", "All statuses"], ["green", "Completed"], ["amber", "Pending"], ["red", "Failed"]]} />
              <Button onClick={exportCsv} disabled={!visible.length}><Icon size={13}>{icons.download}</Icon>Export</Button>
            </>}
          />
          <DataTable
            columns={["Name", "User", "Date & Time", "Amount", "Type", "Status", ""]}
            loading={loading} error={error} onRetry={retry} isEmpty={visible.length === 0}
            emptyText={items.length ? "No transactions match your filters." : "No transactions yet."}
          >
            {visible.map(t => (
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
