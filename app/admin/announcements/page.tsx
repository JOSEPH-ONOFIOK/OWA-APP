"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, getToken } from "@/lib/api";
import {
  Button, C, Card, CardHeader, ErrorState, Icon, PageBody, PageHeader, Raw, Select, extractItem, extractList,
  fmtDateTime, icons, pickId, pickNum, pickStr, titleCase,
} from "@/components/admin/ui";

/** Backend audience values. Every announcement is delivered as an ANNOUNCEMENT notification. */
type Audience = "ALL" | "STUDENT" | "DRIVER";
const AUDIENCE_LABEL: Record<Audience, string> = { ALL: "All users", STUDENT: "Students", DRIVER: "Drivers" };
const PAGE_SIZE = 20;

interface Announcement {
  id: string;
  message: string;
  audience: string;
  recipients: number | null;
  createdAt: string | null;
}

const normalize = (r: Raw): Announcement => ({
  id: pickId(r),
  message: pickStr(r, "message", "body", "content"),
  audience: pickStr(r, "audience") || "ALL",
  recipients: pickNum(r, "recipientCount", "recipients"),
  createdAt: pickStr(r, "createdAt", "sentAt") || null,
});

const audienceText = (a: string) => AUDIENCE_LABEL[a.toUpperCase() as Audience] ?? titleCase(a);

/** Works out whether older pages exist, from pagination metadata if present, else from a full page. */
const hasMorePages = (res: unknown, page: number, received: number) => {
  const r = (res ?? {}) as Raw;
  const totalPages = pickNum(r, "meta.totalPages", "totalPages", "pagination.totalPages", "data.totalPages", "data.meta.totalPages");
  if (totalPages !== null) return page < totalPages;
  const total = pickNum(r, "meta.total", "total", "pagination.total", "data.total", "data.meta.total");
  if (total !== null) return page * PAGE_SIZE < total;
  return received === PAGE_SIZE;
};

export default function AnnouncementsPage() {
  // Stored newest first, as the API returns them; rendered oldest-to-newest like a chat thread.
  const [items, setItems] = useState<Announcement[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [error, setError] = useState("");

  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<Audience>("ALL");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  const loadPage = useCallback((p: number) => {
    return api.adminAnnouncements(p, PAGE_SIZE, getToken()).then(res => {
      const rows = extractList(res).map(normalize);
      setItems(prev => {
        const seen = new Set(prev.map(a => a.id));
        return p === 1 ? rows : [...prev, ...rows.filter(a => !a.id || !seen.has(a.id))];
      });
      setPage(p);
      setHasMore(hasMorePages(res, p, rows.length));
      setError("");
    });
  }, []);

  useEffect(() => {
    loadPage(1).catch(e => setError((e as Error).message)).finally(() => setLoading(false));
  }, [loadPage]);

  const retry = () => {
    setLoading(true);
    setError("");
    loadPage(1).catch(e => setError((e as Error).message)).finally(() => setLoading(false));
  };

  const loadOlder = () => {
    stickToBottom.current = false;
    setLoadingOlder(true);
    loadPage(page + 1).catch(e => setError((e as Error).message)).finally(() => setLoadingOlder(false));
  };

  useEffect(() => {
    if (stickToBottom.current) listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [items]);

  const send = async () => {
    const text = message.trim();
    if (!text || sending) return;
    setSending(true);
    setSendError("");
    try {
      const res = await api.adminCreateAnnouncement({ message: text, audience }, getToken());
      const created = normalize(extractItem(res));
      stickToBottom.current = true;
      setItems(xs => [{
        ...created,
        message: created.message || text,
        audience: pickStr(extractItem(res), "audience") || audience,
        createdAt: created.createdAt || new Date().toISOString(),
      }, ...xs]);
      setMessage("");
    } catch (e) {
      setSendError((e as Error).message);
    } finally {
      setSending(false);
    }
  };

  const ordered = [...items].reverse();

  return (
    <>
      <PageHeader title="System Announcement" subtitle="Communicate with users and send announcements" />
      <PageBody>
        <Card style={{ display: "flex", flexDirection: "column", height: "calc(100dvh - 140px)", minHeight: 420 }}>
          <CardHeader
            title="System Announcement"
            subtitle="Sent instantly as a notification to everyone in the chosen audience"
            right={<Button onClick={() => inputRef.current?.focus()}><Icon size={13} width={2.5}>{icons.plus}</Icon>New Announcement</Button>}
          />

          <div ref={listRef} style={{ flex: 1, overflowY: "auto", padding: "8px 18px 16px", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", gap: 14 }}>
            {loading && <p style={{ color: C.faint, fontSize: 13, textAlign: "center", marginTop: 40 }}>Loading…</p>}
            {!loading && error && items.length === 0 && <ErrorState message={error} onRetry={retry} />}
            {!loading && !error && items.length === 0 && (
              <div style={{ margin: "auto", textAlign: "center", color: C.faint }}>
                <Icon size={28}>{icons.megaphone}</Icon>
                <p style={{ fontSize: 13, margin: "8px 0 0" }}>No announcements yet. Write one below to notify users.</p>
              </div>
            )}
            {!loading && hasMore && (
              <div style={{ textAlign: "center" }}>
                <Button variant="ghost" onClick={loadOlder} busy={loadingOlder}>Load older announcements</Button>
              </div>
            )}
            {!loading && error && items.length > 0 && <p style={{ fontSize: 12, color: C.red, textAlign: "center", margin: 0 }}>{error}</p>}
            {!loading && ordered.map((a, i) => (
              <div key={a.id || `new-${i}`} style={{ alignSelf: "flex-end", maxWidth: "70%", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
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
