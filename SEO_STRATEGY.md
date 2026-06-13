# SEO & AI-SEO Strategy — Seattle Ball Machine

_Last updated: 2026-06-13_

This is the real strategy, grounded in our own data. The previous "summary" was a
checklist of generic tactics. This one ties the work to the First Serve Seattle
court database we already own and to automated submission so it runs without
hand-holding.

---

## The core insight

We compete in two arenas now:

1. **Classic search** (Google/Bing) — for "tennis ball machine rental seattle" and
   long-tail "[court] tennis" queries.
2. **Answer engines** (ChatGPT, Perplexity, Claude, Google AI Overviews) — which
   _summarize_ rather than link, and cite pages that state specific, verifiable
   facts in clean prose.

Both reward the same thing: **unique, factual, structured content**. Our unfair
advantage is the First Serve Seattle database — live court counts, lights, hitting
walls, pickleball lining, and 8 weeks of busyness data per court. No competitor
renting a ball machine has that. We were sitting on it and rendering boilerplate.

---

## What changed in this pass (shipped)

### 1. Court pages are now data-driven, not templated
`lib/court-enrichment.ts` pulls live facts from the shared Supabase project at
build time (refreshed daily via ISR, `revalidate = 86400`). Each `/courts/[slug]`
page now renders:
- **Verified amenities** — real court count, lights, hitting wall, pickleball
  lining from `tennis_courts`.
- **"How Busy Is X?"** — 7-day busy score + quietest/busiest day of week, computed
  from `court_daily_metrics` (44k+ rows), attributed to First Serve Seattle.
- **"What Players Say"** — real approved reviews from `facility_reviews`, rendered
  _only where they exist_.
- **`AggregateRating` schema** — emitted _only_ when backed by real review rows.
  No fabricated ratings, ever.
- **Meta descriptions** that lead with a hard fact ("2 courts.") instead of fluff.

Why it matters: this is exactly the content answer engines cite ("how busy is
Green Lake tennis on weekends") and the unique signal Google needs to stop
flagging the programmatic pages as thin / "Crawled - currently not indexed."

### 2. Automated multi-engine submission
`app/api/seo/submit/route.ts` + weekly Vercel cron (`vercel.json`, Mondays 08:00):
- **IndexNow** (Bing, Yandex, Seznam, Naver) — fires every run, no credentials.
  Confirmed working: pushes all 55 URLs, API returns 202. **Bing powers ChatGPT
  Search**, so this is our direct AI-SEO pipe.
- **Google Indexing API** — built and dormant; activates automatically the moment
  `GOOGLE_INDEXING_SA_KEY` is set (see setup below). Mints its own OAuth token via
  Web Crypto, no extra dependencies.
- URL set comes from `lib/site-urls.ts`, the single source of truth shared with
  the sitemap, so they can never drift.

### 3. Technical SEO fixes (prior pass, also shipped)
- Per-page canonicals (`/book` no longer canonicalizes to the homepage).
- `noindex` on utility pages (`/guide`, `/book/cancel`, `/book/reschedule`).
- `/booking` and `/rentalbooking` → 308 permanent redirects to `/book`.
- `/q/*` QR redirects: `X-Robots-Tag: noindex`, disallowed in robots.txt.
- `robots.txt` explicitly welcomes AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  OAI-SearchBot, Google-Extended, etc.).
- `/llms.txt` — structured business summary for answer engines.
- Honest `lastmod` in sitemap (fixed dates, not per-build `new Date()`).
- Removed invalid `telephone` value and fake `SearchAction` from schema.

---

## What is automated vs. what needs a one-time human action

| Task | Status |
|------|--------|
| Submit URLs to Bing/Yandex/etc. (→ ChatGPT) | ✅ Automated, weekly cron |
| Keep sitemap in sync with real pages | ✅ Automated, shared source |
| Refresh court busyness/reviews on pages | ✅ Automated, daily ISR |
| Submit URLs to Google Indexing API | ⚙️ Automated once you add the SA key (below) |
| Verify domain ownership in GSC / Bing | ❌ One-time manual — Google/Bing require it, can't be coded |
| Google Business Profile | ❌ One-time manual — biggest local lever |

The verification steps are manual by design: search engines will not let a site
self-certify ownership. Everything _downstream_ of verification is automated.

---

## One-time setup (do these once, ~45 min total)

### A. Google Search Console — submit the sitemap (5 min, highest priority)
You only do this **once**. After that Google re-reads the sitemap on its own
forever.
1. https://search.google.com/search-console → your property.
2. Sitemaps → enter `sitemap.xml` → Submit.
3. URL Inspection → paste `https://www.seattleballmachine.com/` → Request Indexing.
   Repeat for `/book`, `/courts`, `/tennis-ball-machine-rental`. (Manual requests
   are rate-limited to a handful/day — do the money pages, let the cron + sitemap
   handle the rest.)

### B. Bing Webmaster Tools (5 min — feeds ChatGPT)
1. https://www.bing.com/webmasters → "Import from Google Search Console" (one
   click, reuses your GSC verification).
2. Submit `sitemap.xml`. IndexNow is already wired, so fresh URLs push
   automatically from here on.

### C. Google Business Profile (20 min — biggest local-pack lever)
1. https://business.google.com → create profile.
2. Category: **Sporting goods rental** (or "Equipment rental agency").
3. Set as **service-area business** (Seattle) if you don't want the home address
   public.
4. Add photos of the Hydrogen Proton machine, link the site, set hours.
5. Add the review-request link to the post-booking email (we already have email
   infra in `app/api/cron/send-reminders`).

### D. Google Indexing API key (15 min — flips on the dormant Google automation)
1. Google Cloud Console → new project → enable **Indexing API**.
2. Create a **service account**, create a **JSON key**, download it.
3. In GSC → Settings → Users and permissions → add the service account's
   `client_email` as an **Owner**.
4. In Vercel → Project → Settings → Environment Variables, add
   `GOOGLE_INDEXING_SA_KEY` = the full JSON (single line). Redeploy.
5. Done — the Monday cron now pushes to Google too. Verify with:
   `curl -H "Authorization: Bearer $CRON_SECRET" https://www.seattleballmachine.com/api/seo/submit`

---

## Next content bets (ranked by leverage)

1. **"Best tennis courts in Seattle" editorial page** — rank the courts using our
   busyness + amenity data ("quietest courts," "best lit courts for evening
   play"). This is our single most citable asset for answer engines, built
   entirely from data we own.
2. **Seed reviews** — `facility_reviews` has only 4 rows. A one-line prompt in the
   post-session email ("rate the court you played at") fills the "What Players Say"
   sections and `AggregateRating` across all 38 pages. Compounding.
3. **"Ball machine drills" / "Hydrogen Proton settings guide"** — first-hand,
   evergreen, links to booking. Answer engines reward genuine experience.
4. **"Rent vs. buy a ball machine"** — bottom-funnel comparison ($300/10-pack vs.
   $1,200+ to own).
5. **Reddit / r/Seattle / local tennis groups** — answer engines lean on community
   consensus for local recs. One honest "I run this" reply in a "where to practice
   serves alone in Seattle" thread is worth more than any directory.

## Measurement (15 min/week)
- GSC indexed count climbing toward 55.
- GA4 referrers: `chatgpt.com`, `perplexity.ai`, `claude.ai`, `bing.com`.
- Monthly: ask ChatGPT/Perplexity/Claude "where can I rent a tennis ball machine
  in Seattle?" — check if we're named and described correctly. That's the AI-SEO
  scoreboard.
