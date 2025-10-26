import { readFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

export interface LoadedDocument {
  content: string;
  source: string;
  metadata: Record<string, any>;
}

/**
 * Load documents from a directory pattern
 */
export async function loadDocuments(
  pattern: string,
  baseDir: string = process.cwd()
): Promise<LoadedDocument[]> {
  const files = await glob(pattern, { cwd: baseDir, absolute: true });
  
  const documents: LoadedDocument[] = [];
  
  for (const filePath of files) {
    const content = await readFile(filePath, 'utf-8');
    const relativePath = path.relative(baseDir, filePath);
    const ext = path.extname(filePath);
    
    documents.push({
      content,
      source: relativePath,
      metadata: {
        filename: path.basename(filePath),
        extension: ext,
        path: relativePath,
      },
    });
  }
  
  return documents;
}

/**
 * Load a single document
 */
export async function loadDocument(filePath: string): Promise<LoadedDocument> {
  const content = await readFile(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const ext = path.extname(filePath);
  
  return {
    content,
    source: filePath,
    metadata: {
      filename,
      extension: ext,
      path: filePath,
    },
  };
}


