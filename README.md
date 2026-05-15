# Desert Express Logistics Webapp

This repository now contains a real web application for launching a local courier business:

- `Next.js` App Router frontend for the marketing site and quote flow
- `Convex` backend for lead storage, quote generation, scoring, and dashboard queries
- operator dashboard at `/dashboard` for tracking pipeline value and priority leads
- Vercel-ready structure for web deployment

## What the app does

- captures courier, medical, legal, pharmacy, and auto-parts quote requests
- calculates price ranges and projected monthly revenue
- scores each lead by urgency, service mix, and recurring revenue potential
- stores leads in Convex for operational follow-up
- surfaces leads in an internal dashboard

## Stack

- Next.js
- React
- Convex
- Vercel deployment target

## Local setup

This machine currently has `Node 10`, which is too old for this stack. Upgrade to Node 20 or newer first.

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add your Convex URL to `.env.local`:

```bash
NEXT_PUBLIC_CONVEX_URL=...
```

4. Start Convex and generate the client bindings:

```bash
npx convex dev
```

5. Start the web app:

```bash
npm run dev
```

The marketing site runs at `http://localhost:3000` and the operator dashboard is at `/dashboard`.

## Convex model

The main data model is in [convex/schema.ts](</C:/Users/MainUser/Documents/New project/convex/schema.ts>) and the business logic is in [convex/leads.ts](</C:/Users/MainUser/Documents/New project/convex/leads.ts>).

Quote math and lead scoring are shared in [lib/pricing.ts](</C:/Users/MainUser/Documents/New project/lib/pricing.ts>).

## Vercel deployment

Use the official Convex + Vercel flow:

1. Create a Convex project and deploy it.
2. Add `NEXT_PUBLIC_CONVEX_URL` in Vercel project environment variables.
3. Set the Vercel build command to:

```bash
npx convex deploy --cmd 'next build'
```

4. Deploy to Vercel.

## GitHub

There is no Git remote configured in this workspace yet, so this repo can be committed locally now, but pushing to GitHub will require either:

- a remote URL plus Git credentials
- or GitHub CLI installed and authenticated
