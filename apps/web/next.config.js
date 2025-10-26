/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@langgraph-rag/db', '@langgraph-rag/rag', '@langgraph-rag/ingest'],
  serverExternalPackages: ['@neondatabase/serverless'],
};

module.exports = nextConfig;


