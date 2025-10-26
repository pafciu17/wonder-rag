import { neon } from '@neondatabase/serverless';
import * as path from 'path';
import * as fs from 'fs';

// Load .env or .env.local from root if it exists
const envLocalPath = path.resolve(__dirname, '../../../.env.local');
const envPath = path.resolve(__dirname, '../../../.env');
const envFile = fs.existsSync(envLocalPath) ? envLocalPath : envPath;

if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

/**
 * Run database migrations
 */
export async function runMigrations() {
  console.log('🔄 Running database migrations...');
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  const sql = neon(databaseUrl);

  try {
    console.log('📝 Executing migration statements...');
    
    // Execute each major statement separately
    // Enable pgvector extension
    console.log('  → Creating pgvector extension...');
    await sql`CREATE EXTENSION IF NOT EXISTS vector`;
    
    // Documents table
    console.log('  → Creating documents table...');
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        metadata TEXT NOT NULL,
        source TEXT NOT NULL,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Chat sessions table
    console.log('  → Creating chat_sessions table...');
    await sql`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Messages table
    console.log('  → Creating messages table...');
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER NOT NULL REFERENCES chat_sessions(id),
        role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
        content TEXT NOT NULL,
        sources TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create indexes
    console.log('  → Creating indexes...');
    await sql`
      CREATE INDEX IF NOT EXISTS documents_embedding_idx ON documents 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS messages_session_id_idx ON messages(session_id)
    `;
    
    console.log('✅ Migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
