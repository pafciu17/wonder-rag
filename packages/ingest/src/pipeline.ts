import { insertDocuments, initDatabase, type NewDocument } from '@langgraph-rag/db';
import { loadDocuments } from './loader';
import { chunkText } from './chunker';
import { generateEmbeddings } from './embedder';

export interface IngestOptions {
  pattern: string;
  baseDir?: string;
  chunkSize?: number;
  chunkOverlap?: number;
  batchSize?: number;
}

/**
 * Main ingestion pipeline
 */
export async function ingestDocuments(options: IngestOptions): Promise<void> {
  const {
    pattern,
    baseDir = process.cwd(),
    chunkSize = 1000,
    chunkOverlap = 150,
    batchSize = 10,
  } = options;

  console.log('🚀 Starting document ingestion...');
  console.log(`📁 Pattern: ${pattern}`);
  console.log(`📂 Base directory: ${baseDir}`);

  // Initialize database
  await initDatabase();

  // Load documents
  console.log('\n📖 Loading documents...');
  const documents = await loadDocuments(pattern, baseDir);
  console.log(`✓ Loaded ${documents.length} documents`);

  if (documents.length === 0) {
    console.log('⚠️  No documents found. Exiting.');
    return;
  }

  // Chunk documents
  console.log('\n✂️  Chunking documents...');
  const allChunks = [];
  for (const doc of documents) {
    const chunks = await chunkText(
      doc.content,
      doc.source,
      doc.metadata,
      chunkSize,
      chunkOverlap
    );
    allChunks.push(...chunks);
  }
  console.log(`✓ Created ${allChunks.length} chunks`);

  // Generate embeddings and insert in batches
  console.log('\n🧮 Generating embeddings and inserting into database...');
  let inserted = 0;

  for (let i = 0; i < allChunks.length; i += batchSize) {
    const batch = allChunks.slice(i, i + batchSize);
    const texts = batch.map((chunk) => chunk.content);

    // Generate embeddings
    const embeddings = await generateEmbeddings(texts);

    // Prepare documents for insertion
    const documentsToInsert: NewDocument[] = batch.map((chunk, idx) => ({
      content: chunk.content,
      metadata: JSON.stringify(chunk.metadata),
      source: chunk.metadata.source,
      embedding: embeddings[idx],
    }));

    // Insert into database
    await insertDocuments(documentsToInsert);
    inserted += batch.length;

    console.log(`  Progress: ${inserted}/${allChunks.length} chunks inserted`);
  }

  console.log('\n✅ Ingestion complete!');
  console.log(`   Total documents: ${documents.length}`);
  console.log(`   Total chunks: ${allChunks.length}`);
}


