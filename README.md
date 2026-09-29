# OSA Founder Vault

Canonical registry and ownership system for **OSA Genesis — Lifetime Founder Pass**.

## Production v0.2

Backend of record:
- Supabase project: `osa-founder-vault`
- Region: `eu-central-1`
- Canonical Genesis supply: 50
- #001 RESERVED
- #002–#050 AVAILABLE
- Row Level Security enabled
- one-time transactional claim RPC
- public registry with private ownership
- traffic source tracking
- orders/payment ledger ready for checkout integration

Frontend:
- Next.js 15
- Supabase Auth / OSA ID
- Genesis registry
- claim
- Founder Vault
- Chronicle
- public authenticity pages
- terms/privacy/refund-transfer pages
- marketplace launch pack

## Verify locally

```bash
npm install
npm test
npm run typecheck
npm run build
```

The production Supabase publishable key is safe to expose to the browser by design; authorization is enforced by RLS and the authenticated claim RPC. No service-role key or database password is committed.

## Current blocker

Direct Stripe checkout is intentionally not marked live until the Stripe account is connected and the payment product/webhook is verified end-to-end.

## Marketplace launch pack

See [docs/MARKETPLACE_LAUNCH_PACK.md](docs/MARKETPLACE_LAUNCH_PACK.md).
