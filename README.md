# 🐰 Alice in Wonderland RAG

Chat with Alice's Adventures in Wonderland using AI-powered semantic search! Ask questions about the story and get answers with source citations from the book. Built with Next.js 15, OpenAI embeddings, and Neon Postgres with pgvector.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-green?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-purple?style=flat-square)

## ✨ Features

- 🐰 **Alice in Wonderland Knowledge Base** - Full text of the classic novel
- 🔍 **Semantic Search** - Ask questions in natural language
- 💬 **Conversational AI** - GPT-4o-mini generates contextual answers
- 📚 **Source Citations** - Every answer references specific passages from the book
- 🎨 **Modern UI** - Beautiful, responsive chat interface
- 🚀 **Production Ready** - Deployable to Vercel with one click
- ⚡ **Fast Vector Search** - Powered by pgvector with optimized indexes

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
│   └── rag/                 # RAG logic
│       ├── chat.ts          # Chat orchestration
│       ├── retriever.ts     # Vector search
│       └── generator.ts     # LLM generation
└── docs/                    # Alice in Wonderland text
```

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 20.0.0
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

Run the database migrations:
```bash
pnpm db:migrate
```

Or manually execute the SQL script in your Neon console:
```bash
cat packages/db/drizzle/0000_init.sql
```

4. **Ingest Alice in Wonderland**:

```bash
pnpm ingest "docs/alice-in-wonderland.txt"
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
- **LangChain** - LLM framework and embeddings
- **OpenAI API** - GPT-4o-mini for chat, text-embedding-3-small for embeddings
- **Drizzle ORM** - Type-safe database queries

### Database
- **Neon Postgres** - Serverless Postgres
- **pgvector** - Vector similarity search

### Infrastructure
- **pnpm workspaces** - Monorepo management
- **Vercel** - Deployment platform

## 📝 Usage

### Example Questions

Try asking:
- "Who is Alice?"
- "What happens at the Mad Tea Party?"
- "Tell me about the Cheshire Cat"
- "What did Alice drink to become smaller?"
- "Who are the main characters?"

### Adding Your Own Documents

You can replace Alice in Wonderland with your own documents:

```bash
# Add files to docs/ folder, then ingest
pnpm ingest "docs/**/*.{md,txt}"
```

### API Endpoints

#### `POST /api/chat`

Chat with the knowledge base:

```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Who is the Cheshire Cat?',
    sessionId: 1, // optional, for conversation continuity
  }),
});

const data = await response.json();
// {
//   answer: "The Cheshire Cat is...",
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
- `pnpm db:migrate` - Run database migrations
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
- [LangChain](https://github.com/langchain-ai/langchainjs)
- [Next.js](https://nextjs.org)
- [Neon](https://neon.tech)
- [Vercel](https://vercel.com)
- [OpenAI](https://openai.com)

Alice's Adventures in Wonderland by Lewis Carroll is in the public domain.

## 📧 Questions?

For questions or issues, please open an issue on GitHub or refer to the [documentation](./docs/).

---

**Happy building! 🚀**


