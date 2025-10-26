import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { SystemMessage, HumanMessage, AIMessage } from '@langchain/core/messages';
import type { Source } from './types';

const llm = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const RAG_PROMPT = ChatPromptTemplate.fromMessages([
  [
    'system',
    `You are a helpful AI assistant that answers questions based on the provided context.

Rules:
1. Answer the question using ONLY the information from the provided context
2. If the context doesn't contain enough information, say so clearly
3. Always cite your sources using [Source N] notation
4. Be concise but comprehensive
5. If multiple sources support your answer, cite all of them

Context:
{context}`,
  ],
  ['human', '{question}'],
]);

/**
 * Generate an answer using RAG
 */
export async function generateAnswer(
  question: string,
  sources: Source[]
): Promise<string> {
  if (sources.length === 0) {
    return "I don't have any relevant information in my knowledge base to answer this question.";
  }

  // Format context with source references
  const context = sources
    .map(
      (source, idx) =>
        `[Source ${idx + 1}] (from ${source.source}, similarity: ${source.similarity.toFixed(2)})
${source.content}`
    )
    .join('\n\n---\n\n');

  // Generate answer
  const chain = RAG_PROMPT.pipe(llm);
  const response = await chain.invoke({
    context,
    question,
  });

  return response.content as string;
}

/**
 * Generate a conversational answer with chat history
 */
export async function generateConversationalAnswer(
  question: string,
  sources: Source[],
  chatHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  if (sources.length === 0) {
    return "I don't have any relevant information in my knowledge base to answer this question.";
  }

  // Format context
  const context = sources
    .map(
      (source, idx) =>
        `[Source ${idx + 1}] (from ${source.source})
${source.content}`
    )
    .join('\n\n---\n\n');

  // Build messages with history
  const messages = [
    new SystemMessage(`You are a helpful AI assistant that answers questions based on the provided context.

Rules:
1. Answer the question using ONLY the information from the provided context
2. Consider the conversation history for context
3. If the context doesn't contain enough information, say so clearly
4. Always cite your sources using [Source N] notation
5. Be conversational and helpful

Context:
${context}`),
    ...chatHistory.slice(-5).map((msg) =>
      msg.role === 'user' ? new HumanMessage(msg.content) : new AIMessage(msg.content)
    ),
    new HumanMessage(question),
  ];

  const response = await llm.invoke(messages);
  return response.content as string;
}


