---
trigger: always_on
---

# Ertiqa Platform - Agent Rules & Guidelines

## 1. Project Context
- **Framework:** Next.js 14+ with App Router
- **Styling:** TailwindCSS with RTL support
- **Font:** Cairo (base), with Amiri/Diwani for decorative headers only
- **Database:** PostgreSQL 15+ (via `pg` driver or Prisma)
- **Language:** Arabic (RTL default), English (LTR fallback)
- **Auth Roles:** Admin, Trainer, Student
- **IDE Environment:** Google Antigravity (Agent-First Workflow)

## 2. Code Standards
✅ **TypeScript:** Always use TypeScript with strict mode enabled.
✅ **Components:** Use Server Components by default; add `'use client'` only when interactivity is needed.
✅ **Naming:** 
   - Files: `kebab-case.tsx` (e.g., `user-profile.tsx`)
   - Components: `PascalCase` (e.g., `UserProfile`)
   - Functions: `camelCase`
✅ **RTL:** All Arabic pages must have `dir="rtl"` and `lang="ar"` in the root layout.
✅ **Tailwind:** Mobile-first approach (`md:`, `lg:` prefixes).

## 3. PostgreSQL & Database Guidelines
⚠️ **SECURITY FIRST:**
- NEVER expose raw SQL errors to the client (e.g., `error.detail`).
- ALWAYS use parameterized queries to prevent SQL Injection.
- NEVER commit `.env` files containing `DATABASE_URL` to Git.

🔹 **Connection Management:**
- Use Connection Pooling (`new Pool()`) instead of single connections.
- Close/release clients in `finally` blocks.
- For Serverless (Vercel): Use serverless-compatible pool settings or Prisma Accelerate.

🔹 **Query Syntax:**
- Use `$1, $2, $3` for parameterized queries (PostgreSQL style).
- Example: `SELECT * FROM users WHERE id = $1`
- Avoid `SELECT *` in production; specify columns.

🔹 **Error Handling:**
- Catch specific Postgres error codes (e.g., `23505` for unique violation).
- Return user-friendly Arabic messages instead of technical logs.

🔹 **Schema:**
- Keep schema migrations versioned (using `Drizzle`, `Prisma`, or `node-pg-migrate`).
- All tables must have `created_at` and `updated_at` timestamps.

## 4. UI Preferences (User: Ahmed)
🎨 **Result Boxes:**
- Layout: Centered, max-width based on content.
- Border: Rounded (`rounded-xl`), 2px solid.
- Text: Dark Blue (`text-blue-900`) for success, Dark Red (`text-red-900`) for alerts.
- Display: Limit text to 2 lines (`line-clamp-2`) with ellipsis.

☑️ **Answer Checkboxes:**
- Style: Black/White only (no colored backgrounds).
- States: Yes / Partial / No.
- Alignment: Centered within the form.

📊 **Tables:**
- Headers: Center-aligned (`text-center`), smaller font (`text-sm`).
- Rows: Alternating colors for readability.
- Responsive: Scrollable on mobile (`overflow-x-auto`).

📄 **Reports:**
- Layout: Vertical stacking for fields (Name, Company, Title).
- Spacing: Clear separation between sections (`gap-4`).

## 5. Agent Workflow Rules
🤖 **When Generating Code:**
1. Analyze existing file structure first.
2. Propose changes in a plan before executing.
3. Respect existing import paths (aliases `@/`).
4. Add comments in Arabic for complex logic.

🔒 **Security Policies:**
- Do not modify `.env` files directly.
- Do not run `DROP TABLE` or `TRUNCATE` without explicit confirmation.
- Validate all user inputs on both client and server.