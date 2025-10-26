import { OpenAIEmbeddings } from '@langchain/openai';

const embeddings = new OpenAIEmbeddings({
  modelName: 'text-embedding-3-small',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate embeddings for a batch of texts
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  return await embeddings.embedDocuments(texts);
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  return await embeddings.embedQuery(text);
}


