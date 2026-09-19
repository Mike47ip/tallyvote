# TallyVote Admin 🗳️

The admin dashboard for managing elections, viewing live results, and generating QR codes.

**Paired with:** `tallyvote-voter` — both apps share one Supabase project.

## Stack
- **Next.js 14** (App Router) · **Tailwind CSS** · **Outfit font**
- **Supabase** (Postgres + Realtime) · **Recharts** · **Vercel**

## Getting Started

```bash
yarn install
cp .env.local.example .env.local   # add your Supabase keys + voter app URL
yarn dev                            # runs on http://localhost:3000
```

## Env vars

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only |
| `NEXT_PUBLIC_VOTER_APP_URL` | URL of the voter app (e.g. `https://vote.tallyvote.app`) |

## Deploy to Vercel

1. Push to GitHub → import on vercel.com
2. Add env vars → Deploy
3. Set custom domain: `admin.tallyvote.app`

## How the apps communicate

Both apps talk to the **same Supabase project**. When a voter casts a vote on `tallyvote-voter`, Supabase Realtime pushes the update and the admin dashboard's charts update live via `useRealtimeVotes`.
