import { NextRequest, NextResponse } from "next/server"
import { getCourtBySlug } from "@/lib/court-data"

export const dynamic = "force-dynamic"

// QR-slug → court-page slug. Lets us mint multiple QR codes that share a
// destination court page (e.g. Lower Woodland upper vs lower).
const SLUG_ALIASES: Record<string, string> = {
  "lower-woodland-upper-courts": "lower-woodland-playfield",
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const target = SLUG_ALIASES[slug] ?? slug
  const base = "https://www.seattleballmachine.com"

  const dest = getCourtBySlug(target)
    ? `${base}/courts/${target}?utm_source=qr&utm_medium=print&utm_campaign=${slug}`
    : `${base}/?utm_source=qr&utm_medium=print&utm_campaign=${slug}`

  return NextResponse.redirect(dest, 302)
}
