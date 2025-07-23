import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import config from "@/config";
import { logger } from "@/utils/logger";

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: config.database.url,
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Test the database connection
pool
  .connect()
  .then(() => {
    logger.info("✅ Database connection established successfully");
  })
  .catch((error) => {
    logger.error(`❌ Database connection failed: ${error.message}`);
  });

// Create and export the Drizzle ORM instance
export const db = drizzle(pool, { schema: {} });

// Handle application shutdown
process.on("SIGINT", async () => {
  await pool.end();
  logger.info("Database pool has ended");
});

process.on("SIGTERM", async () => {
  await pool.end();
  logger.info("Database pool has ended");
});

export default db;
