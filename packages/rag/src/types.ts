export interface Source {
  id: number;
  content: string;
  source: string;
  metadata: any;
  similarity: number;
}

export interface RAGState {
  messages: Array<{ role: string; content: string }>;
  question: string;
  context: Source[];
  answer: string;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  sources?: Source[];
}

export interface RAGResponse {
  answer: string;
  sources: Source[];
  conversationId?: number;
}


