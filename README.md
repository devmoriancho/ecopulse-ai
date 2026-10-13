# EcoPulse AI 🌱

Autonomous Climate & Energy Intelligence Engine.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Neon Serverless PostgreSQL (via Prisma 7)

## Features Implemented

- [x] Initialized App Router architecture and cleared out default template boilerplates
- [x] Configured custom global theme palette (Charcoal backgrounds and Emerald accents) in `globals.css`
- [x] Developed mobile-first responsive dashboard grid canvas layout with visual workspace slots
- [x] Manually authored relational data models for Tracking Requests, Real-Time Activity Logs, and Climate Reports
- [x] Configured environment variable secret keys and fixed the Prisma 7 generated client output paths
- [x] Successfully executed cloud database synchronization migrations onto Neon PostgreSQL hosting layers
- [x] Built type-safe database accessor layer (`db.ts`) with custom query fetch functions
- [x] Formed the secure Next.js Server Action form bridge (`agent.ts`) to intercept user prompt submissions
- [x] Configured official Vercel AI SDK runtime environment core files (`engine.ts`)
- [x] Integrated Zod schema validation library into production dependency configurations
- [x] Secured free developer API sandbox credentials via Google AI Studio
- [x] Implemented a backend multi-step defensive error boundary (`try/catch`) to capture pipeline faults
- [x] Connected real-time system failure event logging into Neon PostgreSQL cloud tables
