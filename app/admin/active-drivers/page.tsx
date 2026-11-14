"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/Avatar";
import { api, getToken } from "@/lib/api";
import {
  C, Card, CardHeader, DataTable, DocRow, Drawer, InfoRow, NameCell, PageBody, PageHeader, Raw, SearchInput,
  SectionTitle, Select, StatCard, StatGrid, StatusPill, LinkButton, fmtDate, fmtDateTime, icons, isToday, matches,
  naira, pickBool, pickId, pickName, pickNum, pickStr, sum, td, titleCase, useAdminList,
} from "@/components/admin/ui";

interface ActiveDriver {
  id: string;
  name: string;
  photo: string | null;
  email: string;
  phone: string;
  tag: string;
  vehicleType: string;
  plateNumber: string;
  approval: string;
  online: boolean;
  totalRides: number | null;
  ridesToday: number | null;
  earnings: number | null;
  rating: number | null;
  lastActive: string | null;
  joinedAt: string | null;
  license: string | null;
  idCard: string | null;
}

const normalize = (r: Raw): ActiveDriver => {
  const lastActive = pickStr(r, "lastActive", "lastActiveAt", "lastSeen", "user.lastLogin") || null;
  return {
    id: pickId(r),
    name: pickName(r, "", "user") || "Unnamed driver",
    photo: pickStr(r, "profilePicture", "avatar", "user.profilePicture") || null,
    email: pickStr(r, "email", "user.email"),
    phone: pickStr(r, "phone", "phoneNumber", "user.phone"),
    tag: pickStr(r, "tag", "driverTag", "owaTag"),
    vehicleType: pickStr(r, "vehicleType", "vehicle.type"),
    plateNumber: pickStr(r, "plateNumber", "vehicle.plateNumber"),
    approval: pickStr(r, "status", "approvalStatus", "verificationStatus"),
    online: pickBool(r, "isOnline", "isActive", "online") ?? isToday(lastActive),
    totalRides: pickNum(r, "totalRides", "ridesCount", "stats.totalRides"),
    ridesToday: pickNum(r, "ridesToday", "stats.ridesToday"),
    earnings: pickNum(r, "totalEarnings", "earnings", "stats.totalEarnings"),
    rating: pickNum(r, "rating", "averageRating", "stats.rating"),
    lastActive,
    joinedAt: pickStr(r, "createdAt", "approvedAt") || null,
    license: pickStr(r, "driversLicense", "driversLicenseUrl") || null,
    idCard: pickStr(r, "idCard", "idCardUrl") || null,
  };
};

const fetchDrivers = () => api.adminDrivers(getToken());
const isApproved = (d: ActiveDriver) => /approv|active|verified/i.test(d.approval) && !/inactive/i.test(d.approval);

type Filter = "all" | "active" | "inactive";

export default function ActiveDriversPage() {
  const { items: all, loading, error, retry } = useAdminList(fetchDrivers, normalize);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<ActiveDriver | null>(null);

  // Only approved drivers count as "active drivers".
  const drivers = useMemo(() => all.filter(d => d.id && isApproved(d)), [all]);
  const visible = drivers
    .filter(d => filter === "all" || (filter === "active" ? d.online : !d.online))
    .filter(d => matches(query, d.name, d.tag, d.phone, d.plateNumber, d.vehicleType));

  const ratings = drivers.map(d => d.rating).filter((r): r is number => r !== null);
  const avgRating = ratings.length ? (sum(ratings) / ratings.length).toFixed(1) : "—";

  return (
    <>
      <PageHeader title="Active Drivers" subtitle="Manage your active approved drivers" />
      <PageBody>
        <StatGrid>
          <StatCard loading={loading} label="Total Registered Drivers" value={drivers.length.toLocaleString()} icon={icons.users} tone="blue" />
          <StatCard loading={loading} label="Active Now" value={drivers.filter(d => d.online).length.toLocaleString()} icon={icons.activity} tone="green" />
          <StatCard loading={loading} label="Average Rating" value={avgRating} icon={icons.star} tone="amber" />
          <StatCard loading={loading} label="Total Rides Today" value={sum(drivers.map(d => d.ridesToday)).toLocaleString()} icon={icons.car} tone="purple" />
        </StatGrid>

        <Card>
          <CardHeader
            title="Drivers"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search drivers..." />
              <Select label="Filter" value={filter} onChange={setFilter} options={[["all", "All drivers"], ["active", "Active now"], ["inactive", "Inactive"]]} />
            </>}
          />
          <DataTable
            columns={["Driver Name", "Tag", "Vehicle Type", "Total Rides", "Total Earnings", "Status", "Last Active", ""]}
            loading={loading} error={error} onRetry={retry} isEmpty={visible.length === 0}
            emptyText={drivers.length ? "No drivers match your filters." : "No approved drivers yet."}
          >
            {visible.map(d => (
              <tr key={d.id}>
                <td style={td}><NameCell name={d.name} src={d.photo} /></td>
                <td style={td}>{d.tag || "—"}</td>
                <td style={td}>{d.vehicleType || "—"}</td>
                <td style={td}>{d.totalRides?.toLocaleString() ?? "—"}</td>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{naira(d.earnings)}</td>
                <td style={td}><StatusPill status={d.online ? "active" : "inactive"} /></td>
                <td style={{ ...td, color: C.faint }}>{fmtDateTime(d.lastActive)}</td>
                <td style={{ ...td, textAlign: "right" }}><LinkButton onClick={() => setSelected(d)}>View details</LinkButton></td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>

      {selected && (
        <Drawer title="Driver details" onClose={() => setSelected(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={selected.name} src={selected.photo} size={46} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>{selected.name}</p>
              <StatusPill status={selected.online ? "active" : "inactive"} />
            </div>
          </div>
          <SectionTitle>Performance</SectionTitle>
          <InfoRow label="Total Rides" value={selected.totalRides?.toLocaleString() ?? "—"} />
          <InfoRow label="Rides Today" value={selected.ridesToday?.toLocaleString() ?? "—"} />
          <InfoRow label="Total Earnings" value={naira(selected.earnings)} />
          <InfoRow label="Rating" value={selected.rating?.toFixed(1) ?? "—"} />
          <InfoRow label="Last Active" value={fmtDateTime(selected.lastActive)} />
          <SectionTitle>Personal Information</SectionTitle>
          <InfoRow label="Phone No." value={selected.phone} />
          <InfoRow label="Email Address" value={selected.email} />
          <InfoRow label="Approval" value={titleCase(selected.approval)} />
          <InfoRow label="Joined" value={fmtDate(selected.joinedAt)} />
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
    </>
  );
}
