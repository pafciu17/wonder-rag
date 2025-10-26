import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@langgraph-rag/rag';
import { getDocumentCount } from '@langgraph-rag/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if we have documents in the database
    const docCount = await getDocumentCount();
    if (docCount === 0) {
      return NextResponse.json({
        answer: "I don't have any documents in my knowledge base yet. Please ingest some documents first using the ingestion pipeline.",
        sources: [],
        conversationId: sessionId || null,
      });
    }

    // Execute RAG
    const result = await chat(message, sessionId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


