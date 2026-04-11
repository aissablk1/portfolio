import { htmlToText } from "html-to-text";
import { buildDefaultHeaders } from "./email-headers";

const RESEND_API_URL = "https://api.resend.com/emails";

export const FROM_EMAIL =
  process.env.EMAIL_FROM ?? "Aïssa BELKOUSSA <contact@aissabelkoussa.fr>";
export const CONTACT_EMAIL = "contact@aissabelkoussa.fr";

export interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  /** Auto-generated from html if omitted. */
  text?: string;
  replyTo?: string;
  /** Custom headers merged on top of defaults. */
  headers?: Record<string, string>;
  /** If provided, adds RFC 8058 List-Unsubscribe headers. */
  unsubscribeUrl?: string;
  /** Resend category tag for analytics. */
  tag?: string;
}

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; error: string; status: number };

interface ResendPayload {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
  headers: Record<string, string>;
  tags?: Array<{ name: string; value: string }>;
}

function buildText(html: string): string {
  return htmlToText(html, {
    wordwrap: 80,
    selectors: [
      { selector: "a", options: { baseUrl: "https://www.aissabelkoussa.fr" } },
      { selector: "img", format: "skip" },
    ],
  });
}

async function postResend(
  apiKey: string,
  payload: ResendPayload
): Promise<Response> {
  return fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Centralized Resend sender.
 * - Auto-generates text/plain fallback from HTML (deliverability signal).
 * - Adds RFC 8058 List-Unsubscribe headers when unsubscribeUrl provided.
 * - Adds X-Entity-Ref-ID for traceability.
 * - Retries once on 5xx.
 * - Logs structured errors.
 */
export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY not set");
    return { ok: false, error: "no_api_key", status: 500 };
  }

  const text = payload.text ?? buildText(payload.html);

  const mergedHeaders = {
    ...buildDefaultHeaders({
      unsubscribeUrl: payload.unsubscribeUrl,
      contactEmail: CONTACT_EMAIL,
    }),
    ...(payload.headers ?? {}),
  };

  const resendPayload: ResendPayload = {
    from: FROM_EMAIL,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text,
    headers: mergedHeaders,
  };

  if (payload.replyTo) {
    resendPayload.reply_to = payload.replyTo;
  }
  if (payload.tag) {
    resendPayload.tags = [{ name: "category", value: payload.tag }];
  }

  let res = await postResend(apiKey, resendPayload);

  // Retry once on 5xx
  if (res.status >= 500 && res.status < 600) {
    await new Promise((r) => setTimeout(r, 500));
    res = await postResend(apiKey, resendPayload);
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "<no body>");
    console.error("[email] send failed", {
      status: res.status,
      tag: payload.tag,
      body: body.slice(0, 500),
    });
    return { ok: false, error: `resend_${res.status}`, status: res.status };
  }

  try {
    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id ?? "unknown" };
  } catch {
    return { ok: true, id: "unknown" };
  }
}

/**
 * Throws on failure — for callers that want to propagate errors.
 */
export async function sendEmailOrThrow(payload: EmailPayload): Promise<string> {
  const result = await sendEmail(payload);
  if (!result.ok) {
    throw new Error(`sendEmail failed: ${result.error} (${result.status})`);
  }
  return result.id;
}
