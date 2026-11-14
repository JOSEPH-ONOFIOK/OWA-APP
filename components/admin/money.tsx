"use client";

import { useState } from "react";
import { api, getToken } from "@/lib/api";
import {
  Button, C, DialogBody, FailIcon, Modal, Raw, SuccessIcon, TimelineStep, pickId, pickName, pickNum, pickStr, titleCase,
} from "@/components/admin/ui";

/* ================= Transactions ================= */

export type TxKind = "ride" | "topup" | "withdrawal" | "other";

export interface Tx {
  id: string;
  kind: TxKind;
  typeLabel: string;
  amount: number | null;
  fee: number | null;
  net: number | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  userName: string;
  userRole: string;
  counterpartyName: string;
  counterpartyDetail: string;
  reference: string;
  mode: string;
  payoutId: string;
  remark: string;
  vehicleType: string;
}

const kindOf = (type: string): TxKind => {
  const t = type.toLowerCase();
  if (/top.?up|fund|deposit/.test(t)) return "topup";
  if (/withdraw|payout/.test(t)) return "withdrawal";
  if (/ride|fare|payment|transfer|debit/.test(t)) return "ride";
  return "other";
};

const KIND_LABEL: Record<TxKind, string> = { ride: "Ride Payment", topup: "Wallet Top-up", withdrawal: "Withdrawal", other: "Transaction" };

export const maskAccount = (acct: string) => (acct.length > 4 ? `•••• ${acct.slice(-4)}` : acct);

export const normalizeTx = (r: Raw): Tx => {
  const rawType = pickStr(r, "type", "category", "transactionType");
  const kind = kindOf(rawType);
  const amount = pickNum(r, "amount");
  const fee = pickNum(r, "fee", "charge", "chargeFee", "metadata.fee");
  const bank = pickStr(r, "bankName", "metadata.bankName", "bank.name", "destination.bankName");
  const acct = pickStr(r, "accountNumber", "metadata.accountNumber", "destination.accountNumber");
  const counterpartyName =
    kind === "withdrawal" ? bank || "Bank account"
    : kind === "topup" ? titleCase(pickStr(r, "channel", "source", "metadata.channel", "paymentMethod") || "Bank transfer")
    : pickName(r, "recipient", "receiver", "to", "driver", "metadata.recipient");
  return {
    id: pickId(r),
    kind,
    typeLabel: KIND_LABEL[kind] === "Transaction" && rawType ? titleCase(rawType) : KIND_LABEL[kind],
    amount,
    fee,
    net: pickNum(r, "netAmount", "amountCredited", "creditedAmount") ?? (amount !== null ? amount - (fee ?? 0) : null),
    status: pickStr(r, "status"),
    createdAt: pickStr(r, "createdAt", "date") || null,
    updatedAt: pickStr(r, "completedAt", "updatedAt") || null,
    userName: pickName(r, "user", "sender", "from", "passenger", "owner", "wallet.user") || pickStr(r, "userName"),
    userRole: titleCase(pickStr(r, "user.role", "sender.role", "role") || (kind === "withdrawal" ? "driver" : "passenger")),
    counterpartyName,
    counterpartyDetail: kind === "withdrawal" ? maskAccount(acct) : pickStr(r, "recipient.tag", "driver.tag", "to.tag"),
    reference: pickStr(r, "reference", "ref", "paystackReference", "metadata.reference"),
    mode: titleCase(pickStr(r, "paymentMethod", "mode", "channel", "metadata.channel") || (kind === "ride" ? "wallet" : kind === "withdrawal" ? "bank transfer" : "")),
    payoutId: pickStr(r, "payoutId", "payout.id", "payout._id", "withdrawalId"),
    remark: pickStr(r, "metadata.remark", "remark", "narration", "description"),
    vehicleType: titleCase(pickStr(r, "vehicleType", "driver.vehicleType", "recipient.vehicleType", "receiver.vehicleType", "metadata.vehicleType")),
  };
};

/** Progress timeline derived from the transaction's kind + status. */
export function txSteps(tx: Pick<Tx, "kind" | "status" | "createdAt" | "updatedAt">): TimelineStep[] {
  const labels: Record<TxKind, string[]> = {
    ride: ["Payment initiated", "Passenger wallet debited", "Driver credited"],
    topup: ["Top-up initiated", "Payment confirmed", "Wallet credited"],
    withdrawal: ["Withdrawal requested", "Approved by admin", "Sent to bank"],
    other: ["Initiated", "Processing", "Completed"],
  };
  return progress(labels[tx.kind], tx.status, tx.createdAt, tx.updatedAt);
}

export function progress(labels: string[], status: string, start: string | null, end: string | null, reachedOverride?: number): TimelineStep[] {
  const s = status.toLowerCase();
  const failed = /fail|reject|declin|cancel/.test(s);
  const done = /complete|success|paid|sent/.test(s);
  // How many steps are complete.
  const reached = reachedOverride ?? (done ? labels.length : /approv|process/.test(s) ? 2 : 1);
  return labels.map((label, i) => {
    if (i < reached) return { label, state: "done", time: i === 0 ? start : i === labels.length - 1 ? end : null };
    if (failed && i === reached) return { label, state: "failed", time: end };
    return { label, state: "pending" };
  });
}

/* ================= Payouts ================= */

export interface Payout {
  id: string;
  name: string;
  photo: string | null;
  role: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  amount: number | null;
  fee: number | null;
  net: number | null;
  status: string;
  type: string;
  reference: string;
  createdAt: string | null;
  updatedAt: string | null;
  failureReason: string;
}

