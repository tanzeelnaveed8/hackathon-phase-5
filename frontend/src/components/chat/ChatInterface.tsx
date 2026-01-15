/**
 * ChatInterface component - main chat interface with message handling.
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Bot } from 'lucide-react';
import { Message, ChatResponse } from '@/types/chat';
import { chatApi } from '@/lib/chat-api';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Card from '@/components/ui/Card';

interface ChatInterfaceProps {
  onTaskCreated?: (taskId: string) => void;
}

export default function ChatInterface({ onTaskCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSendMessage = async (messageContent: string) => {
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    // Add user message to UI immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: messageContent,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response: ChatResponse = await chatApi.sendMessage({
        message: messageContent,
        conversation_id: conversationId,
      });

      // Update conversation ID if this is a new conversation
      if (!conversationId) {
        setConversationId(response.conversation_id);
      }

      // Replace temp user message with real one and add assistant message
      setMessages((prev) => {
        const withoutTemp = prev.filter((msg) => msg.id !== userMessage.id);
        return [...withoutTemp, response.message];
      });

      // Handle actions (e.g., task created)
      if (response.actions && response.actions.length > 0) {
        response.actions.forEach((action) => {
          if (action.type === 'task_created' && action.task_id) {
            setSuccessMessage('Task created successfully!');
            onTaskCreated?.(action.task_id);
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
          }
        });
      }

      // Handle errors from backend
      if (response.error) {
        setError('AI service is temporarily unavailable. Please try again later.');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to send message. Please try again.'
      );
      // Remove the temporary user message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card variant="elevated" className="flex-1 flex flex-col overflow-hidden">
        <ChatHeader
          title={conversationId ? 'Chat' : 'New Chat'}
          conversationId={conversationId}
        />

        {/* Error/Success notifications */}
        {(error || successMessage) && (
          <div className="p-4 border-b border-border-default">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500"
              >
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500"
              >
                <CheckCircle size={18} />
                <span className="text-sm">{successMessage}</span>
              </motion.div>
            )}
          </div>
        )}

        {/* Messages area */}
        {messages.length === 0 && !isLoading ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center max-w-2xl w-full">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Bot size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100 mb-2">
                How can I help you today?
              </h3>
              <p className="text-sm text-zinc-400 mb-8">
                Ask me to create tasks, set reminders, or manage your to-do list
              </p>

              {/* Sample Prompts */}
              <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto">
                {[
                  { text: "Add a task to buy groceries tomorrow", icon: "🛒" }
                ].map((sample, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSendMessage(sample.text)}
                    className="flex items-center gap-3 p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-left hover:bg-zinc-750 hover:border-zinc-600 transition-all duration-200 group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl flex-shrink-0">{sample.icon}</span>
                    <span className="text-sm text-zinc-300 group-hover:text-zinc-100 transition-colors">
                      {sample.text}
                    </span>
                    <svg
                      className="w-4 h-4 ml-auto text-zinc-500 group-hover:text-zinc-300 transition-colors flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isLoading={isLoading} />
        )}

        {/* Input area */}
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </Card>
    </div>
  );
}
