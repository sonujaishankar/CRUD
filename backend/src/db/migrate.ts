import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as postgres from 'postgres';
import * as path from 'path';

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set in environment variables');
  }

  // Use a separate client for migrations (max 1 connection)
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  const migrationsFolder = path.resolve(__dirname, '../../drizzle');

  console.log('🔄 Running database migrations...');
  console.log(`   Migrations folder: ${migrationsFolder}`);

  await migrate(db, { migrationsFolder });

  console.log('✅ Migrations applied successfully.');
  await migrationClient.end();
}

runMigrations().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
