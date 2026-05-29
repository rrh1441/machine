import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// All QR codes land on the homepage; the {slug} only exists so per-court
// scan volume is distinguishable in analytics via utm_campaign + the
// ballmachine_qr_scans table.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  // Fire-and-forget scan log. Never block the redirect on DB issues.
  if (supabaseAdmin) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null
    supabaseAdmin
      .from("ballmachine_qr_scans")
      .insert({
        slug,
        user_agent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
        ip,
        country: req.headers.get("x-vercel-ip-country"),
        city: req.headers.get("x-vercel-ip-city"),
      })
      .then(({ error }) => {
        if (error) console.error("[qr] scan log failed", slug, error.message)
      })
  }

  const dest = `https://www.seattleballmachine.com/?utm_source=qr&utm_medium=print&utm_campaign=${encodeURIComponent(slug)}`
  return NextResponse.redirect(dest, 302)
}
