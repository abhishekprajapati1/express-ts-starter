import { Pool } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as path from 'path';
import config from '@/config';
import { logger } from '@/utils/logger';

// Main migration function
async function runMigrations() {
  logger.info('Running database migrations...');

  // Create a PostgreSQL connection pool
  const pool = new Pool({
    connectionString: config.database.url,
  });

  try {
    // Initialize Drizzle
    const db = drizzle(pool);

    // Run migrations from the drizzle folder
    const migrationsFolder = path.resolve(process.cwd(), 'drizzle');

    logger.info(`Using migrations from ${migrationsFolder}`);

    await migrate(db, { migrationsFolder });

    logger.info('✅ Migrations completed successfully');
  } catch (error) {
    logger.error(`❌ Migration failed: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
      logger.debug(error.stack);
    }
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

export default runMigrations;
