"use client";

import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { api, getToken } from "@/lib/api";
import { PayoutActions, isFailedPayout, maskAccount, normalizePayout, payoutSteps } from "@/components/admin/money";
import {
  AmountTile, BackLink, C, Card, ErrorState, Icon, InfoRow, PageBody, PageHeader, PartyRow, StatusPill, Timeline,
  fmtDateTime, icons, naira, useAdminItem,
} from "@/components/admin/ui";

export default function PayoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const fetcher = useCallback(() => api.adminPayout(id, getToken()), [id]);
  const { item, loading, error, retry } = useAdminItem(fetcher, normalizePayout);
  const [status, setStatus] = useState<string | null>(null);

  const p = item ? { ...item, status: status ?? item.status } : null;

  return (
    <>
      <PageHeader title="Payments & Withdrawals" subtitle="Manage driver payouts and platform commissions" />
      <PageBody>
        <BackLink href="/admin/payments">Back to Payments</BackLink>

        {loading && <p style={{ color: C.faint, fontSize: 13 }}>Loading payout…</p>}
        {!loading && error && <Card><ErrorState message={error} onRetry={retry} /></Card>}

        {p && (
          <>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, color: C.faint, margin: "0 0 4px" }}>{fmtDateTime(p.createdAt)}</p>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>Payout to {p.name}</h2>
                <StatusPill status={p.status} />
              </div>
              <PayoutActions payout={p} onStatus={setStatus} />
            </div>

            {isFailedPayout(p.status) && (
              <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 10, background: "#FEF2F2", border: "1px solid #FECACA", color: C.red }}>
                <Icon size={16}>{icons.alert}</Icon>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Payout failed</p>
                  <p style={{ fontSize: 12, margin: "2px 0 0" }}>{p.failureReason || "The bank could not complete this transfer. Check the account details and retry."}</p>
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(240px, 1fr)", gap: 16, alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card style={{ padding: 20, display: "flex", gap: 16, flexWrap: "wrap" }}>
                  <AmountTile label="Requested amount" value={naira(p.amount)} />
                  <AmountTile label="Transfer fee" value={p.fee !== null ? `-${naira(p.fee)}` : "—"} tone="red" />
                  <AmountTile label="Driver receives" value={naira(p.net)} tone="green" />
                </Card>
                <Card style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px" }}>Payee &amp; Destination</p>
                  <PartyRow role="Payee" name={p.name} detail={p.role} />
                  <div style={{ borderLeft: "2px dashed #e5e7eb", height: 14, marginLeft: 15 }} />
                  <PartyRow role="To" name={p.bankName || "Bank account"} detail={[p.accountName, maskAccount(p.accountNumber)].filter(Boolean).join(" · ")} />
                </Card>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Card style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 12px" }}>Progress Timeline</p>
                  <Timeline steps={payoutSteps(p)} />
                </Card>
                <Card style={{ padding: "16px 18px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 6px" }}>Reference</p>
                  <InfoRow label="Payout ID" value={p.id} />
                  <InfoRow label="Reference" value={p.reference} />
                  <InfoRow label="Mode of payment" value="Bank transfer" />
                </Card>
              </div>
            </div>
          </>
        )}
      </PageBody>
    </>
  );
}
