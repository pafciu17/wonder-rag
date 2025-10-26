import { searchDocuments } from '@langgraph-rag/db';
import { generateEmbedding } from '@langgraph-rag/ingest';
import type { Source } from './types';

/**
 * Retrieve relevant documents for a query
 */
export async function retrieveDocuments(
  query: string,
  limit: number = 5,
  similarityThreshold: number = 0.7
): Promise<Source[]> {
  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Search for similar documents
  const results = await searchDocuments(queryEmbedding, limit, similarityThreshold);

  // Transform to Source format
  return results.map((doc) => ({
    id: doc.id,
    content: doc.content,
    source: doc.source,
    metadata: JSON.parse(doc.metadata),
    similarity: doc.similarity,
  }));
}


