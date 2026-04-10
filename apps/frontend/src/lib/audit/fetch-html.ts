/* ────────────────────────────────────────────────
   Fetch HTML avec timeout et headers communs
   ──────────────────────────────────────────────── */

const DEFAULT_TIMEOUT = 8000;
const USER_AGENT = "AissaBelkoussa-Audit/1.0 (+https://www.aissabelkoussa.fr/audit)";

export interface FetchedPage {
  ok: boolean;
  status: number;
  url: string;
  html: string;
  headers: Headers;
}

export async function fetchPage(url: string, timeout = DEFAULT_TIMEOUT): Promise<FetchedPage | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    clearTimeout(timer);

    const html = res.ok ? await res.text() : "";
    return {
      ok: res.ok,
      status: res.status,
      url: res.url,
      html,
      headers: res.headers,
    };
  } catch {
    return null;
  }
}

export async function fetchText(url: string, timeout = DEFAULT_TIMEOUT): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export function normalizeDomain(input: string): string {
  let d = input.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, "");
  d = d.replace(/\/+$/, "");
  d = d.replace(/^www\./, "");
  return d;
}
