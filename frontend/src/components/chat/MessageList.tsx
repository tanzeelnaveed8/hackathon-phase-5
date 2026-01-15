/**
 * MessageList component - displays chat messages with auto-scroll.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Copy, Check } from 'lucide-react';
import { Message } from '@/types/chat';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading = false }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Copy message to clipboard
  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Check if message should show avatar (first in group or different sender)
  const shouldShowAvatar = (index: number) => {
    if (index === 0) return true;
    return messages[index].role !== messages[index - 1].role;
  };

  // Check if message is last in group
  const isLastInGroup = (index: number) => {
    if (index === messages.length - 1) return true;
    return messages[index].role !== messages[index + 1].role;
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => {
          const showAvatar = shouldShowAvatar(index);
          const lastInGroup = isLastInGroup(index);
          const isUser = message.role === 'user';

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${
                lastInGroup ? '' : 'mb-1'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isUser
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                }`}>
                  {isUser ? (
                    <User size={16} className="text-white" />
                  ) : (
                    <Bot size={16} className="text-white" />
                  )}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[80%]`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 ${
                    isUser
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  }`}
                >
                  <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>

                {/* Timestamp - only show on last message in group */}
                {lastInGroup && (
                  <p className="text-[11px] text-zinc-500 mt-1 px-1">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 flex-row"
          >
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
            </div>
            <div className="flex items-start">
              <div className="rounded-2xl px-4 py-3 bg-zinc-800 border border-zinc-700">
                <div className="flex gap-1.5 items-center">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-zinc-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-zinc-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 rounded-full bg-zinc-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={messagesEndRef} />
    </div>
  );
}
