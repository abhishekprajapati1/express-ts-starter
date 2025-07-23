import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.DB_URL &&
    (!process.env.DB_HOST ||
     !process.env.DB_PORT ||
     !process.env.DB_USER ||
     !process.env.DB_PASSWORD ||
     !process.env.DB_NAME)) {
  throw new Error('Database configuration is missing in environment variables');
}

// Construct the database URL if not provided directly
const dbUrl = process.env.DB_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export default {
  schema: './src/**/*.schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: dbUrl,
  },
  verbose: true,
  strict: true,
} satisfies Config;
