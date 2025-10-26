# Getting Started

This guide will help you set up and run the LangGraph RAG demo locally.

## Prerequisites

- Node.js 18.17.0 or higher
- pnpm 8.0.0 or higher
- A Neon Postgres database (with pgvector support)
- An OpenAI API key

## Installation

1. **Clone and install dependencies**:

```bash
pnpm install
```

2. **Set up environment variables**:

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```
OPENAI_API_KEY=sk-your-openai-api-key
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require
```

3. **Initialize the database**:

Run the initialization SQL script in your Neon database console:

```bash
cat packages/db/drizzle/0000_init.sql
```

Copy and paste the contents into your Neon SQL editor and execute.

4. **Ingest documents**:

The demo comes with sample documents in the `docs/` folder. Ingest them:

```bash
pnpm ingest "docs/**/*.md"
```

This will:
- Load all markdown files from the docs folder
- Split them into chunks
- Generate embeddings
- Store them in your database

5. **Start the development server**:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
rag/
├── apps/
│   └── web/              # Next.js 15 application
│       ├── src/
│       │   ├── app/      # App Router pages and API routes
│       │   └── components/ # React components
│       └── package.json
├── packages/
│   ├── db/               # Database schema and queries
│   │   ├── src/
│   │   │   ├── schema.ts
│   │   │   ├── client.ts
│   │   │   └── queries.ts
│   │   └── drizzle/      # SQL migrations
│   ├── ingest/           # Document ingestion
│   │   └── src/
│   │       ├── loader.ts
│   │       ├── chunker.ts
│   │       ├── embedder.ts
│   │       └── pipeline.ts
│   └── rag/              # LangGraph RAG logic
│       └── src/
│           ├── graph.ts
│           ├── retriever.ts
│           ├── generator.ts
│           └── chat.ts
├── docs/                 # Sample documents
└── package.json          # Root package.json
```

## Next Steps

- Read [Introduction](./introduction.md) to understand how RAG works
- Add your own documents to the `docs/` folder and re-run ingestion
- Explore the code to see how LangGraph orchestrates the RAG workflow
- Deploy to Vercel (see deployment guide)


