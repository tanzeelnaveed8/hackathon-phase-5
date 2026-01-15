'use client';

import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { fadeVariants } from '@/lib/animations';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <motion.header
      className="sticky top-0 z-20 bg-background-primary/80 backdrop-blur-xl border-b border-border-default"
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all duration-200"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Desktop spacing */}
        <div className="hidden lg:block" />

        {/* Right side - can add notifications, search, etc. later */}
        <div className="flex items-center gap-4">
          {/* Placeholder for future features */}
        </div>
      </div>
    </motion.header>
  );
}
