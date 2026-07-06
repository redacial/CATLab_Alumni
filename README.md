# CATLab Network

A LinkedIn-style network connecting **Westmont CATLab** (Center for Applied
Technology) students with alumni — for mentorship, advice, and opportunities.

This is an **MVP** built with Next.js + Tailwind. It runs entirely on the
front end with seeded demo data, so it works immediately with no database or
API keys. The message board persists in the browser via `localStorage`.

## What's inside

- **Home** (`/`) — Announcements from the CATLab Creative Team + a community
  **Message Board** (job postings, events, open questions). Posts persist in
  your browser.
- **Students** (`/students`) — Searchable, filterable cards for current
  students showing major, interests, and what they're _looking for_.
- **Alumni** (`/alumni`) — Same layout for alumni, showing current role,
  company, interests, and what they can be _asked about_.
- **Profile cards** — Click any card to open a detail view with a **Reach out
  by email** button (opens a pre-filled `mailto:`) and a **LinkedIn** link.
- **SakuraCraft** (`/animecraft`) — 🌸 An anime-inspired, Minecraft-style
  voxel world built with Three.js: procedurally generated sakura groves, a
  torii gate at spawn, falling cherry-blossom petals, and full first-person
  block breaking/placing. Best on desktop with mouse + keyboard.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Demo data

All seeded people, announcements, and board posts live in
[`lib/data.ts`](lib/data.ts) — easy to edit or expand.

## Deploy

Push to GitHub and import into [Vercel](https://vercel.com) — no environment
variables required.

## Roadmap (post-MVP)

- Real authentication (open sign-up, e.g. Google OAuth via Supabase)
- Persistent shared database for profiles + message board
- In-app meeting scheduling
- Admin tools for the Creative Team to post announcements
- LinkedIn import to auto-populate profiles
