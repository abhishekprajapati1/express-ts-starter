import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Base table schema with common fields for all tables
 *
 * @param tableName The name of the table
 * @returns A table builder with common columns
 */
export const createBaseTable = (tableName: string) => {
  return pgTable(tableName, {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  });
};

/**
 * Re-export Drizzle's type helpers for convenience
 */
export type { InferInsertModel, InferSelectModel };

/**
 * Common operators for filtering queries
 */
export const operators = {
  eq: (field: any, value: any) => ({ [field]: value }),
  neq: (field: any, value: any) => ({ [field]: { not: value } }),
  gt: (field: any, value: any) => ({ [field]: { gt: value } }),
  gte: (field: any, value: any) => ({ [field]: { gte: value } }),
  lt: (field: any, value: any) => ({ [field]: { lt: value } }),
  lte: (field: any, value: any) => ({ [field]: { lte: value } }),
  between: (field: any, min: any, max: any) => ({
    [field]: { gte: min, lte: max },
  }),
  like: (field: any, value: any) => ({ [field]: { like: `%${value}%` } }),
  ilike: (field: any, value: any) => ({ [field]: { ilike: `%${value}%` } }),
  in: (field: any, values: any[]) => ({ [field]: { in: values } }),
  notIn: (field: any, values: any[]) => ({ [field]: { notIn: values } }),
  isNull: (field: any) => ({ [field]: null }),
  isNotNull: (field: any) => ({ [field]: { isNot: null } }),
};

/**
 * Common pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Utility to apply pagination to a query
 *
 * @param query The query to paginate
 * @param params Pagination parameters
 * @returns Paginated query
 */
export const paginate = <T>(query: T, params: PaginationParams): T => {
  const { page = 1, limit = 10 } = params;
  const offset = (page - 1) * limit;
  return {
    ...query,
    limit,
    offset,
  } as T;
};
