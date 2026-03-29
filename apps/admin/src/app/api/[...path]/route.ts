import { NextRequest } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = `${API_URL}${pathname}${search}`;

  const headers: Record<string, string> = {
    "content-type": request.headers.get("content-type") || "application/json",
  };

  // Forward cookies for auth (httpOnly tokens)
  const cookie = request.headers.get("cookie");
  if (cookie) headers.cookie = cookie;

  // Forward client IP for audit logs
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) headers["x-forwarded-for"] = forwarded;

  const body =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : await request.text();

  const upstream = await fetch(url, {
    method: request.method,
    headers,
    body,
  });

  // Forward response with all headers (including Set-Cookie)
  const responseHeaders = new Headers();
  upstream.headers.forEach((value, key) => {
    responseHeaders.append(key, value);
  });

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
