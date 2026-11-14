"use client";

import { useEffect, useRef, useState } from "react";
import { api, getToken } from "@/lib/api";
import {
  Button, C, Card, CardHeader, DataTable, DialogBody, Icon, Modal, NameCell, PageBody, PageHeader, Raw, SearchInput,
  Select, StatCard, StatGrid, StatusPill, SuccessIcon, extractList, fmtDate, icons, matches, pickId, pickName, pickStr,
  td, useAdminList,
} from "@/components/admin/ui";

const VEHICLE_TYPES = ["Bus", "Bike", "Keke"] as const;

interface Vehicle {
  id: string;
  driverName: string;
  driverPhoto: string | null;
  tag: string;
  type: string;
  plateNumber: string;
  status: string;
  registeredAt: string | null;
}

const normalize = (r: Raw): Vehicle => {
  const driverName = pickName(r, "driver", "driver.user", "assignedDriver");
  return {
    id: pickId(r),
    driverName,
    driverPhoto: pickStr(r, "driver.profilePicture") || null,
    tag: pickStr(r, "tag", "tagNumber", "owaTag"),
    type: pickStr(r, "vehicleType", "type"),
    plateNumber: pickStr(r, "plateNumber"),
    status: pickStr(r, "status") || (driverName ? "assigned" : "unassigned"),
    registeredAt: pickStr(r, "createdAt", "registeredAt") || null,
  };
};

const fetchVehicles = () => api.adminVehicles(getToken());

type TypeFilter = "all" | (typeof VEHICLE_TYPES)[number];

