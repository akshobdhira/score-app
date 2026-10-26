# Immpact App — Reverse Engineering Report

As of 2026-10-26 · branch `akshobdhira/score-app` @ `f18960d`

Immpact is a lead-generation funnel for Indian parents. A 40-question career-guidance quiz scores the parent, captures their name and mobile number, and pushes them to book a free 30-minute Calendly consultation. An admin console lists the leads and sends templated follow-up emails. It is a Next.js 16 app on Vercel, backed by Supabase (Postgres) and Resend (email); the scoring runs entirely in the browser.

---

## 1. Architecture

```
                 ┌──────────────────────── Browser ─────────────────────────┐
                 │  Landing → Quiz (40 pages) → Results → Lead form →       │
                 │  Thank-you (+PDF via jsPDF) → Booking form → Calendly    │
                 │  State: sessionStorage (score_answers, score_result,     │
                 │         score_parent_info, score_submission_id, ...)     │
                 │  Admin: /admin/login → /admin dashboard                  │
                 └───────┬────────────────────────────┬────────────────────┘
                         │ fetch /api/*                │ iframe + postMessage
                         ▼                             ▼
   ┌──────────── Vercel (Next.js 16 App Router) ───┐   Calendly
   │ middleware.ts  → NextAuth guard on /admin/*   │   (calendly.com/akshobdhira2005/30min)
   │ /api/submit      POST, PATCH   (public)       │
   │ /api/booking     POST          (public)       │
   │ /api/auth/*      NextAuth credentials (JWT)   │
   │ /api/submissions GET, /delete DELETE (admin)  │
   │ /api/send-email  POST          (admin) ───────┼──► Resend
   │ /api/message-logs GET          (admin)        │
   │ /api/keepalive   GET (Vercel Cron 06:00 UTC)  │
   │ Vercel Analytics                              │
   └────────────────────┬──────────────────────────┘
                        │ service-role key (bypasses RLS)
                        ▼
   Supabase "score-app" (ap-south-1, Postgres 17)
   submissions · bookings · message_logs · rate_limits · admin_audit_log
```

- **Stack:** Next.js `^16.2.2`, React 19.2.3, NextAuth v4, Supabase JS v2, Resend v6, Zod v4, jsPDF v4, Recharts v3, Framer Motion v12, Tailwind v4.
- **Every server call uses the Supabase service-role key** (`src/lib/supabase.ts`). Row-level security therefore never applies to the app itself; the API routes are the only access control.
- **No anon key is used anywhere**, so the browser never talks to Supabase directly.
- **Size:** about 4,500 lines of hand-written TypeScript, 17 commits (2026-03-08 → 2026-10-23).

## 2. User journey

| # | Page | What happens | Server call | Browser storage written |
|---|------|--------------|-------------|-------------------------|
| 1 | `/` | Marketing page with radar-chart teaser and testimonials | none | none |
| 2 | `/assessment/1` … `/40` | One question per page, 3 options scored 1 / 2.5 / 5. Q1 wipes all `score_*` keys | none | `score_answers` |
| 3 | Modal after Q40 | Parent name, Indian mobile (`^[6-9]\d{9}$`), optional email. Scores computed **in the browser** | `POST /api/submit` → returns `submissionId` | `score_parent_info`, `score_result`, `score_submission_id` |
| 4 | `/results` | Recomputes from answers; shows score, profile, 5 category bars, weakest area, share links | none | `score_result` |
| 5 | `/lead-capture` | Child's class (Grade 9–12) and board | `PATCH /api/submit` | `score_child_info` |
| 6 | `/thank-you` | Full report, PDF download (jsPDF, client-side) | none | none |
| 7 | `/booking` | Child name, age, challenges, goals; then Calendly iframe | `POST /api/booking` | none |
| 8 | Calendly | `calendly.event_scheduled` postMessage → back to `/thank-you` | none | none |

Failure handling: if a server call fails, steps 3 and 7 continue anyway; step 5 sends the user back to `/` when it has no `submissionId`.

## 3. Scoring engine

`src/lib/scoring.ts`, `src/lib/questions.ts`, `src/lib/profiles.ts`

- 40 questions, 8 in each of 5 categories: Guidance & Communication, Awareness & Exposure, Engagement & Support Habits, Planning & Financial Readiness, Mindset & Adaptability.
- Each answer scores 1, 2.5 or 5. Raw total runs 40–200.
- Overall percentage = `round((total − 40) / 160 × 100)`, clamped to 0–100. Category percentages use the same formula on 8–40.
- The profile is picked from the overall percentage:

