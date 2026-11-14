"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import { api, getToken } from "@/lib/api";
import {
  C, Card, CardHeader, DataTable, Drawer, InfoRow, LinkButton, NameCell, PageBody, PageHeader, Raw, SearchInput,
  SectionTitle, Select, StatCard, StatGrid, StatusPill, fmtDate, fmtDateTime, icons, isToday, matches, naira,
  nairaCompact, pickBool, pickId, pickName, pickNum, pickStr, sum, td, useAdminList,
} from "@/components/admin/ui";

interface Passenger {
  id: string;
  name: string;
  photo: string | null;
  email: string;
  phone: string;
  matricNumber: string;
  department: string;
  balance: number | null;
  trips: number | null;
  totalSpent: number | null;
  status: string;
  lastActive: string | null;
  joinedAt: string | null;
}

const normalize = (r: Raw): Passenger => {
  const suspended = pickBool(r, "isSuspended", "suspended");
  return {
    id: pickId(r),
    name: pickName(r, "", "user") || "Unnamed passenger",
    photo: pickStr(r, "profilePicture", "avatar") || null,
    email: pickStr(r, "email", "user.email"),
    phone: pickStr(r, "phone", "phoneNumber", "user.phone"),
    matricNumber: pickStr(r, "matricNumber", "matricNo", "studentId"),
    department: pickStr(r, "department", "faculty"),
    balance: pickNum(r, "walletBalance", "wallet.balance", "balance"),
    trips: pickNum(r, "tripsTaken", "totalTrips", "ridesCount", "stats.totalTrips"),
    totalSpent: pickNum(r, "totalSpent", "stats.totalSpent"),
    status: pickStr(r, "status") || (suspended ? "suspended" : "active"),
    lastActive: pickStr(r, "lastActive", "lastActiveAt", "lastLogin") || null,
    joinedAt: pickStr(r, "createdAt") || null,
  };
};

const fetchPassengers = () => api.adminPassengers(getToken());

type Sort = "newest" | "oldest" | "balance";

export default function PassengersPage() {
  const { items, loading, error, retry } = useAdminList(fetchPassengers, normalize);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [selected, setSelected] = useState<Passenger | null>(null);

  const time = (p: Passenger) => (p.joinedAt ? new Date(p.joinedAt).getTime() : 0);
  const visible = items
    .filter(p => matches(query, p.name, p.email, p.phone, p.matricNumber))
    .sort((a, b) => sort === "balance" ? (b.balance ?? 0) - (a.balance ?? 0) : sort === "newest" ? time(b) - time(a) : time(a) - time(b));

  return (
    <>
      <PageHeader title="Passenger/ Student" subtitle="Manage students and their wallets" />
      <PageBody>
        <StatGrid>
          <StatCard loading={loading} label="Total Passengers" value={items.length.toLocaleString()} icon={icons.users} tone="blue" />
          <StatCard loading={loading} label="Active Today" value={items.filter(p => isToday(p.lastActive)).length.toLocaleString()} icon={icons.activity} tone="green" />
          <StatCard loading={loading} label="Total Wallet Balance" value={nairaCompact(sum(items.map(p => p.balance)))} icon={icons.wallet} tone="amber" />
          <StatCard loading={loading} label="Total Spent" value={nairaCompact(sum(items.map(p => p.totalSpent)))} icon={icons.cash} tone="purple" />
        </StatGrid>

        <Card>
          <CardHeader
            title="Passengers"
            right={<>
              <SearchInput value={query} onChange={setQuery} placeholder="Search name, email, matric no..." />
              <Select label="Sort" value={sort} onChange={setSort} options={[["newest", "Sort: Newest"], ["oldest", "Sort: Oldest"], ["balance", "Sort: Balance"]]} />
            </>}
          />
          <DataTable
            columns={["Name", "Email", "Wallet Balance", "Trips Taken", "Status", "Joined Date", ""]}
            loading={loading} error={error} onRetry={retry} isEmpty={visible.length === 0}
            emptyText={items.length ? "No passengers match your search." : "No passengers yet."}
          >
            {visible.map(p => (
              <tr key={p.id || p.email}>
                <td style={td}><NameCell name={p.name} src={p.photo} /></td>
                <td style={td}>{p.email || "—"}</td>
                <td style={{ ...td, fontWeight: 600, color: C.text }}>{naira(p.balance)}</td>
                <td style={td}>{p.trips?.toLocaleString() ?? "—"}</td>
                <td style={td}><StatusPill status={p.status} /></td>
                <td style={{ ...td, color: C.faint }}>{fmtDate(p.joinedAt)}</td>
                <td style={{ ...td, textAlign: "right" }}><LinkButton onClick={() => setSelected(p)}>View details</LinkButton></td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </PageBody>

      {selected && (
        <Drawer title="Passenger details" onClose={() => setSelected(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={selected.name} src={selected.photo} size={46} />
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px" }}>{selected.name}</p>
              <StatusPill status={selected.status} />
            </div>
          </div>
          <SectionTitle>Wallet</SectionTitle>
          <InfoRow label="Wallet Balance" value={naira(selected.balance)} />
          <InfoRow label="Total Spent" value={naira(selected.totalSpent)} />
          <InfoRow label="Trips Taken" value={selected.trips?.toLocaleString() ?? "—"} />
          <SectionTitle>Personal Information</SectionTitle>
          <InfoRow label="Email Address" value={selected.email} />
          <InfoRow label="Phone No." value={selected.phone} />
          <InfoRow label="Matric No." value={selected.matricNumber} />
          <InfoRow label="Department" value={selected.department} />
          <InfoRow label="Joined" value={fmtDate(selected.joinedAt)} />
          <InfoRow label="Last Active" value={fmtDateTime(selected.lastActive)} />
        </Drawer>
      )}
    </>
  );
}