export const normalizePayout = (r: Raw): Payout => {
  const amount = pickNum(r, "amount", "requestedAmount");
  const fee = pickNum(r, "fee", "transferFee", "charge");
  return {
    id: pickId(r),
    name: pickName(r, "driver", "driver.user", "user", "beneficiary") || pickStr(r, "accountName") || "Unknown",
    photo: pickStr(r, "driver.profilePicture", "user.profilePicture") || null,
    role: titleCase(pickStr(r, "user.role", "driver.role", "role") || "driver"),
    bankName: pickStr(r, "bankName", "bank.name", "destination.bankName"),
    accountNumber: pickStr(r, "accountNumber", "bank.accountNumber", "destination.accountNumber"),
    accountName: pickStr(r, "accountName", "bank.accountName", "destination.accountName"),
    amount,
    fee,
    net: pickNum(r, "netAmount", "amountToReceive") ?? (amount !== null ? amount - (fee ?? 0) : null),
    status: pickStr(r, "status") || "pending",
    type: titleCase(pickStr(r, "type") || "withdrawal"),
    reference: pickStr(r, "reference", "transferReference", "ref"),
    createdAt: pickStr(r, "createdAt", "requestedAt") || null,
    updatedAt: pickStr(r, "completedAt", "updatedAt") || null,
    failureReason: pickStr(r, "failureReason", "reason", "error", "message"),
  };
};

export const isPendingPayout = (status: string) => /pend|request|await/i.test(status);
export const isFailedPayout = (status: string) => /fail/i.test(status);

export const payoutSteps = (p: Payout) =>
  progress(["Withdrawal requested", "Approved by admin", "Sent to bank"], p.status, p.createdAt, p.updatedAt);

/* ================= Approve / reject / retry flow ================= */

type Stage = null | "approve" | "reject" | "retry" | "approved" | "rejected" | "retried";

/**
 * Renders the trigger buttons for a payout plus its confirm and result modals.
 * `onStatus` receives the new status after the server accepts the action.
 */
export function PayoutActions({ payout, onStatus, size = "md" }: { payout: Pick<Payout, "id" | "name" | "net" | "amount" | "status">; onStatus: (status: string) => void; size?: "sm" | "md" }) {
  const [stage, setStage] = useState<Stage>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [reason, setReason] = useState("");

  const pending = isPendingPayout(payout.status);
  const failed = isFailedPayout(payout.status);
  const amount = payout.net ?? payout.amount;
  const amountText = amount !== null ? `₦${amount.toLocaleString("en-NG")}` : "the requested amount";

  const close = () => { if (busy) return; setStage(null); setErr(""); setReason(""); };

  const run = async (action: "approve" | "reject" | "retry") => {
    setBusy(true);
    setErr("");
    try {
      const token = getToken();
      if (action === "approve") await api.adminApprovePayout(payout.id, token);
      else if (action === "reject") await api.adminRejectPayout(payout.id, reason.trim(), token);
      else await api.adminRetryPayout(payout.id, token);
      onStatus(action === "reject" ? "rejected" : "processing");
      setStage(action === "approve" ? "approved" : action === "reject" ? "rejected" : "retried");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const btn: React.CSSProperties = size === "sm" ? { height: 30, padding: "0 12px" } : {};

  return (
    <>
      {pending && (
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="dangerSoft" style={btn} onClick={() => setStage("reject")}>Reject</Button>
          <Button variant="success" style={btn} onClick={() => setStage("approve")}>Approve</Button>
        </div>
      )}
      {failed && <Button style={btn} onClick={() => setStage("retry")}>Retry Payout</Button>}

      {stage === "approve" && (
        <Modal onClose={close}>
          <DialogBody title="Approve Withdrawal?" text={`${amountText} will be sent to ${payout.name || "this user"}'s bank account.`}>
            {err && <p style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{err}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="dangerSoft" style={{ flex: 1, height: 38 }} onClick={close} disabled={busy}>Cancel</Button>
              <Button variant="success" style={{ flex: 1, height: 38 }} onClick={() => run("approve")} busy={busy}>Approve</Button>
            </div>
          </DialogBody>
        </Modal>
      )}
      {stage === "reject" && (
        <Modal onClose={close} highlight>
          <DialogBody title="Reject Withdrawal?" text={`${payout.name || "The user"}'s request for ${amountText} will be declined and they will be notified.`}>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} placeholder="Reason (optional)" style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, fontSize: 12, resize: "none", outline: "none", fontFamily: "inherit", marginBottom: 14 }} />
            {err && <p style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{err}</p>}
            <Button variant="danger" style={{ width: "100%", height: 40 }} onClick={() => run("reject")} busy={busy}>Reject Withdrawal</Button>
          </DialogBody>
        </Modal>
      )}
      {stage === "retry" && (
        <Modal onClose={close}>
          <DialogBody title="Retry Payout?" text={`We'll attempt to send ${amountText} to ${payout.name || "this user"}'s bank account again.`}>
            {err && <p style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{err}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" style={{ flex: 1, height: 38 }} onClick={close} disabled={busy}>Cancel</Button>
              <Button style={{ flex: 1, height: 38 }} onClick={() => run("retry")} busy={busy}>Retry Payout</Button>
            </div>
          </DialogBody>
        </Modal>
      )}
      {stage === "approved" && (
        <Modal onClose={close}><DialogBody icon={<SuccessIcon />} title="Withdrawal Approved" text="The payout is now being processed and will be sent to the user's bank." /></Modal>
      )}
      {stage === "retried" && (
        <Modal onClose={close}><DialogBody icon={<SuccessIcon />} title="Payout Retried" text="The payout has been resubmitted to the bank." /></Modal>
      )}
      {stage === "rejected" && (
        <Modal onClose={close}><DialogBody icon={<FailIcon />} title="Withdrawal Rejected" text="The request was declined and the user has been notified." /></Modal>
      )}
    </>
  );
}
