/**
 * MessageInput component - clean input field for sending chat messages.
 */

'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import EmojiPicker from './EmojiPicker';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSendMessage,
  disabled = false,
  placeholder = 'Type a message...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPosition = textarea.selectionStart || message.length;
    const newMessage =
      message.slice(0, cursorPosition) + emoji + message.slice(cursorPosition);

    setMessage(newMessage);
    setIsEmojiPickerOpen(false);

    setTimeout(() => {
      textarea.focus();
      const newCursorPosition = cursorPosition + emoji.length;
      textarea.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  return (
    <div className="border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm p-4 ">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed resize-none min-h-[48px] max-h-[120px] text-[15px] leading-relaxed"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
        </div>

        {/* Emoji Picker Button */}
        <button
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
          type="button"
          className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors flex-shrink-0"
        >
          <Smile size={20} />
        </button>

        {/* Emoji Picker */}
        {isEmojiPickerOpen && (
          <div className="absolute bottom-20 right-4 z-50">
            <EmojiPicker
              onEmojiSelect={handleEmojiSelect}
              isOpen={isEmojiPickerOpen}
              onToggle={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            />
          </div>
        )}

        {/* Send Button */}
        <motion.button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          whileHover={{ scale: disabled || !message.trim() ? 1 : 1.05 }}
          whileTap={{ scale: disabled || !message.trim() ? 1 : 0.95 }}
        >
          <Send size={20} />
        </motion.button>
      </div>
    </div>
  );
}
