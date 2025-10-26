import { NextResponse } from 'next/server';
import { getDocumentCount } from '@langgraph-rag/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const documentCount = await getDocumentCount();
    
    return NextResponse.json({
      documentCount,
      status: documentCount > 0 ? 'ready' : 'no_documents',
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}


