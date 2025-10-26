import { db } from './client';
import { documents, chatSessions, messages, type Document, type NewDocument, type NewMessage } from './schema';
import { desc, sql } from 'drizzle-orm';

/**
 * Insert a new document with embedding
 */
export async function insertDocument(doc: NewDocument): Promise<Document> {
  const [inserted] = await db.insert(documents).values(doc).returning();
  return inserted;
}

/**
 * Insert multiple documents in batch
 */
export async function insertDocuments(docs: NewDocument[]): Promise<Document[]> {
  if (docs.length === 0) return [];
  return await db.insert(documents).values(docs).returning();
}

/**
 * Search documents by vector similarity
 */
export async function searchDocuments(
  queryEmbedding: number[],
  limit: number = 5,
  similarityThreshold: number = 0.7
): Promise<(Document & { similarity: number })[]> {
  const similarity = sql<number>`1 - (${documents.embedding} <=> ${JSON.stringify(queryEmbedding)}::vector)`;
  
  const results = await db
    .select({
      id: documents.id,
      content: documents.content,
      metadata: documents.metadata,
      source: documents.source,
      embedding: documents.embedding,
      createdAt: documents.createdAt,
      similarity,
    })
    .from(documents)
    .where(sql`${similarity} > ${similarityThreshold}`)
    .orderBy(desc(similarity))
    .limit(limit);

  return results;
}

/**
 * Create a new chat session
 */
export async function createChatSession(): Promise<number> {
  const [session] = await db.insert(chatSessions).values({}).returning();
  return session.id;
}

/**
 * Insert a message into a chat session
 */
export async function insertMessage(message: NewMessage) {
  const [inserted] = await db.insert(messages).values(message).returning();
  return inserted;
}

/**
 * Get chat history for a session
 */
export async function getChatHistory(sessionId: number, limit: number = 20) {
  return await db
    .select()
    .from(messages)
    .where(sql`${messages.sessionId} = ${sessionId}`)
    .orderBy(messages.createdAt)
    .limit(limit);
}

/**
 * Count total documents
 */
export async function getDocumentCount(): Promise<number> {
  const result = await db.select({ count: sql<number>`count(*)` }).from(documents);
  return result[0].count;
}

/**
 * Delete all documents (useful for re-ingestion)
 */
export async function deleteAllDocuments() {
  await db.delete(documents);
}


