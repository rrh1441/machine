// Server-only: enriches static court pages with live data from the
// First Serve Seattle database (shared Supabase project). Every value
// rendered from here is real, per-facility data — court counts, lights,
// hitting walls, busyness — which is what differentiates these pages
// from templated programmatic SEO content.
import { cache } from "react"
import { supabaseAdmin } from "@/lib/supabase/server"

export interface CourtEnrichment {
  courtCount: number
  lights: boolean
  hittingWall: boolean
  pickleballLined: boolean
  /** 0-100 average busy score over the last 7 days, null if no data */
  busyScore7d: number | null
  busyLabel: "usually open" | "moderately busy" | "high demand" | null
  /** Day name with the lowest average busyness over the last 8 weeks */
  quietestDay: string | null
  busiestDay: string | null
  reviews: { rating: number; text: string | null; name: string | null }[]
  avgRating: number | null
  ratingCount: number
}

// Site slug -> prefix of the facility group name in tennis_courts titles.
// Default prefix is the court's display name; these are the exceptions.
const GROUP_PREFIX_OVERRIDES: Record<string, string> = {
  "amy-yee-tennis-center": "AYTC Outdoor",
  "observatory-courts": "Observatory",
  "sam-smith-park": "Sam Smith",
  "rogers-eastlake-playfield": "Rogers Playfield",
}

// Site slug -> facility slug(s) in tennis_facilities / facility_reviews.
// Default is `${siteSlug}-tennis`; these are the exceptions.
const FACILITY_SLUG_OVERRIDES: Record<string, string[]> = {
  "green-lake-park": ["green-lake-park-west-tennis"],
  "amy-yee-tennis-center": ["aytc-outdoor-tennis"],
  "lower-woodland-playfield": [
    "lower-woodland-playfield",
    "lower-woodland-playfield-upper-courts",
  ],
  "volunteer-park": ["volunteer-park-court-01-"],
  "jefferson-park": ["jefferson-park-lid-tennis-court"],
  "observatory-courts": ["observatory-tennis"],
  "sam-smith-park": ["sam-smith-i90-lid-park-tennis"],
  "rogers-eastlake-playfield": ["rogers-playfield-tennis"],
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

function busyLabelFor(score: number): CourtEnrichment["busyLabel"] {
  if (score < 25) return "usually open"
  if (score < 50) return "moderately busy"
  return "high demand"
}

// cache() dedupes the generateMetadata + page render calls within one request
export const getCourtEnrichment = cache(async function getCourtEnrichment(
  siteSlug: string,
  courtName: string,
): Promise<CourtEnrichment | null> {
  if (!supabaseAdmin) return null

  try {
    const prefix = GROUP_PREFIX_OVERRIDES[siteSlug] ?? courtName

    const { data: allCourts, error } = await supabaseAdmin
      .from("tennis_courts")
      .select("id, title, lights, hitting_wall, pickleball_lined")
    if (error || !allCourts) return null

    const facilityCourts = allCourts.filter((c) => c.title?.startsWith(prefix))
    if (facilityCourts.length === 0) return null
    const courtIds = facilityCourts.map((c) => c.id)

    const facilitySlugs =
      FACILITY_SLUG_OVERRIDES[siteSlug] ?? [`${siteSlug}-tennis`]

    const since = new Date()
    since.setDate(since.getDate() - 56)
    const sinceStr = since.toISOString().slice(0, 10)

    const [popularityRes, metricsRes, reviewsRes] = await Promise.all([
      supabaseAdmin
        .from("v_court_popularity_7d")
        .select("court_id, avg_busy_score_7d")
        .in("court_id", courtIds),
      supabaseAdmin
        .from("court_daily_metrics")
        .select("original_court_id, play_date, busy_score, is_closed_today")
        .in("original_court_id", courtIds)
        .gte("play_date", sinceStr),
      supabaseAdmin
        .from("facility_reviews")
        .select("rating, review_text, reviewer_name")
        .in("facility_slug", facilitySlugs)
        .eq("moderation_status", "approved"),
    ])

    // 7-day busyness average across the facility's courts
    let busyScore7d: number | null = null
    const popRows = popularityRes.data ?? []
    if (popRows.length > 0) {
      busyScore7d =
        popRows.reduce((s, r) => s + (r.avg_busy_score_7d ?? 0), 0) /
        popRows.length
    }

    // Quietest / busiest day of week from the last 8 weeks
    let quietestDay: string | null = null
    let busiestDay: string | null = null
    const metricRows = (metricsRes.data ?? []).filter(
      (r) => !r.is_closed_today && r.busy_score != null,
    )
    if (metricRows.length >= 14) {
      const byDay = new Map<number, { sum: number; n: number }>()
      for (const r of metricRows) {
        // play_date is YYYY-MM-DD; parse as UTC to get a stable weekday
        const day = new Date(`${r.play_date}T00:00:00Z`).getUTCDay()
        const agg = byDay.get(day) ?? { sum: 0, n: 0 }
        agg.sum += r.busy_score
        agg.n += 1
        byDay.set(day, agg)
      }
      const avgs = [...byDay.entries()]
        .filter(([, v]) => v.n >= 2)
        .map(([day, v]) => ({ day, avg: v.sum / v.n }))
        .sort((a, b) => a.avg - b.avg)
      if (avgs.length >= 4) {
        quietestDay = DAY_NAMES[avgs[0].day]
        busiestDay = DAY_NAMES[avgs[avgs.length - 1].day]
      }
    }

    const reviews = (reviewsRes.data ?? []).map((r) => ({
      rating: r.rating,
      text: r.review_text,
      name: r.reviewer_name,
    }))
    const rated = reviews.filter((r) => typeof r.rating === "number")
    const avgRating =
      rated.length > 0
        ? rated.reduce((s, r) => s + r.rating, 0) / rated.length
        : null

    return {
      courtCount: facilityCourts.length,
      lights: facilityCourts.some((c) => c.lights),
      hittingWall: facilityCourts.some((c) => c.hitting_wall),
      pickleballLined: facilityCourts.some((c) => c.pickleball_lined),
      busyScore7d,
      busyLabel: busyScore7d != null ? busyLabelFor(busyScore7d) : null,
      quietestDay,
      busiestDay,
      reviews,
      avgRating,
      ratingCount: rated.length,
    }
  } catch (e) {
    console.error("[court-enrichment] failed for", siteSlug, e)
    return null
  }
})
