import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// All QR codes land on the homepage; the {slug} only exists so per-court
// scan volume is distinguishable in analytics via utm_campaign.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const dest = `https://www.seattleballmachine.com/?utm_source=qr&utm_medium=print&utm_campaign=${encodeURIComponent(slug)}`
  return NextResponse.redirect(dest, 302)
}
