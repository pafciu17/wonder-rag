# Architecture Deep Dive

This document provides a detailed explanation of the LangGraph RAG demo architecture.

## System Overview

The system consists of two main phases:

1. **Ingestion Phase**: Process and index documents
2. **Query Phase**: Answer questions using RAG

## Components

### 1. Database Layer (`packages/db`)

**Purpose**: Manage data storage and retrieval

**Key Files**:
- `schema.ts`: Drizzle ORM schema definitions
- `client.ts`: Database connection and initialization
- `queries.ts`: Reusable database queries

**Tables**:

```sql
documents (
  id: serial primary key,
  content: text,
  metadata: text (JSON),
  source: text,
  embedding: vector(1536),
  created_at: timestamp
)

chat_sessions (
  id: serial primary key,
  created_at: timestamp,
  updated_at: timestamp
)

messages (
  id: serial primary key,
  session_id: integer references chat_sessions,
  role: text,
  content: text,
  sources: text (JSON array of document IDs),
  created_at: timestamp
)
```

**Vector Index**:
- Uses `ivfflat` index for approximate nearest neighbor search
- Configured with 100 lists (adjustable based on dataset size)
- Uses cosine distance for similarity

### 2. Ingestion Pipeline (`packages/ingest`)

**Purpose**: Transform documents into searchable embeddings

**Flow**:

```
Documents → Loader → Chunker → Embedder → Database
```

**Components**:

1. **Loader** (`loader.ts`):
   - Reads files from filesystem using glob patterns
   - Supports `.md` and `.txt` files
   - Extracts metadata (filename, path, extension)

2. **Chunker** (`chunker.ts`):
   - Uses LangChain's `RecursiveCharacterTextSplitter`
   - Default chunk size: 1000 characters
   - Default overlap: 200 characters
   - Splits on paragraphs, then sentences, then words

3. **Embedder** (`embedder.ts`):
   - Uses OpenAI's `text-embedding-3-small` model
   - 1536 dimensions
   - Batch processing for efficiency

4. **Pipeline** (`pipeline.ts`):
   - Orchestrates the entire ingestion process
   - Processes documents in batches (default: 10)
   - Provides progress feedback

### 3. RAG Engine (`packages/rag`)

**Purpose**: Orchestrate retrieval and generation

**LangGraph Workflow**:

```
┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌────────────┐
│  Retrieve  │  ← Generate query embedding
│            │  ← Search for similar documents
└─────┬──────┘
      │
      ▼
┌──────────┐
│ Generate │  ← Build context from retrieved docs
│          │  ← Generate answer with LLM
└────┬─────┘
     │
     ▼
┌────────┐
│   End  │
└────────┘
```

**Components**:

1. **Retriever** (`retriever.ts`):
   - Embeds the user's question
   - Performs vector similarity search
   - Returns top-k most relevant chunks
   - Includes similarity scores

2. **Generator** (`generator.ts`):
   - Uses GPT-4o-mini for generation
   - Includes retrieved context in prompt
   - Enforces citation of sources
   - Supports conversational context

3. **Graph** (`graph.ts`):
   - Defines LangGraph state machine
   - Manages state transitions
   - Handles errors gracefully

4. **Chat** (`chat.ts`):
   - Manages conversation sessions
   - Stores chat history in database
   - Provides conversational RAG interface

### 4. Web Application (`apps/web`)

**Purpose**: User interface and API

**Structure**:

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page
├── globals.css          # Global styles
└── api/
    ├── chat/
    │   └── route.ts     # POST /api/chat
    └── stats/
        └── route.ts     # GET /api/stats

components/
└── Chat.tsx             # Chat interface component
```

**API Routes**:

1. **POST /api/chat**:
   - Receives user message and optional session ID
   - Calls RAG engine
   - Returns answer with sources
   - Creates/updates conversation session

2. **GET /api/stats**:
   - Returns document count
   - Checks system readiness

**Frontend**:
- Real-time chat interface
- Message history
- Collapsible source citations
- Loading states
- Error handling

## Data Flow

### Ingestion Flow

```
1. User runs: pnpm ingest "docs/**/*.md"
2. Loader finds all matching files
3. For each file:
   a. Read content
   b. Split into chunks (1000 chars, 200 overlap)
   c. Generate embedding for each chunk
   d. Store in database with metadata
4. Build vector index for fast search
```

### Query Flow

```
1. User submits question in UI
2. POST /api/chat receives message
3. RAG engine starts:
   a. Embed the question
   b. Search database for similar chunks
   c. Retrieve top 5 most similar (similarity > 0.7)
   d. Build context string with sources
   e. Send to GPT-4o-mini with instructions
   f. GPT generates answer with citations
4. Store message and response in database
5. Return answer + sources to frontend
6. UI displays answer with expandable sources
```

## Key Design Decisions

### 1. Why Monorepo?

- **Code Sharing**: Database schema, types, utilities shared across packages
- **Type Safety**: TypeScript types flow between packages
- **Atomic Updates**: Change multiple packages in single commit
- **Simpler Deployment**: Single build process for Vercel

### 2. Why LangGraph?

- **Orchestration**: Clean way to define multi-step workflows
- **State Management**: Automatic state handling between steps
- **Extensibility**: Easy to add new nodes (e.g., query rewriting, result ranking)
- **Debugging**: LangSmith integration for tracing

### 3. Why Neon + pgvector?

- **Serverless**: Auto-scaling, no connection management
- **Native Vectors**: pgvector is battle-tested and fast
- **SQL**: Familiar query language, complex joins possible
- **Cost**: Free tier sufficient for demos

### 4. Why Next.js 15?

- **App Router**: Better performance, streaming, server components
- **API Routes**: Simple backend without separate server
- **Vercel**: First-class deployment support
- **React 18**: Latest React features

## Performance Considerations

### Vector Search Optimization

- **Index Type**: `ivfflat` for good balance of speed/accuracy
- **Lists Parameter**: Set to ~sqrt(row_count) for optimal performance
- **Similarity Threshold**: 0.7 default, adjust based on your data

### Chunking Strategy

- **Size**: 1000 chars balances context vs. specificity
- **Overlap**: 200 chars prevents splitting of related info
- **Separators**: Paragraph → sentence → word preserves meaning

### Batch Processing

- **Embedding**: 10 documents per batch prevents rate limits
- **Database Inserts**: Batch inserts reduce roundtrips

## Security Considerations

1. **API Keys**: Never commit to Git, use environment variables
2. **Database**: Use SSL connections, strong passwords
3. **Rate Limiting**: Add rate limits to API routes in production
4. **Input Validation**: Sanitize user input before processing
5. **CORS**: Configure appropriate CORS headers if needed

## Future Enhancements

Potential improvements:

1. **Hybrid Search**: Combine vector search with BM25 for better results
2. **Query Rewriting**: LLM rewrites ambiguous questions
3. **Result Ranking**: Re-rank retrieved documents with cross-encoder
4. **Streaming Responses**: Stream LLM output token-by-token
5. **Multi-turn Reasoning**: Add reasoning steps to graph
6. **Document Metadata Filtering**: Filter by source, date, etc.
7. **Authentication**: Add user accounts and private knowledge bases


