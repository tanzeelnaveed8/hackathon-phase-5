'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import { fadeVariants } from '@/lib/animations';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen bg-background-primary">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <motion.main
          className="flex-1 px-4 sm:px-6 lg:px-8 py-8 bg-background-primary"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
