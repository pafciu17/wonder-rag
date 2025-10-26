/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@langgraph-rag/db', '@langgraph-rag/rag', '@langgraph-rag/ingest'],
  experimental: {
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
};

module.exports = nextConfig;


