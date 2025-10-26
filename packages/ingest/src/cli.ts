import { ingestDocuments } from './pipeline';
import path from 'path';

async function main() {
  const pattern = process.argv[2] || 'docs/**/*.{md,txt}';
  const baseDir = process.argv[3] || path.join(process.cwd(), '../../');

  try {
    await ingestDocuments({
      pattern,
      baseDir,
      chunkSize: 1000,
      chunkOverlap: 200,
      batchSize: 10,
    });
  } catch (error) {
    console.error('❌ Ingestion failed:', error);
    process.exit(1);
  }
}

main();


