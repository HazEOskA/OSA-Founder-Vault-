# OSA Founder Vault

Canonical registry and ownership system for **OSA Genesis — Lifetime Founder Pass**.

## Slice 1 status

Implemented:

- Genesis supply model: #001–#050
- #001 creator reservation
- PostgreSQL + Drizzle schema
- OSA ID registration/login with scrypt password hashing
- hashed server-side sessions
- one-time claim tokens
- transactional claim with row lock
- ownership + Founder entitlements
- public authenticity API/page
- Founder Vault
- Chronicle / audit events
- acquisition tracking schema
- cyber-dark landing
- CI: tests + typecheck + build

Not included yet:

- payment provider
- marketplace APIs
- shipping provider
- production deployment
- production email
- transfer/resale workflow

## Local run

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run seed:genesis
npm run dev
```

Open: http://localhost:3000

## Issue a one-time claim code

```bash
npm run issue:claim -- OSA-GEN-0007
```

The raw claim code is printed once. Only its SHA-256 hash is stored.

## Verify

```bash
npm test
npm run typecheck
npm run build
```

## Security notes

This repo contains no production secrets. Production deployment must add HTTPS, secret management, rate limiting/WAF, email verification, password-reset flow, CSP/security headers, database backups and operational monitoring before public sales.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Sales plan

See [docs/SALES_PLAN.md](docs/SALES_PLAN.md).
