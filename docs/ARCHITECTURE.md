# OSA Founder Vault — Architecture Lock v1

## Goal

Make a Genesis Founder Pass a first-class business entity: numbered, scarce, claimable once, privately owned, publicly verifiable and backed by an append-only audit trail.

## Core invariants

1. Genesis supply is exactly 50 serial slots.
2. #001 is reserved for the creator.
3. A pass can have at most one ownership record.
4. Claim tokens are stored only as SHA-256 hashes.
5. Claim tokens are single-use and expire.
6. Claiming runs inside a database transaction and locks the pass row.
7. Public verification never exposes email, session data, claim codes or owner IDs.
8. Lifetime Founder entitlement is separate from variable third-party compute/API costs.
9. Marketplace channels are acquisition sources, never the source of truth.
10. OSA registry is the canonical ownership and authenticity system.

## Runtime flow

Marketplace / direct traffic
→ Landing
→ OSA ID
→ Order/payment adapter (next slice)
→ Serial assigned
→ Claim token issued once
→ Claim
→ Ownership + entitlements + audit event
→ Founder Vault
→ Public proof page

## Data

users
sessions
passes
claim_tokens
ownerships
entitlements
audit_events
traffic_events

## Cloud boundary

The application depends on HTTP + PostgreSQL. Payment, email, object storage and marketplace integrations stay behind future adapters so deployment can move between Azure, Vercel, GCP or another container/runtime without changing domain rules.
