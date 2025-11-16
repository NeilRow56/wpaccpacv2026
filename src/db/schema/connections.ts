import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  jsonb,
  customType,
  timestamp,
} from "drizzle-orm/pg-core";

const bytea = customType<{ data: Buffer; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
  toDriver(val: unknown) {
    return val as Buffer;
  },
  fromDriver(val: unknown) {
    return val as Buffer;
  },
});

export const connections = pgTable("connections", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  platform: text("platform").notNull(),
  account_name: text("account_name").notNull(),
  metadata: jsonb("metadata"),
  access_token_enc: bytea("access_token_enc"),
  refresh_token_enc: bytea("refresh_token_enc"),
  iv: bytea("iv").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).default(
    sql`now()`
  ),
  updated_at: timestamp("updated_at", { withTimezone: true }).default(
    sql`now()`
  ),
});
