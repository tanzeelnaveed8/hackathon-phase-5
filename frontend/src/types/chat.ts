/**
 * Chat types for AI-powered todo chatbot.
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string | null;
}

export interface ActionResponse {
  type: string;
  task_id?: string;
}

export interface ChatResponse {
  conversation_id: string;
  message: Message;
  actions: ActionResponse[];
  error?: string | null;
}

export interface ConversationSummary {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  message_count: number;
}
