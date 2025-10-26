# 🚀 Quick Start Guide

Get your RAG system running in 5 minutes!

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Environment

Create `.env` file:

```bash
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

## Step 3: Initialize Database

1. Go to [Neon Console](https://console.neon.tech)
2. Open SQL Editor
3. Copy/paste contents from `packages/db/drizzle/0000_init.sql`
4. Execute

## Step 4: Ingest Documents

```bash
pnpm ingest "docs/**/*.md"
```

Expected output:
```
🚀 Starting document ingestion...
📖 Loading documents...
✓ Loaded 4 documents
✂️  Chunking documents...
✓ Created 15 chunks
🧮 Generating embeddings and inserting into database...
✅ Ingestion complete!
```

## Step 5: Start the App

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test Questions

Try asking:
- "What is RAG?"
- "How does the vector search work?"
- "What technologies are used in this project?"
- "How do I deploy to Vercel?"

## Troubleshooting

**Problem**: `DATABASE_URL` not found
- **Solution**: Make sure `.env` file exists in root directory

**Problem**: No embeddings generated
- **Solution**: Check your `OPENAI_API_KEY` is valid

**Problem**: No documents found
- **Solution**: Run `pnpm ingest "docs/**/*.md"` first

**Problem**: Build errors
- **Solution**: Run `pnpm install` again, ensure Node.js ≥ 18.17

## Next Steps

✅ Add your own documents to `docs/` and re-ingest  
✅ Customize the UI in `apps/web/src/components/Chat.tsx`  
✅ Adjust chunk size/overlap in `packages/ingest/src/pipeline.ts`  
✅ Deploy to Vercel (see [Deployment Guide](./docs/deployment.md))

## Common Commands

```bash
pnpm dev           # Start dev server
pnpm build         # Build for production  
pnpm ingest        # Run document ingestion
pnpm type-check    # Check TypeScript types
pnpm clean         # Clean build artifacts
```

## Need Help?

- 📖 [Full Documentation](./docs/getting-started.md)
- 🏗️ [Architecture Guide](./docs/architecture.md)
- 🚢 [Deployment Guide](./docs/deployment.md)

Happy coding! 🎉


