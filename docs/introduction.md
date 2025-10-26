# Introduction to LangGraph RAG Demo

Welcome to the LangGraph RAG (Retrieval-Augmented Generation) demo! This project demonstrates how to build a powerful question-answering system that can chat with your documents.

## What is RAG?

RAG stands for Retrieval-Augmented Generation. It's a technique that combines:

1. **Retrieval**: Finding relevant information from a knowledge base
2. **Augmentation**: Adding that information to the context
3. **Generation**: Using an LLM to generate a natural language answer

This approach allows AI systems to answer questions based on specific documents rather than relying solely on their training data.

## Key Features

- **Document Ingestion**: Automatically process and index markdown and text files
- **Vector Search**: Use pgvector for fast semantic similarity search
- **Conversational AI**: Maintain chat history for contextual conversations
- **Source Citations**: Every answer includes references to source documents
- **Modern UI**: Beautiful, responsive interface built with Next.js 15

## Architecture

This demo uses a monorepo structure with shared packages:

- `packages/db`: Database schema and queries (Neon Postgres + pgvector)
- `packages/ingest`: Document loading, chunking, and embedding
- `packages/rag`: LangGraph orchestration for RAG workflows
- `apps/web`: Next.js 15 web application

## How It Works

1. **Ingestion Phase**:
   - Documents are loaded from the file system
   - Text is split into manageable chunks
   - Each chunk is embedded using OpenAI's text-embedding-3-small
   - Embeddings are stored in Neon Postgres with pgvector

2. **Query Phase**:
   - User asks a question
   - Question is embedded using the same model
   - Similar document chunks are retrieved using vector search
   - LangGraph orchestrates the RAG workflow
   - GPT-4o-mini generates an answer with citations

## Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Node.js, Next.js API Routes
- **AI/ML**: LangChain, LangGraph, OpenAI API
- **Database**: Neon Postgres with pgvector extension
- **Infrastructure**: Vercel (for deployment), pnpm (for package management)


