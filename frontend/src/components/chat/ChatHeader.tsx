/**
 * ChatHeader component - minimal header for chat.
 */

'use client';

import { Bot } from 'lucide-react';

interface ChatHeaderProps {
  title?: string;
  conversationId?: string | null;
}

export default function ChatHeader({ title, conversationId }: ChatHeaderProps) {
  return (
    <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
          <Bot size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium text-zinc-100">
            {title || 'AI Assistant'}
          </h2>
        </div>
      </div>
    </div>
  );
}
