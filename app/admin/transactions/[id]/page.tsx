"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { PayoutActions, normalizeTx, txSteps } from "@/components/admin/money";
import {
  AmountTile, BackLink, C, Card, ErrorState, InfoRow, PageBody, PageHeader, PartyRow, StatusPill, Timeline,
  fmtDateTime, naira, useAdminItem,
} from "@/components/admin/ui";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const fetcher = useCallback(() => api.adminTransaction(id, getToken()), [id]);
  const { item: tx, loading, error, retry } = useAdminItem(fetcher, normalizeTx);
  const [status, setStatus] = useState<string | null>(null);

  const current = tx ? { ...tx, status: status ?? tx.status } : null;

  return (
    <>
      <PageHeader title="Transactions" subtitle="View and monitor all platform transactions" />
      <PageBody>
        <BackLink href="/admin/transactions">Back to Transactions</BackLink>

        {loading && <p style={{ color: C.faint, fontSize: 13 }}>Loading transaction…</p>}
        {!loading && error && <Card><ErrorState message={error} onRetry={retry} /></Card>}

        {current && (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, color: C.faint, margin: "0 0 4px" }}>{fmtDateTime(current.createdAt)}</p>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>
                  {current.kind === "withdrawal" && current.userName ? `Withdrawal by ${current.userName}` : current.typeLabel}
                </h2>
                <StatusPill status={current.status} />
              </div>
              {current.kind === "withdrawal" && (
                <PayoutActions
                  payout={{ id: current.payoutId || current.id, name: current.userName, amount: current.amount, net: current.net, status: current.status }}
                  onStatus={setStatus}
                />
              )}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(240px, 1fr)", gap: 16, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card style={{ padding: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <AmountTile label="Amount" value={naira(current.amount)} />
                  {current.kind !== "ride" && current.fee !== null && <AmountTile label="Charge fee" value={`-${naira(current.fee)}`} tone="red" />}
                  {current.kind === "topup" && <AmountTile label="Top-up" value={naira(current.net)} tone="green" />}
                  {current.kind === "withdrawal" && <AmountTile label="To receive" value={naira(current.net)} tone="green" />}
                </Card>

                <Card style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>Transaction</p>
                  <PartyRow role={current.kind === "topup" ? "Account" : "From"} name={current.userName} detail={current.userRole} />
                  <div style={{ borderLeft: "2px dashed #e5e7eb", height: 14, marginLeft: 15 }} />
                  <PartyRow
                    role={current.kind === "topup" ? "Funded via" : "To"}
                    name={current.counterpartyName}
                    detail={current.counterpartyDetail || (current.kind === "ride" ? "Driver" : "")}
                  />
                  {current.remark && <p style={{ fontSize: 12, color: C.muted, margin: "8px 0 0" }}>Note: {current.remark}</p>}
                </Card>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>Progress Timeline</p>
                  <Timeline steps={txSteps(current)} />
                </Card>
                <Card style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px" }}>Reference</p>
                  <InfoRow label="Transaction ID" value={current.id} />
                  <InfoRow label="Reference" value={current.reference} />
                  <InfoRow label="Mode of payment" value={current.mode} />
                </Card>
              </div>
            </div>
          </>
        )}
      </PageBody>
    </>
  );
}
