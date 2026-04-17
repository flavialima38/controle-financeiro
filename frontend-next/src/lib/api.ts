/**
 * Client HTTP seguro para comunicação com o backend.
 */
import { API_BASE } from "./constants";

const TIMEOUT_MS = 10_000;

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

/**
 * Faz uma requisição segura com timeout e error handling.
 */
export async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal || controller.signal,
      credentials: "omit",
    });

    if (!res.ok) {
      console.warn(`API ${res.status}: ${endpoint}`);
      return null;
    }

    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.warn(`API timeout: ${endpoint}`);
    } else {
      console.log("API offline, usando dados locais");
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/* ── Helpers específicos ── */

export const financeApi = {
  get: (year: number, month: number) =>
    apiFetch(`/finance/${year}/${month}`),
  save: (year: number, month: number, data: unknown) =>
    apiFetch(`/finance/${year}/${month}`, { method: "PUT", body: data }),
  reset: (year: number, month: number) =>
    apiFetch(`/finance/${year}/${month}/reset`, { method: "POST" }),
};

export const marketApi = {
  get: (year: number, month: number) =>
    apiFetch(`/market/${year}/${month}`),
  save: (year: number, month: number, data: unknown) =>
    apiFetch(`/market/${year}/${month}`, { method: "PUT", body: data }),
  addItem: (year: number, month: number, data: unknown) =>
    apiFetch(`/market/${year}/${month}/item`, { method: "POST", body: data }),
  toggle: (year: number, month: number, itemId: number) =>
    apiFetch(`/market/${year}/${month}/toggle/${itemId}`, { method: "PATCH" }),
  updateBought: (year: number, month: number, itemId: number, comprado: number) =>
    apiFetch(`/market/${year}/${month}/bought/${itemId}`, { method: "PATCH", body: { comprado } }),
  reset: (year: number, month: number) =>
    apiFetch(`/market/${year}/${month}/reset`, { method: "POST" }),
};

export const purchaseApi = {
  get: (year: number, month: number) =>
    apiFetch(`/purchases/${year}/${month}`),
  add: (year: number, month: number, data: unknown) =>
    apiFetch(`/purchases/${year}/${month}`, { method: "POST", body: data }),
  remove: (year: number, month: number, index: number) =>
    apiFetch(`/purchases/${year}/${month}/${index}`, { method: "DELETE" }),
};