export default function VehiclesPage() {
  const { items, loading, error, retry } = useAdminList(fetchVehicles, normalize);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const visible = items
    .filter(v => typeFilter === "all" || v.type.toLowerCase() === typeFilter.toLowerCase())
    .filter(v => matches(query, v.driverName, v.tag, v.plateNumber, v.type));
  const countType = (t: string) => items.filter(v => v.type.toLowerCase() === t.toLowerCase()).length;

  return (
    <>
      <PageHeader title="Vehicles/ Tags" subtitle="Register vehicles and assign them to drivers" />
      <PageBody>
        <StatGrid>
          <StatCard loading={loading} label="Total Vehicles" value={items.length.toLocaleString()} icon={icons.car} tone="blue" />
          <StatCard loading={loading} label="Buses" value={countType("Bus").toLocaleString()} icon={icons.car} tone="green" />
          <StatCard loading={loading} label="Bikes" value={countType("Bike").toLocaleString()} icon={icons.bike} tone="amber" />
          <StatCard loading={loading} label="Unassigned" value={items.filter(v => !v.driverName).length.toLocaleString()} icon={icons.tag} tone="purple" />
        </StatGrid>

        <Card>
          <CardHeader
            title="Vehicles"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search by tag, plate, driver..." />
              <Select label="Vehicle type" value={typeFilter} onChange={setTypeFilter} options={[["all", "All types"], ...VEHICLE_TYPES.map(t => [t, t] as [TypeFilter, string])]} />
              <Button onClick={() => setAdding(true)}><Icon size={13} width={2.5}>{icons.plus}</Icon>Add Vehicle</Button>
            </>}
          />
          <DataTable
            columns={["Driver Name", "Tag", "Vehicle Type", "Plate Number", "Status", "Registration Date"]}
            loading={loading} error={error} onRetry={retry} isEmpty={visible.length === 0}
            emptyText={items.length ? "No vehicles match your filters." : "No vehicles registered yet."}
          >
            {visible.map(v => (
              <tr key={v.id || v.plateNumber}>
                <td style={td}>{v.driverName ? <NameCell name={v.driverName} src={v.driverPhoto} /> : <span style={{ color: C.faint }}>Unassigned</span>}</td>
                <td style={td}>{v.tag || "—"}</td>
                <td style={td}>{v.type || "—"}</td>
                <td style={td}>{v.plateNumber || "—"}</td>
                <td style={td}><StatusPill status={v.status} /></td>
                <td style={{ ...td, color: C.faint }}>{fmtDate(v.registeredAt)}</td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>

      {adding && <AddVehicleModal onClose={() => setAdding(false)} onAdded={() => { setAdding(false); setAdded(true); retry(); }} />}
      {added && (
        <Modal onClose={() => setAdded(false)}>
          <DialogBody icon={<SuccessIcon />} title="Vehicle Added" text="The vehicle has been registered and its tag is ready to use." />
        </Modal>
      )}
    </>
  );
}

/* ---------------- Add Vehicle modal ---------------- */

interface DriverOption { id: string; name: string }

const label: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: C.text, margin: "0 0 6px", display: "block" };
const input: React.CSSProperties = { width: "100%", height: 38, borderRadius: 8, border: "1px solid #e5e7eb", padding: "0 12px", fontSize: 12, outline: "none", background: "white" };

function AddVehicleModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [type, setType] = useState<string>("Bus");
  const [plate, setPlate] = useState("");
  const [tag, setTag] = useState("");
  const [driverId, setDriverId] = useState("");
  const [license, setLicense] = useState<File | null>(null);
  const [registration, setRegistration] = useState<File | null>(null);
  const [drivers, setDrivers] = useState<DriverOption[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    api.adminDrivers(getToken())
      .then(d => setDrivers(
        extractList(d)
          .filter(r => /approv|active|verified/i.test(pickStr(r, "status", "approvalStatus", "verificationStatus")))
          .map(r => ({ id: pickId(r), name: pickName(r, "", "user") }))
          .filter(o => o.id && o.name),
      ))
      .catch(() => setDrivers([]));
  }, []);

  const canSubmit = plate.trim() && tag.trim() && !busy;

  const submit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("vehicleType", type);
      fd.append("plateNumber", plate.trim().toUpperCase());
      fd.append("tag", tag.trim().toUpperCase());
      if (driverId) fd.append("driverId", driverId);
      if (license) fd.append("driversLicense", license);
      if (registration) fd.append("vehicleRegistration", registration);
      await api.adminAddVehicle(fd, getToken());
      onAdded();
    } catch (e) {
      setErr((e as Error).message);
      setBusy(false);
    }
  };

  return (
    <Modal onClose={() => !busy && onClose()} width={440} align="left">
      <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 2px" }}>Add Vehicle</p>
      <p style={{ fontSize: 11, color: C.faint, margin: "0 0 18px" }}>Register a vehicle and assign it to a driver</p>

      <span style={label}>Vehicle Type</span>
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {VEHICLE_TYPES.map(t => {
          const on = type === t;
          return (
            <button key={t} type="button" onClick={() => setType(t)} style={{ flex: 1, height: 64, borderRadius: 10, border: `1.5px solid ${on ? C.blue : "#e5e7eb"}`, background: on ? "#EAF2FF" : "white", color: on ? C.blue : C.muted, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, fontSize: 12, fontWeight: 600 }}>
              <Icon size={18}>{t === "Bike" ? icons.bike : icons.car}</Icon>{t}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <label style={label} htmlFor="plate">Plate Number</label>
          <input id="plate" style={input} value={plate} onChange={e => setPlate(e.target.value.toUpperCase())} placeholder="e.g. OAU-123-XY" />
        </div>
        <div style={{ flex: 1 }}>
          <label style={label} htmlFor="tag">Tag Number</label>
          <input id="tag" style={input} value={tag} onChange={e => setTag(e.target.value.toUpperCase())} placeholder="e.g. BUS-012" />
        </div>
      </div>

      <label style={label} htmlFor="driver">Assigned Driver</label>
      <select id="driver" style={{ ...input, cursor: "pointer", marginBottom: 16, color: driverId ? C.text : C.faint }} value={driverId} onChange={e => setDriverId(e.target.value)}>
        <option value="">{drivers.length ? "Select a driver (optional)" : "No approved drivers available"}</option>
        {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
      </select>

      <span style={label}>Required Documents</span>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        <UploadRow title="Drivers License" file={license} onChange={setLicense} />
        <UploadRow title="Vehicle Registration Document" file={registration} onChange={setRegistration} />
      </div>

      {err && <p style={{ fontSize: 12, color: C.red, margin: "0 0 12px" }}>{err}</p>}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button variant="ghost" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button onClick={submit} busy={busy} disabled={!canSubmit}>Add Vehicle</Button>
      </div>
    </Modal>
  );
}

function UploadRow({ title, file, onChange }: { title: string; file: File | null; onChange: (f: File | null) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [tooBig, setTooBig] = useState(false);
  const done = !!file;
  const pick = (f: File | null) => {
    const big = !!f && f.size > 5 * 1024 * 1024;
    setTooBig(big);
    onChange(big ? null : f);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, border: `1px ${done ? "solid" : "dashed"} ${done ? "#bbf7d0" : "#d1d5db"}`, background: done ? "#F0FDF4" : "white" }}>
      <span style={{ color: done ? "#16A34A" : C.muted, display: "flex" }}><Icon size={16}>{done ? icons.checkCircle : icons.file}</Icon></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 600, margin: 0, color: C.text }}>{title}</p>
        <p style={{ fontSize: 11, color: C.faint, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {file ? `${file.name} · ${(file.size / 1024).toFixed(0)} KB` : tooBig ? <span style={{ color: C.red }}>File is larger than 5MB</span> : "PDF, JPG or PNG, max 5MB"}
        </p>
      </div>
      <input ref={ref} type="file" accept=".pdf,image/*" hidden onChange={e => { pick(e.target.files?.[0] ?? null); e.target.value = ""; }} />
      {done ? (
        <button type="button" onClick={() => onChange(null)} style={{ background: "none", border: "none", color: C.red, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remove</button>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} style={{ background: "none", border: "none", color: C.blue, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon size={13}>{icons.upload}</Icon>Upload
        </button>
      )}
    </div>
  );
}
