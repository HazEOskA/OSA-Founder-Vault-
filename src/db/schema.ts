import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const passStatus = pgEnum("pass_status", [
  "CREATED",
  "RESERVED",
  "AVAILABLE",
  "SOLD",
  "SHIPPED",
  "CLAIMABLE",
  "CLAIMED",
  "ACTIVE",
  "SUSPENDED",
  "REVOKED",
]);

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    displayName: text("display_name"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("users_email_uq").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("sessions_token_hash_uq").on(table.tokenHash),
    index("sessions_user_idx").on(table.userId),
  ],
);

export const passes = pgTable(
  "passes",
  {
    id: text("id").primaryKey(),
    edition: text("edition").notNull(),
    serial: text("serial").notNull(),
    sequenceNumber: integer("sequence_number").notNull(),
    status: passStatus("status").notNull().default("CREATED"),
    issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
    claimedAt: timestamp("claimed_at", { withTimezone: true }),
    ownerId: text("owner_id").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("passes_serial_uq").on(table.serial),
    uniqueIndex("passes_sequence_uq").on(table.edition, table.sequenceNumber),
    index("passes_owner_idx").on(table.ownerId),
  ],
);

export const claimTokens = pgTable(
  "claim_tokens",
  {
    id: text("id").primaryKey(),
    passId: text("pass_id")
      .notNull()
      .references(() => passes.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("claim_tokens_hash_uq").on(table.tokenHash),
    index("claim_tokens_pass_idx").on(table.passId),
  ],
);

export const ownerships = pgTable(
  "ownerships",
  {
    id: text("id").primaryKey(),
    passId: text("pass_id")
      .notNull()
      .references(() => passes.id, { onDelete: "restrict" }),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    acquiredAt: timestamp("acquired_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("ownerships_pass_uq").on(table.passId),
    index("ownerships_owner_idx").on(table.ownerId),
  ],
);

export const entitlements = pgTable(
  "entitlements",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    passId: text("pass_id")
      .notNull()
      .references(() => passes.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    grantedAt: timestamp("granted_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("entitlements_pass_key_uq").on(table.passId, table.key),
    index("entitlements_user_idx").on(table.userId),
  ],
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    passId: text("pass_id").references(() => passes.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    eventType: text("event_type").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("audit_pass_idx").on(table.passId),
    index("audit_created_idx").on(table.createdAt),
  ],
);

export const trafficEvents = pgTable(
  "traffic_events",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    campaign: text("campaign"),
    listingId: text("listing_id"),
    eventType: text("event_type").notNull(),
    passSerial: text("pass_serial"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("traffic_source_idx").on(table.source, table.createdAt)],
);
