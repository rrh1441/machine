import { NextRequest, NextResponse } from "next/server"
import { BASE_URL, getIndexableUrls } from "@/lib/site-urls"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const INDEXNOW_KEY = "3e3cb04f40d13d3ceb78b23cc1cb1e6d"

// Submits the site's indexable URLs to search engines on a schedule.
//
// IndexNow (Bing, Yandex, Seznam, Naver): always runs, no credentials needed.
//   Bing's index powers ChatGPT Search, so this is also the AI-SEO push.
// Google Indexing API: only runs if GOOGLE_INDEXING_SA_KEY is configured.
//
// Triggered by Vercel cron (see vercel.json) with the CRON_SECRET bearer token,
// or manually with the same header.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const urls = getIndexableUrls()
  const results: Record<string, unknown> = { submitted: urls.length }

  results.indexNow = await submitIndexNow(urls)
  results.google = await submitGoogle(urls)

  return NextResponse.json(results)
}

async function submitIndexNow(urls: string[]) {
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.seattleballmachine.com",
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    })
    // IndexNow returns 200 or 202 on success; body is usually empty.
    return { ok: res.ok, status: res.status }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

// Google Indexing API. Requires a Google Cloud service account (JSON key)
// added as Owner of the Search Console property, with its private key stored
// in the GOOGLE_INDEXING_SA_KEY env var (the full JSON, single line).
async function submitGoogle(urls: string[]) {
  const raw = process.env.GOOGLE_INDEXING_SA_KEY
  if (!raw) return { skipped: "GOOGLE_INDEXING_SA_KEY not configured" }

  let sa: { client_email: string; private_key: string }
  try {
    sa = JSON.parse(raw)
  } catch {
    return { ok: false, error: "GOOGLE_INDEXING_SA_KEY is not valid JSON" }
  }

  try {
    const token = await getGoogleAccessToken(sa)
    if (!token) return { ok: false, error: "could not obtain access token" }

    // The Indexing API takes one URL per call; run them with light concurrency.
    let ok = 0
    let failed = 0
    for (const url of urls) {
      const res = await fetch(
        "https://indexing.googleapis.com/v3/urlNotifications:publish",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ url, type: "URL_UPDATED" }),
        },
      )
      if (res.ok) ok++
      else failed++
    }
    return { ok: failed === 0, updated: ok, failed }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

// Mints a Google OAuth2 access token from the service account using a signed
// JWT (Web Crypto, so it runs on the Edge/Node runtime without extra deps).
async function getGoogleAccessToken(sa: {
  client_email: string
  private_key: string
}): Promise<string | null> {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: "RS256", typ: "JWT" }
  const claim = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  }

  const enc = (obj: unknown) =>
    base64url(new TextEncoder().encode(JSON.stringify(obj)))
  const signingInput = `${enc(header)}.${enc(claim)}`

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  )
  const jwt = `${signingInput}.${base64url(new Uint8Array(sig))}`

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })
  if (!res.ok) return null
  const json = (await res.json()) as { access_token?: string }
  return json.access_token ?? null
}

function base64url(bytes: Uint8Array): string {
  let bin = ""
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "")
  const bin = atob(body)
  const buf = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i)
  return buf.buffer
}
