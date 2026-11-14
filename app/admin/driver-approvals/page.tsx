"use client";

import { useCallback, useState } from "react";
import Avatar from "@/components/Avatar";
import { api, getToken } from "@/lib/api";
import {
  Button, C, Card, CardHeader, DataTable, DialogBody, DocRow, Drawer, FailIcon, InfoRow, LinkButton, Modal, NameCell,
  PageBody, PageHeader, Raw, SearchInput, SectionTitle, Select, StatusPill, SuccessIcon, fmtDate, matches, pickId,
  pickName, pickStr, td, useAdminList,
} from "@/components/admin/ui";

type Status = "pending" | "approved" | "rejected";

interface DriverApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tag: string;
  vehicleType: string;
  plateNumber: string;
  status: Status;
  appliedAt: string | null;
  photo: string | null;
  idCard: string | null;
  license: string | null;
}

const toStatus = (v: string): Status => {
  const s = v.toLowerCase();
  if (s.includes("approv") || s === "active" || s === "verified") return "approved";
  if (s.includes("reject") || s === "declined") return "rejected";
  return "pending";
};

const normalize = (r: Raw): DriverApplication => ({
  id: pickId(r) || pickStr(r, "driverId", "user.id"),
  fullName: pickName(r, "", "user") || "Unnamed driver",
  email: pickStr(r, "email", "user.email"),
  phone: pickStr(r, "phone", "phoneNumber", "user.phone", "user.phoneNumber"),
  tag: pickStr(r, "tag", "driverTag", "owaTag"),
  vehicleType: pickStr(r, "vehicleType"),
  plateNumber: pickStr(r, "plateNumber"),
  status: toStatus(pickStr(r, "status", "approvalStatus", "verificationStatus")),
  appliedAt: pickStr(r, "createdAt", "appliedAt", "submittedAt") || null,
  photo: pickStr(r, "profilePicture", "avatar", "user.profilePicture") || null,
  idCard: pickStr(r, "idCard", "idCardUrl") || null,
  license: pickStr(r, "driversLicense", "driversLicenseUrl", "licenseUrl") || null,
});

const fetchDrivers = () => api.adminDrivers(getToken());

type Dialog = null | "approve" | "reject" | "approved" | "rejected";
type SortOrder = "newest" | "oldest";

