import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql as NeonQueryFunction<boolean, boolean>, { schema });

/**
 * Initialize the database with required extensions and tables
 */
export async function initDatabase() {
  // Enable pgvector extension
  await sql`CREATE EXTENSION IF NOT EXISTS vector`;
  
  console.log('Database initialized with pgvector extension');
}


