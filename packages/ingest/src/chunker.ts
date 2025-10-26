import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export interface ChunkMetadata {
  source: string;
  chunkIndex: number;
  totalChunks: number;
  [key: string]: any;
}

export interface DocumentChunk {
  content: string;
  metadata: ChunkMetadata;
}

/**
 * Split text into chunks with metadata
 */
export async function chunkText(
  text: string,
  source: string,
  metadata: Record<string, any> = {},
  chunkSize: number = 1000,
  chunkOverlap: number = 200
): Promise<DocumentChunk[]> {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
    separators: ['\n\n', '\n', '. ', ' ', ''],
  });

  const chunks = await splitter.splitText(text);
  
  return chunks.map((content, index) => ({
    content,
    metadata: {
      source,
      chunkIndex: index,
      totalChunks: chunks.length,
      ...metadata,
    },
  }));
}


