import { db } from "./db";

// Export database instance
export { db };

// Export schema utilities
export { createBaseTable, operators, paginate } from "./schema/base";

// Re-export Drizzle ORM's type helpers
export { InferInsertModel, InferSelectModel } from "drizzle-orm";

// Export pagination params type
export type { PaginationParams } from "./schema/base";

// Export the Repository class
export { Repository } from "./repository";

// Export a function to get a database schema
export const getSchema = (moduleName: string) => {
  try {
    // Dynamic import of module-specific schema
    return require(`@/${moduleName}/${moduleName}.schema`);
  } catch (error) {
    // If module doesn't have a schema, return null
    return null;
  }
};

export default db;
