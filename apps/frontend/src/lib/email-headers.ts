import crypto from "node:crypto";

export interface DefaultHeadersOpts {
  unsubscribeUrl?: string;
  contactEmail: string;
  entityRefId?: string;
}

/**
 * Builds RFC 8058 compliant headers for marketing emails + traceability.
 * List-Unsubscribe + List-Unsubscribe-Post enable Gmail/iCloud native unsubscribe button.
 */
export function buildDefaultHeaders(opts: DefaultHeadersOpts): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Entity-Ref-ID": opts.entityRefId ?? crypto.randomUUID(),
  };

  if (opts.unsubscribeUrl) {
    headers["List-Unsubscribe"] = `<${opts.unsubscribeUrl}>, <mailto:${opts.contactEmail}?subject=Unsubscribe>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  return headers;
}
