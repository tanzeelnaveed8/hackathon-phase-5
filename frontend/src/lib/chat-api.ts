/**
 * Chat API client for AI-powered todo chatbot.
 */

import { ChatRequest, ChatResponse, ConversationSummary } from '@/types/chat';
import { apiClient } from './api';

/**
 * Chat API methods.
 */
export const chatApi = {
  /**
   * Send a chat message and get AI response.
   */
  sendMessage: (data: ChatRequest) =>
    apiClient<ChatResponse>('/api/chat', {
      method: 'POST',
      body: data,
    }),

  /**
   * List all conversations for authenticated user.
   */
  listConversations: () =>
    apiClient<ConversationSummary[]>('/api/conversations', {
      method: 'GET',
    }),

  /**
   * Get a specific conversation with messages.
   */
  getConversation: (conversationId: string) =>
    apiClient<any>(`/api/conversations/${conversationId}`, {
      method: 'GET',
    }),

  /**
   * Delete a conversation.
   */
  deleteConversation: (conversationId: string) =>
    apiClient<void>(`/api/conversations/${conversationId}`, {
      method: 'DELETE',
    }),
};
