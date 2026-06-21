# Next.js Migration Plan

This document outlines the step-by-step strategy for migrating the current Vite + React Single Page Application (SPA) to a full-stack Next.js (App Router) application.

## 1. Project Initialization & Dependency Setup

Instead of immediately replacing the root directory, we recommend spinning up the Next.js app in a separate folder (or replacing root contents gracefully).

1. Initialize Next.js with App Router, Tailwind CSS, and TypeScript:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --use-npm
   ```
   *(Note: Run this after moving old Vite source files to a backup directory, or run it in a subdirectory like `new-app` and then move contents up).*
2. Install additional dependencies:
   ```bash
   npm install prisma @prisma/client next-auth bcrypt
   npm install date-fns lucide-react recharts motion zustand
   ```
3. Remove Vite-specific files once successfully ported:
   - `vite.config.ts`
   - `index.html` (Next.js handles HTML via `app/layout.tsx`)

## 2. Structural Mapping (Vite -> Next.js App Router)

| Vite Concept | Next.js (App Router) Equivalent |
| --- | --- |
| `src/main.tsx` | `src/app/layout.tsx` (Root Layout) |
| `src/App.tsx` | `src/app/page.tsx` (Home Page) |
| React Router `<Route>` | Folder-based routing inside `src/app/` (e.g., `src/app/dashboard/page.tsx`) |
| API Calls (fetch to external) | Next.js API Routes (`src/app/api/.../route.ts`) or Server Actions |

## 3. Database & Authentication Integration

1. **Database (Prisma + PostgreSQL)**:
   - Configure connection strings in `.env`.
   - Migrate schema to database: `npx prisma db push` or `npx prisma migrate dev`.
   - Instantiate Prisma Client in a global singleton to avoid connection exhaustion in dev (e.g., `src/lib/prisma.ts`).
2. **Authentication (NextAuth.js)**:
   - Implement `NextAuth` in `src/app/api/auth/[...nextauth]/route.ts`.
   - Setup JWT session handling and credentials provider (comparing hashed passwords via `bcrypt`).
   - Create Middleware (`src/middleware.ts`) to protect routes based on User Role (Admin, Coach, Patient).

## 4. Porting UI Components

- Move UI components from Vite's `src/components/` to Next.js `src/components/`.
- **Client vs Server Components**:
  - By default, Next.js App Router uses Server Components.
  - For components heavily using hooks (`useState`, `useEffect`, `zustand`, `motion`, `recharts`), add `"use client";` at the very top of the file.
- Update image references from Vite's `/public` to Next.js's `/public` using the `<Image>` component from `next/image` where applicable for optimization.

## 5. Porting State and Logic

- **Zustand**: Port `src/stores/` to Next.js. Zustands stores operate strictly on the client, so components using them will need `"use client";`.
- Replace direct API fetching in `useEffect` with React Server Components (fetching data on the server) or Next.js Server Actions where possible to reduce client-side JS bundle size and improve load times.

## 6. Environment Variables

- Rename Vite-specific environment variables (e.g., `VITE_API_URL` to `NEXT_PUBLIC_API_URL` if needed on the client).
- Ensure server-side secrets (like `DATABASE_URL`, `GEMINI_API_KEY`) are kept out of `NEXT_PUBLIC_` prefixes.

## 7. Deployment

- Target Vercel for seamless Next.js deployment.
- Configure environment variables in the Vercel dashboard.
- Set up a managed PostgreSQL database (e.g., Supabase, Neon, or Vercel Postgres) and update the connection string.
- Set up AWS S3 (or similar) bucket for cloud storage, configuring the relevant SDK in Next.js Server Actions/API routes.
