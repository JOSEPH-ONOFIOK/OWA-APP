"use client";

import { useEffect, useRef, useState } from "react";
import { api, getToken } from "@/lib/api";
import {
  Button, C, Card, CardHeader, ErrorState, Icon, PageBody, PageHeader, Raw, Select, fmtDateTime, icons, pickId,
  pickNum, pickStr, titleCase, useAdminList,
} from "@/components/admin/ui";

type Audience = "all" | "drivers" | "passengers";
const AUDIENCE_LABEL: Record<Audience, string> = { all: "All users", drivers: "Drivers", passengers: "Passengers" };

interface Announcement {
  id: string;
  message: string;
  audience: string;
  recipients: number | null;
  createdAt: string | null;
}

const normalize = (r: Raw): Announcement => ({
  id: pickId(r),
  message: pickStr(r, "message", "body", "content", "text"),
  audience: pickStr(r, "audience", "target", "recipientType") || "all",
  recipients: pickNum(r, "recipients", "recipientCount", "sentTo"),
  createdAt: pickStr(r, "createdAt", "sentAt") || null,
});

const fetchAnnouncements = () => api.adminAnnouncements(getToken());

const audienceText = (a: string) => AUDIENCE_LABEL[a.toLowerCase() as Audience] ?? titleCase(a);

export default function AnnouncementsPage() {
  const { items, setItems, loading, error, retry } = useAdminList(fetchAnnouncements, normalize);
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("all");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Oldest at the top, newest at the bottom — like a chat thread.
  const ordered = [...items].sort((a, b) => (a.createdAt ? Date.parse(a.createdAt) : 0) - (b.createdAt ? Date.parse(b.createdAt) : 0));

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [items.length]);

  const send = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    setSendError("");
    try {
      const res = await api.adminCreateAnnouncement({ message: text, audience }, getToken());
      const created = normalize((res?.data ?? res ?? {}) as Raw);
      setItems(xs => [...xs, { ...created, message: created.message || text, audience: created.audience || audience, createdAt: created.createdAt || new Date().toISOString() }]);
      setMessage("");
    } catch (e) {
      setSendError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHeader title="System Announcement" subtitle="Communicate with users and send announcements" />
      <PageBody>
        <Card style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 140px)", minHeight: 420 }}>
          <CardHeader
            title="System Announcement"
            subtitle="Broadcast messages to all users"
            right={<Button onClick={() => inputRef.current?.focus()}><Icon size={13} width={2.5}>{icons.plus}</Icon>New Announcement</Button>}
          />

          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "8px 18px 16px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
            {loading && <p style={{ color: C.faint, fontSize: 13, textAlign: "center", marginTop: 40 }}>Loading…</p>}
            {!loading && error && <ErrorState message={error} onRetry={retry} />}
            {!loading && !error && ordered.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", color: C.faint }}>
                <Icon size={28}>{icons.megaphone}</Icon>
                <p style={{ fontSize: 13, margin: "8px 0 0" }}>No announcements yet. Write one below to notify users.</p>
              </div>
            )}
            {!loading && !error && ordered.map((a, i) => (
              <div key={a.id || i} style={{ alignSelf: "flex-end", maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <div style={{ background: C.blue, color: "white", borderRadius: "12px 12px 2px 12px", padding: "10px 14px", fontSize: 12, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                  {a.message}
                </div>
                <p style={{ fontSize: 10, color: C.faint, margin: "4px 2px 0" }}>
                  {[audienceText(a.audience), a.recipients !== null ? `${a.recipients.toLocaleString()} recipients` : "", fmtDateTime(a.createdAt)].filter(Boolean).join(" · ")}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 18px" }}>
            {sendError && <p style={{ fontSize: 12, color: C.red, margin: "0 0 8px" }}>{sendError}</p>}
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <Select label="Audience" value={audience} onChange={setAudience} options={(Object.keys(AUDIENCE_LABEL) as Audience[]).map(k => [k, AUDIENCE_LABEL[k]])} />
              <textarea
                ref={inputRef}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Type an announcement… (Enter to send, Shift+Enter for a new line)"
                rows={1}
                style={{ flex: 1, minHeight: 34, maxHeight: 120, borderRadius: 8, border: "1px solid #e5e7eb", padding: "8px 12px", fontSize: 12, resize: "vertical", outline: "none", fontFamily: "inherit", background: "#f9fafb" }}
              />
              <Button onClick={send} busy={sending} disabled={!message.trim()} aria-label="Send announcement" style={{ width: 38, padding: 0 }}>
                {!sending && <Icon size={14}>{icons.send}</Icon>}
              </Button>
            </div>
          </div>
        </Card>
      </PageBody>
    </>
  );
}
