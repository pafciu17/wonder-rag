import { createChatSession, insertMessage, getChatHistory } from '@langgraph-rag/db';
import { retrieveDocuments } from './retriever';
import { generateConversationalAnswer } from './generator';
import type { RAGResponse } from './types';

/**
 * Handle a chat message with RAG
 */
export async function chat(
  message: string,
  sessionId?: number
): Promise<RAGResponse> {
  // Create or use existing session
  let currentSessionId = sessionId;
  if (!currentSessionId) {
    currentSessionId = await createChatSession();
  }

  // Get chat history
  const history = await getChatHistory(currentSessionId);
  const chatHistory = history.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  // Store user message
  await insertMessage({
    sessionId: currentSessionId,
    role: 'user',
    content: message,
  });

  // Retrieve relevant documents
  const sources = await retrieveDocuments(message, 5, 0.3);

  // Generate answer
  const answer = await generateConversationalAnswer(message, sources, chatHistory);

  // Store assistant message with sources
  await insertMessage({
    sessionId: currentSessionId,
    role: 'assistant',
    content: answer,
    sources: JSON.stringify(sources.map((s) => s.id)),
  });

  return {
    answer,
    sources,
    conversationId: currentSessionId,
  };
}