export default function DriverApprovalsPage() {
  const { items: drivers, setItems: setDrivers, loading, error, retry } = useAdminList(fetchDrivers, normalize);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [sort, setSort] = useState<SortOrder>("newest");

  const [selected, setSelected] = useState<DriverApplication | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const time = (d: DriverApplication) => (d.appliedAt ? new Date(d.appliedAt).getTime() : 0);
  const visible = drivers
    .filter(d => d.id)
    .filter(d => statusFilter === "all" || d.status === statusFilter)
    .filter(d => matches(query, d.fullName, d.tag, d.phone, d.plateNumber, d.email))
    .sort((a, b) => (sort === "newest" ? time(b) - time(a) : time(a) - time(b)));

  const closeDialog = useCallback(() => {
    if (busy) return;
    setDialog(null);
    setActionError("");
    setRejectReason("");
  }, [busy]);

  const closeResult = useCallback(() => {
    setDialog(null);
    setSelected(null);
    setRejectReason("");
  }, []);

  const decide = async (decision: "approve" | "reject") => {
    if (!selected) return;
    setBusy(true);
    setActionError("");
    try {
      const token = getToken();
      if (decision === "approve") await api.adminApproveDriver(selected.id, token);
      else await api.adminRejectDriver(selected.id, rejectReason.trim(), token);
      const status: Status = decision === "approve" ? "approved" : "rejected";
      setDrivers(ds => ds.map(d => (d.id === selected.id ? { ...d, status } : d)));
      setSelected(s => (s ? { ...s, status } : s));
      setDialog(decision === "approve" ? "approved" : "rejected");
    } catch (err) {
      setActionError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Driver Approvals" subtitle="Review and approve registered drivers" />
      <PageBody>
        <Card>
          <CardHeader
            title="Applications"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search by name, tag, or phone..." />
              <Select label="Filter by status" value={statusFilter} onChange={setStatusFilter} options={[["all", "All Statuses"], ["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]]} />
              <Select label="Sort order" value={sort} onChange={setSort} options={[["newest", "Sort: Newest"], ["oldest", "Sort: Oldest"]]} />
            </>}
          />
          <DataTable
            columns={["Driver Name", "Tag/ License", "Vehicle", "Phone No.", "Status", ""]}
            loading={loading} error={error} onRetry={retry} isEmpty={visible.length === 0}
            emptyText={drivers.length ? "No drivers match your filters." : "No driver applications yet."}
          >
            {visible.map(d => (
              <tr key={d.id} style={{ background: selected?.id === d.id ? "#f5f9ff" : undefined }}>
                <td style={td}><NameCell name={d.fullName} src={d.photo} /></td>
                <td style={td}>{d.tag || d.plateNumber || "—"}</td>
                <td style={td}>{d.vehicleType || "—"}</td>
                <td style={td}>{d.phone || "—"}</td>
                <td style={td}><StatusPill status={d.status} /></td>
                <td style={{ ...td, textAlign: "right" }}><LinkButton onClick={() => { setSelected(d); setActionError(""); }}>View details</LinkButton></td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>

      {selected && (
        <Drawer
          title="Driver details"
          onClose={() => !dialog && setSelected(null)}
          footer={selected.status === "pending" ? <>
            <Button variant="dangerSoft" style={{ flex: 1, height: 38 }} onClick={() => setDialog("reject")}>Reject</Button>
            <Button variant="success" style={{ flex: 1, height: 38 }} onClick={() => setDialog("approve")}>Approve</Button>
          </> : undefined}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={selected.fullName} src={selected.photo} size={46} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>{selected.fullName}</p>
              <p style={{ fontSize: 11, color: C.muted, margin: "0 0 5px" }}>
                {[selected.vehicleType && `${selected.vehicleType} Driver`, selected.tag && `Tag: ${selected.tag}`].filter(Boolean).join(" · ") || "Driver"}
              </p>
              <StatusPill status={selected.status} />
            </div>
          </div>

          <SectionTitle>Personal Information</SectionTitle>
          <InfoRow label="Full Name" value={selected.fullName} />
          <InfoRow label="Phone No." value={selected.phone} />
          <InfoRow label="Email Address" value={selected.email} />
          <InfoRow label="Date Applied" value={fmtDate(selected.appliedAt)} />

          <SectionTitle>Vehicle Details</SectionTitle>
          <InfoRow label="Vehicle Type" value={selected.vehicleType} />
          <InfoRow label="Plate Number" value={selected.plateNumber} />
          <InfoRow label="Assigned Tag" value={selected.tag} />

          <SectionTitle>Documents</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <DocRow label="National ID Card" url={selected.idCard} />
            <DocRow label="Drivers License" url={selected.license} />
          </div>
        </Drawer>
      )}

      {dialog === "approve" && selected && (
        <Modal onClose={closeDialog}>
          <DialogBody
            icon={<Avatar name={selected.fullName} src={selected.photo} size={56} />}
            title="Approve Driver?"
            text="This driver will gain access to the OWA driver platform and can begin receiving payments from students."
          >
            {actionError && <p style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{actionError}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="dangerSoft" style={{ flex: 1, height: 38 }} onClick={closeDialog} disabled={busy}>Cancel</Button>
              <Button variant="success" style={{ flex: 1, height: 38 }} onClick={() => decide("approve")} busy={busy}>Approve</Button>
            </div>
          </DialogBody>
        </Modal>
      )}

      {dialog === "reject" && selected && (
        <Modal onClose={closeDialog} highlight>
          <DialogBody
            icon={<Avatar name={selected.fullName} src={selected.photo} size={56} />}
            title="Reject Driver Application?"
            text="The application will be rejected and the driver will be notified to review and resubmit their information."
          >
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional), e.g. invalid drivers license"
              rows={3}
              style={{ width: "100%", borderRadius: 8, border: "1px solid #e5e7eb", padding: 10, fontSize: 12, resize: "none", outline: "none", fontFamily: "inherit", marginBottom: 14 }}
            />
            {actionError && <p style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{actionError}</p>}
            <Button variant="danger" style={{ width: "100%", height: 40 }} onClick={() => decide("reject")} busy={busy}>Reject Application</Button>
          </DialogBody>
        </Modal>
      )}

      {dialog === "approved" && (
        <Modal onClose={closeResult}>
          <DialogBody icon={<SuccessIcon />} title="Driver Approved" text="The driver has been approved and now has access to the OWA driver dashboard." />
        </Modal>
      )}

      {dialog === "rejected" && (
        <Modal onClose={closeResult}>
          <DialogBody icon={<FailIcon />} title="Driver Rejected" text="The driver's application was reviewed and has been rejected, and they do not have access to the OWA driver dashboard." />
        </Modal>
      )}
    </>
  );
}
