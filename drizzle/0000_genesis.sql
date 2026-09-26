CREATE TYPE "pass_status" AS ENUM (
  'CREATED','RESERVED','AVAILABLE','SOLD','SHIPPED','CLAIMABLE',
  'CLAIMED','ACTIVE','SUSPENDED','REVOKED'
);

CREATE TABLE "users" (
  "id" text PRIMARY KEY,
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "display_name" text,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "users_email_uq" ON "users" ("email");

CREATE TABLE "sessions" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "sessions_token_hash_uq" ON "sessions" ("token_hash");
CREATE INDEX "sessions_user_idx" ON "sessions" ("user_id");

CREATE TABLE "passes" (
  "id" text PRIMARY KEY,
  "edition" text NOT NULL,
  "serial" text NOT NULL,
  "sequence_number" integer NOT NULL,
  "status" "pass_status" NOT NULL DEFAULT 'CREATED',
  "issued_at" timestamptz NOT NULL DEFAULT now(),
  "claimed_at" timestamptz,
  "owner_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "passes_serial_uq" ON "passes" ("serial");
CREATE UNIQUE INDEX "passes_sequence_uq" ON "passes" ("edition","sequence_number");
CREATE INDEX "passes_owner_idx" ON "passes" ("owner_id");

CREATE TABLE "claim_tokens" (
  "id" text PRIMARY KEY,
  "pass_id" text NOT NULL REFERENCES "passes"("id") ON DELETE CASCADE,
  "token_hash" text NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "consumed_at" timestamptz,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "claim_tokens_hash_uq" ON "claim_tokens" ("token_hash");
CREATE INDEX "claim_tokens_pass_idx" ON "claim_tokens" ("pass_id");

CREATE TABLE "ownerships" (
  "id" text PRIMARY KEY,
  "pass_id" text NOT NULL REFERENCES "passes"("id") ON DELETE RESTRICT,
  "owner_id" text NOT NULL REFERENCES "users"("id") ON DELETE RESTRICT,
  "acquired_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "ownerships_pass_uq" ON "ownerships" ("pass_id");
CREATE INDEX "ownerships_owner_idx" ON "ownerships" ("owner_id");

CREATE TABLE "entitlements" (
  "id" text PRIMARY KEY,
  "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "pass_id" text NOT NULL REFERENCES "passes"("id") ON DELETE CASCADE,
  "key" text NOT NULL,
  "granted_at" timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX "entitlements_pass_key_uq" ON "entitlements" ("pass_id","key");
CREATE INDEX "entitlements_user_idx" ON "entitlements" ("user_id");

CREATE TABLE "audit_events" (
  "id" text PRIMARY KEY,
  "pass_id" text REFERENCES "passes"("id") ON DELETE CASCADE,
  "actor_user_id" text REFERENCES "users"("id") ON DELETE SET NULL,
  "event_type" text NOT NULL,
  "payload" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "audit_pass_idx" ON "audit_events" ("pass_id");
CREATE INDEX "audit_created_idx" ON "audit_events" ("created_at");

CREATE TABLE "traffic_events" (
  "id" text PRIMARY KEY,
  "source" text NOT NULL,
  "campaign" text,
  "listing_id" text,
  "event_type" text NOT NULL,
  "pass_serial" text,
  "metadata" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX "traffic_source_idx" ON "traffic_events" ("source","created_at");
