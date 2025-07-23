import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createBaseTable } from "@/database/schema/base";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

/**
 * User table schema
 */
export const users = createBaseTable("users").extend({
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  isActive: boolean("is_active").default(true).notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiresAt: timestamp("verification_token_expires_at", {
    withTimezone: true,
  }),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordTokenExpiresAt: timestamp("reset_password_token_expires_at", {
    withTimezone: true,
  }),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});

// Create index on email column
export const usersEmailIndex = uniqueIndex("users_email_idx").on(users.email);

/**
 * User session table schema
 */
export const sessions = createBaseTable("sessions").extend({
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  isValid: boolean("is_valid").default(true).notNull(),
});

// Type definitions for type safety
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

// Export all schema elements
export default {
  users,
  sessions,
  usersEmailIndex,
};
