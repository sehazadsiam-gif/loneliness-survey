# Loneliness Survey — Setup Guide

## Stack
- **Next.js 14** (App Router, TypeScript, Tailwind CSS)
- **Supabase** (PostgreSQL database)
- **Vercel** (deployment)
- **GitHub** (version control)

---

## Step 1 — Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create a new project
2. Open **SQL Editor** → paste the contents of `supabase_setup.sql` → Run it
3. Go to **Project Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2 — Local Development (Google IDX)

1. Open project in Google IDX
2. Copy `.env.local.example` to `.env.local`
3. Fill in your Supabase keys and set `ADMIN_PASSWORD`
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open `http://localhost:3000` — survey is live
6. Open `http://localhost:3000/admin` — admin dashboard

---

## Step 3 — GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## Step 4 — Vercel Deployment

1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
3. Click **Deploy**

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Main survey (multi-section) |
| `/admin` | Password-protected admin dashboard |
| `/api/submit` | POST — saves survey response |
| `/api/interview` | POST — saves interview request |
| `/api/admin` | GET — fetches all data (requires password param) |

---

## Scoring Logic

- **Reverse-scored questions**: 1, 5, 6, 9, 10, 15, 16, 19, 20
  - These are positively worded. Normal answer → inverted score
  - Never=4, Rarely=3, Sometimes=2, Always=1
- **Normal questions**: Never=1, Rarely=2, Sometimes=3, Always=4
- **Score range**: 20–80

| Score | Level |
|-------|-------|
| 20–34 | Low Loneliness |
| 35–49 | Moderate Loneliness |
| 50–64 | High Loneliness |
| 65–80 | Very High Loneliness |

Participants scoring **50–80** are invited for a physical research interview.

---

## Admin Dashboard

- URL: `/admin`
- Enter your `ADMIN_PASSWORD` to log in
- See summary stats, all responses, and interview requests
- Export all data as CSV

---

## Important Notes

- `SUPABASE_SERVICE_ROLE_KEY` is **never exposed to the client** — only used in API routes
- Admin password is checked server-side via the `/api/admin` route
- All form validation happens both client-side and server-side
