const BASE = "https://owa-api.vercel.app";
const TIMEOUT_MS = 20000;

type Token = string | null | undefined;
type Body = Record<string, unknown>;

async function fetchWithTimeout(url: string, options: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    throw err instanceof Error && err.name === "AbortError"
      ? new Error("Request timed out. Please try again.")
      : err;
  } finally {
    clearTimeout(id);
  }
}

async function post(path: string, body: Body, token?: Token) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithTimeout(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

async function postForm(path: string, formData: FormData, token?: Token) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithTimeout(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

async function patch(path: string, body: Body, token?: Token) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithTimeout(`${BASE}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

async function del(path: string, token?: Token) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithTimeout(`${BASE}${path}`, { method: "DELETE", headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

async function get(path: string, token?: Token) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetchWithTimeout(`${BASE}${path}`, { method: "GET", headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Something went wrong");
  return data;
}

export const api = {
  registerStudent: (body: Body) => post("/auth/register/student", body),
  registerDriver: (body: Body) => post("/auth/register/driver", body),
  verify: (body: Body) => post("/auth/verify/email", body),
  resendOtp: (body: Body) => post("/auth/verify/resend", body),
  login: (body: Body) => post("/auth/login", body),
  recoverPassword: (body: Body) => post("/auth/password/recover", body),
  resetPassword: (body: Body) => post("/auth/password/reset", body),
  driverOnboard: (fd: FormData, token?: Token) => postForm("/drivers/onboard", fd, token),
  driverDetails: (fd: FormData, token?: Token) => postForm("/drivers/details", fd, token),
  driverBank: (body: Body, token?: Token) => post("/drivers/bank", body, token),
  driverLookup: (tag: string, token?: Token) => get(`/drivers/lookup/${encodeURIComponent(tag)}`, token),
  userProfile: (token?: Token) => get("/users/profile", token),
  driverProfile: (token?: Token) => get("/drivers/profile", token),
  walletDetails: (token?: Token) => get("/wallet/me", token),
  walletBalance: (token?: Token) => get("/wallet/balance", token),
  resolveAccount: (accountNumber: string, bankCode: string, token?: Token) =>
    get(`/wallet/resolve-account?accountNumber=${encodeURIComponent(accountNumber)}&bankCode=${encodeURIComponent(bankCode)}`, token),
  walletTopup: (body: Body, token?: Token) => post("/wallet/topup", body, token),
  authorizeCardOtp: (body: Body, token?: Token) => post("/wallet/authorize-card-otp", body, token),
  setWalletPin: (body: Body, token?: Token) => post("/wallet/set-pin", body, token),
  walletTransfer: (body: Body, token?: Token) => post("/wallet/transfer", body, token),
  walletWithdraw: (body: Body, token?: Token) => post("/wallet/withdraw", body, token),
  walletTransactions: (token?: Token) => get("/wallet/transactions", token),
  // Admin — driver approvals
  adminDrivers: (token?: Token) => get("/admin/drivers", token),
  adminApproveDriver: (id: string, token?: Token) =>
    patch(`/admin/drivers/${encodeURIComponent(id)}/approve`, {}, token),
  adminRejectDriver: (id: string, reason: string, token?: Token) =>
    patch(`/admin/drivers/${encodeURIComponent(id)}/reject`, { reason }, token),
  // Admin — vehicles / tags
  adminVehicles: (token?: Token) => get("/admin/vehicles", token),
  adminAddVehicle: (fd: FormData, token?: Token) => postForm("/admin/vehicles", fd, token),
  // Admin — passengers
  adminPassengers: (token?: Token) => get("/admin/passengers", token),
  // Admin — transactions
  adminTransactions: (token?: Token) => get("/admin/transactions", token),
  adminTransaction: (id: string, token?: Token) => get(`/admin/transactions/${encodeURIComponent(id)}`, token),
  // Admin — payouts / withdrawals
  adminPayouts: (token?: Token) => get("/admin/payouts", token),
  adminPayout: (id: string, token?: Token) => get(`/admin/payouts/${encodeURIComponent(id)}`, token),
  adminApprovePayout: (id: string, token?: Token) =>
    patch(`/admin/payouts/${encodeURIComponent(id)}/approve`, {}, token),
  adminRejectPayout: (id: string, reason: string, token?: Token) =>
    patch(`/admin/payouts/${encodeURIComponent(id)}/reject`, { reason }, token),
  adminRetryPayout: (id: string, token?: Token) =>
    patch(`/admin/payouts/${encodeURIComponent(id)}/retry`, {}, token),
  // Admin — reports & issues
  adminReports: (token?: Token) => get("/admin/reports", token),
  adminResolveReport: (id: string, adminNote: string, token?: Token) =>
    post(`/admin/reports/${encodeURIComponent(id)}/resolve`, adminNote ? { adminNote } : {}, token),
  /** Soft-delete: hides the report from admin lists but keeps the record. */
  adminDeleteReport: (id: string, token?: Token) => del(`/admin/reports/${encodeURIComponent(id)}`, token),
  // Admin — announcements (audience: "ALL" | "STUDENT" | "DRIVER"; history is newest first)
  adminAnnouncements: (page: number, limit: number, token?: Token) =>
    get(`/admin/announcements?page=${page}&limit=${limit}`, token),
  adminCreateAnnouncement: (body: Body, token?: Token) => post("/admin/announcements", body, token),
};

export const formatPhone = (local: string) => "+234" + local.replace(/\D/g, "").replace(/^0/, "");

const hasWindow = () => typeof window !== "undefined";

export const saveToken = (t: string) => { if (hasWindow()) localStorage.setItem("owa_token", t); };
export const getToken = () => (hasWindow() ? localStorage.getItem("owa_token") : null);
export const saveName = (name: string) => { if (hasWindow()) localStorage.setItem("owa_name", name); };
export const getSavedName = () => (hasWindow() ? localStorage.getItem("owa_name") ?? "" : "");
export const logout = () => {
  if (!hasWindow()) return;
  localStorage.removeItem("owa_token");
  localStorage.removeItem("owa_name");
};

export const getRoleFromToken = (token: string): string | null => {
  try {
    return JSON.parse(atob(token.split(".")[1])).role ?? null;
  } catch {
    return null;
  }
};

export const isAdminRole = (role: string | null) => !!role && /admin/i.test(role);
