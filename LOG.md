# Log

## Intended Actions
- Inventory project structure and configs
- Identify critical issues preventing a clean run
- Apply minimal, production-safe fixes
- Provide scripts for local assets and environment setup
- Validate with typecheck/lint/dev server

## Assumptions
- You want a local-first, production-ready dev experience
- Supabase project and Edge Functions are (or will be) deployed
- Stripe keys exist in the Supabase project env

## Key Details
- Stack: Vite + React + TS + Tailwind, Supabase (DB + Functions), Stripe
- Required env: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Client calls Edge Function: `/functions/v1/create-checkout`

## Findings (Potential Issues)
- ProductModal prop mismatch (`isOpen` unused) could prevent modal rendering
- Missing local asset: `/public/images/crafting-workspace.jpg` (About section)
- Env vars required at runtime; app throws if missing
- Very permissive RLS policies for `cart_items` (OK for demo, not prod)
- Two Stripe function sets present; UI uses `create-checkout`. Others OK but unused in UI
- Shell script `download_images.sh` targets a temp path; added Windows script instead
- No README/env template provided for quick start

## Critical to Fix Now
- ProductModal rendering
- Local image availability for About section
- Env setup template

## Debug Logs Plan (targeted)
- Checkout flow: log request/response status + timing (pending approval)
- Supabase initialization: guard already throws on missing env (OK)

## Actions Taken
- Fixed `ProductModal` API (removed unused `isOpen`, guard on `product` only)
- Added `.env.example` with required variables
- Added `scripts/download-images.ps1` to fetch About image locally

## Next Steps
- Install deps, run typecheck/lint, start dev server
- Verify env values are set in `.env`
- (Optional) Harden RLS for `cart_items` and add more robust auth/session strategy

## Errors Observed
- Access to `.env` blocked by .gitignore in this environment (expected)
- Missing local image would cause a 404 in About section
