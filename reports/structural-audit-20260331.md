# Ertiqa Structural Audit Report

**Date:** 2026-03-31
**Agent Skill Activated:** `ertiqaa-audit`

Below is the comprehensive folder-structure and architectural report based on the conditions requested:

## 1. Files Violating App Router Patterns
According to Next.js App Router and Ertiqa best practices, top-level `page.tsx` files should default to Server Components for SEO and performance, pushing client-side logic to granular leaf components.
- 🔴 `src/app/[locale]/(auth)/reset-password/page.tsx` (Unnecessary `'use client'` directive)
- 🔴 `src/app/[locale]/(auth)/forgot-password/page.tsx` (Unnecessary `'use client'` directive)

**Recommendation:** De-couple the form states and `useForm`/`useEffect` hooks into separate `<PasswordForm />` child components to keep the main layouts server-side.

## 2. Components Missing RTL Props
The `ui-rtl-consistency` standard mandates that RTL props be applied to the absolute root element to ensure standard layout rules trickle down through the entire DOM tree.
- 🟡 `src/app/[locale]/layout.tsx`: The `dir={...}` property is currently applied to the `<body>` tag rather than the `<html>` root tag. While functional to a degree, this violates the strict rule: ``dir="rtl" and lang="ar" on <html>``. 

**Recommendation:** Move the `dir={locale === 'ar' ? 'rtl' : 'ltr'}` property up to the `<html>` element in this localized layout.

## 3. Oracle Calls Without Error Handling
- 🟢 **Result:** 0 occurrences. 
- **Notes:** A comprehensive scan across all TypeScript and database files indicates **no Oracle bindings or direct Oracle calls** (`oracledb`) exist in this application. The project strictly utilizes PostgreSQL abstractions (via Prisma/Supabase/pg drivers) with no Oracle-related code to flag for error-handling violations.
