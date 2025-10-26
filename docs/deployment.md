# Deployment Guide

This guide covers deploying the LangGraph RAG demo to Vercel.

## Prerequisites

- A Vercel account ([sign up](https://vercel.com/signup))
- A Neon Postgres database
- An OpenAI API key
- Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Prepare Your Database

Make sure your Neon Postgres database has the pgvector extension and tables set up:

1. Go to your Neon console
2. Open the SQL Editor
3. Run the initialization script from `packages/db/drizzle/0000_init.sql`

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect the Next.js framework

### 3. Configure Build Settings

Vercel should auto-detect the configuration from `vercel.json`, but verify:

- **Framework Preset**: Next.js
- **Build Command**: `pnpm build`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `pnpm install`

### 4. Set Environment Variables

In the Vercel project settings, add these environment variables:

```
OPENAI_API_KEY=sk-your-openai-api-key
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require
```

Optional (for debugging):
```
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=your-langsmith-key
LANGCHAIN_PROJECT=langgraph-rag-demo
```

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

### 6. Ingest Documents

After deployment, you need to populate your database with documents. You can either:

**Option A: Ingest locally** (recommended for initial setup)
```bash
# Make sure your .env points to the production database
pnpm ingest "docs/**/*.md"
```

**Option B: Create a one-time ingestion API route**
You could add an authenticated API route for ingestion, but be careful about security.

## Continuous Deployment

Vercel automatically deploys:
- **Production**: When you push to your main/master branch
- **Preview**: For every pull request

## Monitoring

1. **Vercel Analytics**: Automatically enabled for page views and performance
2. **Vercel Logs**: Check function logs in the Vercel dashboard
3. **LangSmith**: If enabled, traces will appear in your LangSmith project

## Troubleshooting

### Build Failures

If the build fails, check:
- All workspace dependencies are properly linked
- TypeScript compiles without errors locally
- Environment variables are set correctly

### Runtime Errors

Common issues:
- **Database connection**: Verify `DATABASE_URL` is correct
- **OpenAI API**: Verify `OPENAI_API_KEY` is valid
- **No documents**: Run ingestion to populate the database

### Function Timeout

If queries are slow:
- Optimize vector index settings in Neon
- Reduce the number of retrieved documents
- Consider caching frequently asked questions

## Scaling

For production use:

1. **Database**: Neon automatically scales, but consider:
   - Increasing compute resources for high traffic
   - Optimizing vector indexes (adjust `lists` parameter)

2. **Vercel**: 
   - Pro plan recommended for production workloads
   - Configure appropriate function timeouts (default: 10s)
   - Enable Edge Runtime for faster cold starts (if compatible)

3. **Rate Limiting**:
   - Implement rate limiting on API routes
   - Consider using Vercel's Edge Config for rate limit storage

## Cost Optimization

- **OpenAI API**: Monitor token usage, use caching where possible
- **Neon**: Use the free tier for development, scale up for production
- **Vercel**: Optimize bundle size and use edge functions strategically


