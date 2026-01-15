'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, X, User, LogOut, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { slideInLeftVariants } from '@/lib/animations';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      name: 'Tasks',
      href: '/tasks',
      icon: CheckSquare,
    },
    {
      name: 'AI Chat',
      href: '/chat',
      icon: MessageSquare,
    },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          className={`fixed top-0 left-0 h-full w-64 bg-background-secondary border-r border-border-default z-50 lg:z-30 flex flex-col ${
            isOpen ? 'block' : 'hidden lg:flex'
          }`}
          variants={slideInLeftVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-default">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                  <CheckSquare size={20} className="text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">Todo App</span>
              </Link>
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all duration-200"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link key={item.href} href={item.href} onClick={onClose}>
                    <motion.div
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to text-white shadow-lg shadow-indigo-500/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated'
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-border-default">
              {/* User info */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background-elevated">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gradient-primary-from to-gradient-primary-to flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-text-muted truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              </div>
           
             {/* Logout */}
            <Button
              variant="ghost"
              size="md"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-text-secondary hover:text-red-500"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </div>
          </motion.aside>
      </AnimatePresence>
    </>
  );
}
