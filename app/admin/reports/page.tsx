"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { api, getToken } from "@/lib/api";
import {
  Button, C, Card, CardHeader, DataTable, Drawer, InfoRow, LinkButton, PageBody, PageHeader, Pill, Raw, SearchInput,
  SectionTitle, Select, StatCard, StatGrid, StatusPill, fmtDateTime, icons, matches, pickId, pickName, pickStr, td,
  titleCase, useAdminList, withinDays,
} from "@/components/admin/ui";

interface Report {
  id: string;
  reporter: string;
  reporterRole: string;
  reporterEmail: string;
  type: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string | null;
  resolvedAt: string | null;
  transactionRef: string;
}

const normalize = (r: Raw): Report => ({
  id: pickId(r),
  reporter: pickName(r, "reporter", "user", "reportedBy") || pickStr(r, "reporterName", "name") || "Anonymous",
  reporterRole: titleCase(pickStr(r, "reporter.role", "user.role", "role")),
  reporterEmail: pickStr(r, "reporter.email", "user.email", "email"),
  type: titleCase(pickStr(r, "type", "category") || "complaint"),
  subject: pickStr(r, "subject", "title", "issueType"),
  description: pickStr(r, "description", "message", "details", "body"),
  status: pickStr(r, "status") || "unresolved",
  createdAt: pickStr(r, "createdAt") || null,
  resolvedAt: pickStr(r, "resolvedAt") || null,
  transactionRef: pickStr(r, "transactionId", "transactionRef", "reference"),
});

const fetchReports = () => api.adminReports(getToken());
const isResolved = (r: Report) => /resolv|closed/i.test(r.status) && !/unresolv/i.test(r.status);

type Filter = "all" | "unresolved" | "resolved";

export default function ReportsPage() {
  const { items, setItems, loading, error, retry } = useAdminList(fetchReports, normalize);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Report | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const visible = items
    .filter(r => filter === "all" || (filter === "resolved" ? isResolved(r) : !isResolved(r)))
    .filter(r => matches(query, r.reporter, r.subject, r.type, r.description));

  const resolve = async () => {
    if (!selected) return;
    setBusy(true);
    setErr("");
    try {
      await api.adminResolveReport(selected.id, getToken());
      const updated = { ...selected, status: "resolved", resolvedAt: new Date().toISOString() };
      setItems(rs => rs.map(r => (r.id === selected.id ? updated : r)));
      setSelected(updated);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Reports & Issues" subtitle="Manage user complaints, and payment flags" />
      <PageBody>
        <StatGrid>
          <StatCard loading={loading} label="Reports & Issues" value={items.length.toLocaleString()} icon={icons.flag} tone="blue" />
          <StatCard loading={loading} label="Unresolved" value={items.filter(r => !isResolved(r)).length.toLocaleString()} icon={icons.alert} tone="amber" />
          <StatCard loading={loading} label="Resolved this week" value={items.filter(r => isResolved(r) && withinDays(r.resolvedAt, 7)).length.toLocaleString()} icon={icons.checkCircle} tone="green" />
        </StatGrid>

        <Card>
          <CardHeader
            title="Reports"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search subjects, reports..." />
              <Select label="Status" value={filter} onChange={setFilter} options={[["all", "All statuses"], ["unresolved", "Unresolved"], ["resolved", "Resolved"]]} />
            </>}
          />
          <DataTable
            columns={["Reporter", "Type", "Subject", "Status", "Date & Time", ""]}
            loading={loading} error={error} onRetry={retry} isEmpty={visible.length === 0}
            emptyText={items.length ? "No reports match your filters." : "No reports yet."}
          >
            {visible.map(r => (
              <tr key={r.id}>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{r.reporter}</td>
                <td style={td}><Pill tone={/dispute/i.test(r.type) ? "purple" : "gray"} dot={false}>{r.type}</Pill></td>
                <td style={td}>{r.subject || "—"}</td>
                <td style={td}><StatusPill status={r.status} /></td>
                <td style={{ ...td, color: C.muted }}>{fmtDateTime(r.createdAt)}</td>
                <td style={{ ...td, textAlign: "right" }}><LinkButton onClick={() => { setSelected(r); setErr(""); }}>View report</LinkButton></td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>

      {selected && (
        <Drawer
          title="Report details"
          onClose={() => !busy && setSelected(null)}
          footer={!isResolved(selected) ? <Button variant="success" style={{ flex: 1, height: 38 }} onClick={resolve} busy={busy}>Mark as resolved</Button> : undefined}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={selected.reporter} size={46} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>{selected.reporter}</p>
              <StatusPill status={selected.status} />
            </div>
          </div>
          <SectionTitle>Issue</SectionTitle>
          <InfoRow label="Type" value={selected.type} />
          <InfoRow label="Subject" value={selected.subject} />
          <InfoRow label="Reported" value={fmtDateTime(selected.createdAt)} />
          {selected.transactionRef && <InfoRow label="Transaction" value={selected.transactionRef} />}
          {isResolved(selected) && <InfoRow label="Resolved" value={fmtDateTime(selected.resolvedAt)} />}
          <SectionTitle>Description</SectionTitle>
          <p style={{ fontSize: 12, color: C.body, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap", background: "#f9fafb", borderRadius: 8, padding: 12 }}>
            {selected.description || "No description provided."}
          </p>
          <SectionTitle>Reporter</SectionTitle>
          <InfoRow label="Role" value={selected.reporterRole} />
          <InfoRow label="Email" value={selected.reporterEmail ? <a href={`mailto:${selected.reporterEmail}`} style={{ color: C.blue }}>{selected.reporterEmail}</a> : ""} />
          {err && <p style={{ fontSize: 12, color: C.red, margin: "12px 0 0" }}>{err}</p>}
        </Drawer>
      )}
    </>
  );
}