| Percentage | Profile |
|-----------:|---------|
| 0–20 | Outsourced Observer |
| 21–50 | Reactive Rescuer |
| 51–70 | Performance Pusher |
| 71–90 | Concerned Companion |
| 91–95 | Struggling Strategist |
| 96–100 | Impact Maker |

- Because answers are 1 / 2.5 / 5, raw totals move in 0.5 steps. The database column `total_score` is `numeric` live, which handles this.
- Product question: "Struggling Strategist" sits *above* "Concerned Companion" (91–95%), but the name reads as weaker. Check the copy is intended.

## 4. API and data model

### Endpoints

| Route | Method | Who | Guards |
|-------|--------|-----|--------|
| `/api/submit` | POST | public | Same-origin check, rate limit 10 / 5 min / IP, Zod `initialSubmitSchema` |
| `/api/submit` | PATCH | public (needs the UUID) | Same-origin check, Zod `updateChildSchema`; **no rate limit** |
| `/api/booking` | POST | public | Same-origin check, rate limit 10 / 5 min / IP, Zod `bookingSchema`; sets `has_booking` |
| `/api/auth/[...nextauth]` | GET / POST | public | Login POST rate limited 5 / 15 min / IP |
| `/api/submissions` | GET | admin | NextAuth session; returns every submission joined with its bookings |
| `/api/submissions/delete` | DELETE | admin | Session; deletes bookings then submissions; writes `admin_audit_log` |
| `/api/send-email` | POST | admin | Same-origin check + session, Zod; one Resend call per recipient, logs each to `message_logs` |
| `/api/message-logs` | GET | admin | Session |
| `/api/keepalive` | GET | Vercel Cron | `Authorization: Bearer $CRON_SECRET`; pings Supabase daily so the free tier does not pause |

`/admin/*` (except `/admin/login`) is also guarded by `src/middleware.ts`.

### Live database (checked read-only via Supabase on 2026-10-26)

| Table | Purpose | Key columns |
|-------|---------|-------------|
| `submissions` | One row per completed quiz | parent name / mobile / email, child class / board / school (nullable), total_score, percentage, profile, `category_scores` jsonb, `has_booking` |
| `bookings` | Consultation requests | `submission_id` FK, parent and child details, challenges, goals, time slot ("Via Calendly") |
| `message_logs` | Every outreach email attempt | `submission_id` FK, template, meeting link, `status` sent / failed, error |
| `rate_limits` | Fixed-window rate limiter | `key` (e.g. `submit:<ip>`), attempts, window_start |
| `admin_audit_log` | Admin deletions | action, submission_ids[], performed_by |

RLS is enabled on all five tables. The row estimate shown for every table was 0; this may be a statistics gap, not proof the tables are empty.

### Environment variables the code reads

`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `RESEND_API_KEY`, `CRON_SECRET`. All `.env*` files are git-ignored; no secrets are committed.

## 5. Admin dashboard and outreach

- **Login:** one shared username and password from env vars (NextAuth credentials provider), 8-hour JWT session in an httpOnly, `__Secure-` cookie.
- **Dashboard** (`src/app/admin/page.tsx`): loads all submissions and all message logs at once. Filtering by search text, grade, profile, booking status and date range happens in the browser. Rows expand to show booking details and email history.
- **Actions:** multi-select delete (with `confirm()`), CSV export, and send a template email to selected parents.
- **Email templates** (`src/lib/emailTemplates.ts`): "Book Your Free Session", "Follow-Up Nudge", "Your Parenting Score Insights", "Limited Slots — Act Now". Three of them take a meeting link the admin types in.
- Only parents who gave the optional email at step 3 can be emailed; bookings always collect an email.

## 6. Evidence and limits

- **Read in full:** every API route, `src/lib/*`, `src/types`, middleware, layout, `next.config.ts`, `vercel.json`, `package.json`, `supabase-schema.sql`, and the data-flow sections of every page.
- **Checked live (read-only):** Supabase table list, columns and foreign keys; Supabase security advisor. No rows were read and no SQL was run.
- **Knowledge graph:** `graphify-out/` (272 nodes, 21 communities) was used for orientation.
- **Not verified:**
  - live RLS policies (only the SQL file's versions were seen);
  - Resend domain setup and delivery logs;
  - Vercel environment variables;
  - runtime behaviour (the app was not run).
- **Not inspected line by line:** presentational markup in the large page components.
