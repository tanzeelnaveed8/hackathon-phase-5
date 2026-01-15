/**
 * EmojiPicker component - emoji picker with dark theme.
 */

'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPickerReact, { Theme, EmojiClickData } from 'emoji-picker-react';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function EmojiPicker({
  onEmojiSelect,
  isOpen,
  onToggle,
}: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    // Close on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onToggle]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Emoji Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 right-0 z-50"
          >
            <div className="shadow-2xl rounded-xl overflow-hidden border border-zinc-700">
              <EmojiPickerReact
                onEmojiClick={handleEmojiClick}
                theme={Theme.DARK}
                width={320}
                height={400}
                searchPlaceHolder="Search emojis..."
                previewConfig={{
                  showPreview: false,
                }}
                skinTonesDisabled
                lazyLoadEmojis
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
