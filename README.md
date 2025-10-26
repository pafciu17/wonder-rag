# 🤖 LangGraph RAG Demo

A modern, production-ready Retrieval-Augmented Generation (RAG) application built with LangGraph, Next.js 15, and Neon Postgres. Chat with your documents using AI with full source citations.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)
![LangGraph](https://img.shields.io/badge/LangGraph-0.0.11-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

## ✨ Features

- 🔍 **Semantic Search** - Vector similarity search with pgvector
- 💬 **Conversational AI** - Maintain context across multiple messages
- 📚 **Source Citations** - Every answer includes references to source documents
- 🎨 **Modern UI** - Beautiful, responsive interface built with Next.js 15
- 🚀 **Production Ready** - Deployable to Vercel with one click
- 📦 **Monorepo Structure** - Shared packages for db, ingest, and rag logic
- ⚡ **Real-time Responses** - Fast vector search with optimized indexes

## 🏗️ Architecture

This is a **pnpm monorepo** with the following structure:

```
rag/
├── apps/
│   └── web/                 # Next.js 15 application
│       ├── src/app/         # App Router (pages & API routes)
│       └── src/components/  # React components
├── packages/
│   ├── db/                  # Neon Postgres + pgvector
│   │   ├── schema.ts        # Drizzle ORM schema
│   │   └── queries.ts       # Database queries
│   ├── ingest/              # Document processing
│   │   ├── loader.ts        # Load documents
│   │   ├── chunker.ts       # Text splitting
│   │   └── embedder.ts      # OpenAI embeddings
│   └── rag/                 # LangGraph orchestration
│       ├── graph.ts         # RAG workflow graph
│       ├── retriever.ts     # Vector search
│       └── generator.ts     # LLM generation
└── docs/                    # Sample documents
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.17.0
- pnpm ≥ 8.0.0
- [Neon Postgres](https://neon.tech) account (free tier works!)
- [OpenAI API](https://platform.openai.com) key

### Installation

1. **Install dependencies**:

```bash
pnpm install
```

2. **Configure environment**:

```bash
cp .env.example .env
```

Edit `.env`:
```env
OPENAI_API_KEY=sk-your-openai-api-key
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require
```

3. **Initialize database**:

Execute the SQL script in your Neon console:
```bash
cat packages/db/drizzle/0000_init.sql
```

4. **Ingest sample documents**:

```bash
pnpm ingest "docs/**/*.md"
```

5. **Start development server**:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 📖 Documentation

- [Introduction](./docs/introduction.md) - Learn about RAG and the architecture
- [Getting Started](./docs/getting-started.md) - Detailed setup guide
- [Deployment](./docs/deployment.md) - Deploy to Vercel

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety

### Backend
- **LangGraph.js** - Orchestrate RAG workflows
- **LangChain** - LLM framework
- **OpenAI API** - GPT-4o-mini for generation, text-embedding-3-small for embeddings
- **Drizzle ORM** - Type-safe database queries

### Database
- **Neon Postgres** - Serverless Postgres
- **pgvector** - Vector similarity search

### Infrastructure
- **pnpm workspaces** - Monorepo management
- **Vercel** - Deployment platform

## 📝 Usage

### Ingesting Documents

Add your own documents to the `docs/` folder (markdown or text files), then run:

```bash
pnpm ingest "docs/**/*.md"
```

Or ingest from a specific directory:

```bash
pnpm ingest "path/to/your/docs/**/*.{md,txt}"
```

### API Endpoints

#### `POST /api/chat`

Chat with the knowledge base:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'What is RAG?',
    sessionId: 1, // optional, for conversation continuity
  }),
});

const data = await response.json();
// {
//   answer: "RAG stands for...",
//   sources: [...],
//   conversationId: 1
// }
```

#### `GET /api/stats`

Get knowledge base statistics:

```typescript
const response = await fetch('/api/stats');
const data = await response.json();
// { documentCount: 42, status: "ready" }
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in [Vercel](https://vercel.com/new)
3. Add environment variables:
   - `OPENAI_API_KEY`
   - `DATABASE_URL`
4. Deploy!

See [Deployment Guide](./docs/deployment.md) for detailed instructions.

## 🏃 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm ingest` - Run document ingestion
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean build artifacts

## 🤝 Contributing

Contributions are welcome! This is a demo project, but feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use this project for learning or as a foundation for your own RAG applications.

## 🙏 Acknowledgments

Built with:
- [LangChain](https://github.com/langchain-ai/langchainjs) & [LangGraph](https://github.com/langchain-ai/langgraphjs)
- [Next.js](https://nextjs.org)
- [Neon](https://neon.tech)
- [Vercel](https://vercel.com)
- [OpenAI](https://openai.com)

## 📧 Questions?

For questions or issues, please open an issue on GitHub or refer to the [documentation](./docs/).

---

**Happy building! 🚀**


