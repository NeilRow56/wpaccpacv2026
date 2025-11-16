import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const usage = pgTable("usage", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull(),
  plan: text("plan").notNull().default("free"),
  usage_limit: integer("usage_limit").notNull().default(1000),
  usage: integer("usage").notNull().default(0),
  created_at: timestamp("created_at", { withTimezone: true }).default(
    sql`now()`
  ),
  updated_at: timestamp("updated_at", { withTimezone: true }).default(
    sql`now()`
  ),
});
