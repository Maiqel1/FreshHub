# Reusable prompt: migrating a Next.js app to Firebase

Paste everything below the line into a fresh session on the target project.

---

I want to migrate this project to Firebase (Firestore + Firebase Auth + Cloud Storage).
Do **not** start writing code yet.

## Phase 1 — Investigate, then advise

Read the codebase properly first and report back before changing anything:

1. What is the current backend, and exactly what does it provide (auth, database, file storage, realtime, cron, email)? List anything Firebase does **not** have a direct equivalent for.
2. How does auth currently work — cookie sessions, JWT, server-side or client-side? This is the part that always costs the most in a Firebase migration, so be specific.
3. What is the Next.js version, and does a `middleware.ts` / `proxy.ts` exist? What does it do?
4. Where is data read and written — server components, route handlers, server actions, client SDK? Which of those run per-request?
5. What relational features are in use that Firestore lacks: joins, unique constraints, transactions across tables, `ORDER BY` on multiple fields, full-text search, foreign keys, triggers?
6. How much data exists, and does anything need migrating (users, files, rows)?

Then give me **an honest recommendation**, including whether I should migrate at all:

- What will genuinely break or need redesigning, not just "port the queries".
- **Cloud Storage requires the Blaze plan** (billing account) — Firestore and Auth are free on Spark, storage is not. If the app stores files, tell me that up front.
- Cost estimate at my actual scale, and what could make it exceed the free allowance.
- If the current backend's problem is fixable more cheaply than a migration, say so plainly.

Ask me clarifying questions before designing anything.

## Phase 2 — Known landmines (do not rediscover these the hard way)

These cost hours on a previous migration. Treat them as requirements.

### Middleware / proxy — the expensive one

- **The proxy must import nothing but `next/server`.** Importing `firebase-admin`, `next/headers`, or `server-only` — even transitively, via a shared session module — fails at **module load**, which 500s **every route**, including static pages.
- A `try/catch` inside the proxy function **cannot** catch an import-time failure. If a deployed `try/catch` still 500s, the failure is at import. Recognise that immediately.
- The proxy should do a **cookie-presence check only**. Real verification belongs in server components and server actions, which must each call the equivalent of `requireUser()`.
- Verify with an import-graph trace before deploying, not after.

### Auth

- The endpoints that *create* a session (`/api/session`, `/api/login`, `/api/signup`) must be **exempt from the route guard**, or sign-in is impossible: the request that mints the cookie gets redirected to the login page, which returns **200**, so the client sees a false success and hangs on a spinner.
- Client fetches that mint a session must verify the response is really JSON. A guard redirect returns 200 HTML and passes a naive `response.ok` check.
- Firebase **cannot verify a password server-side** via the Admin SDK. Use the Identity Toolkit REST endpoint server-side, return a **custom token**, and let the browser call `signInWithCustomToken` — that keeps the email off the client *and* leaves the client SDK authenticated, which direct-to-Storage uploads require.
- Firebase **session cookies expire after 14 days, maximum**. Only a fresh ID token can mint a new one, and only the client has that. Add a component using `onIdTokenChanged` to re-post the token.
- **Password hashes cannot be migrated.** Email/password users need a reset; OAuth users are unaffected. Tell me before cutover.

### Firestore

- No unique constraints. Uniqueness (usernames, slugs) needs a **lock collection** written in a transaction — the transaction failing *is* the constraint.
- No joins. Denormalise deliberately and say what that costs.
- Composite indexes are required for `where` + `orderBy`; generate `firestore.indexes.json`.
- Database triggers become Cloud Functions — **which also need Blaze**, and leave Artifact Registry artifacts that accrue charges. Prefer doing that work in app code.

### Security rules

- **Never write `allow read: if resource.data.isPublic`** or similar. That lets anyone enumerate every public document. Read shared/public records **server-side via the Admin SDK by unguessable id**, which bypasses rules.
- Include a catch-all `match /{document=**} { allow read, write: if false; }`.
- Verify with the rules simulator: an unauthenticated read of a "public" doc must be **denied**.

### Server actions

- Server actions are **callable from the client**. A read helper taking a `userId` parameter inside a `"use server"` file lets anyone read anyone's data. Put read helpers in a plain module with `import "server-only"`.

### Config

- Set `serverExternalPackages: ["firebase-admin"]` in `next.config.ts`.
- `NEXT_PUBLIC_*` values are **inlined at build time** — adding them to the host does nothing until a rebuild.

## Phase 3 — Deployment protocol

Follow this instead of pushing to production and iterating on 500s.

1. **Set every environment variable on the host before the first deploy.** List them for me explicitly, server-only vs public.
2. **Deploy to a preview/branch URL first.** Never migrate straight onto the production domain.
3. **After deploying, if anything 500s, get the runtime log immediately.** Do not infer causes from status codes across multiple deploys — ask me for the host's runtime log and read the stack trace. One log ends it; guessing costs hours.
4. Give me a **status-code triage table** up front so I can gather useful evidence myself, e.g.:
   - static asset 200 but every page 500 → the proxy/middleware is failing
   - one dynamic route 500s while static routes are fine → that route's import chain
   - everything 500s including static → import-time failure, not config
5. Make the proxy **fail open** — log and continue — so a config problem never takes down pages that need no backend.
6. Verify after deploy with actual requests to: a static page, a public dynamic page, a protected route (expect a redirect), and an auth endpoint.

## Phase 4 — Verification gates

Before calling it done:

- Rules simulator: cross-user read denied; unauthenticated read of a "public" doc denied.
- Unauthenticated fetch of another user's storage path returns 403.
- Sign in with each provider; confirm one account per email.
- Quit the browser entirely and reopen — still signed in.
- Migrate to a **scratch project first**, then diff record counts, ids, and file sizes before touching real data.
- `npm run build`, typecheck, and lint all clean — and confirm the proxy's import graph is still clean.
