import type { ApiError, ApiMessage, ApiSuccess } from "./types";

const TOKEN_KEY = "auth.token";
const USER_KEY = "auth.user";
const API_BASE =
  (import.meta.env.VITE_API_BASE as string | undefined) ??
  "https://northstar-backend-five.vercel.app/api";

class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  const data = (await res.json().catch(() => null)) as
    | ApiSuccess<T>
    | ApiMessage
    | ApiError
    | null;

  if (res.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event("auth:expired"));
  }

  if (!res.ok || !data?.success) {
    const message = data && "error" in data ? data.error : `HTTP ${res.status}`;
    throw new HttpError(message, res.status);
  }

  return (data as ApiSuccess<T>).data;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>("GET", path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, body);
}

export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return request<T>("PATCH", path, body);
}

export function apiMessage(
  path: string,
  method: "DELETE" | "POST" = "DELETE"
): Promise<ApiMessage> {
  return request<ApiMessage>(method, path);
}

export { HttpError, TOKEN_KEY, USER_KEY };
