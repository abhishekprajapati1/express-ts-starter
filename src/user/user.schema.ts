import {
  pgTable,
  text,
  timestamp,
  boolean,
  uniqueIndex,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { createBaseTable } from "@/database/schema/base";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { users } from "@/auth/auth.schema";

/**
 * User profile table schema
 */
export const userProfiles = createBaseTable("user_profiles").extend({
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  phoneNumber: text("phone_number"),
  dateOfBirth: timestamp("date_of_birth", { withTimezone: true }),
  location: text("location"),
  website: text("website"),
  occupation: text("occupation"),
  preferences: jsonb("preferences"),
});

/**
 * User role enum
 */
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

/**
 * User roles table schema
 */
export const userRoles = createBaseTable("user_roles").extend({
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  role: text("role").notNull().$type<UserRole>(),
});

/**
 * User address table schema
 */
export const userAddresses = createBaseTable("user_addresses").extend({
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  type: text("type").notNull(), // 'home', 'work', etc.
  addressLine1: text("address_line_1").notNull(),
  addressLine2: text("address_line_2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
});

// Type definitions for type safety
export type UserProfile = InferSelectModel<typeof userProfiles>;
export type NewUserProfile = InferInsertModel<typeof userProfiles>;
export type UserRoleRecord = InferSelectModel<typeof userRoles>;
export type NewUserRole = InferInsertModel<typeof userRoles>;
export type UserAddress = InferSelectModel<typeof userAddresses>;
export type NewUserAddress = InferInsertModel<typeof userAddresses>;

// Export all schema elements
export default {
  userProfiles,
  userRoles,
  userAddresses,
};
