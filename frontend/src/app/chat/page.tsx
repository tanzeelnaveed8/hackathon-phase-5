/**
 * Chat page - AI-powered task assistant.
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const handleTaskCreated = (taskId: string) => {
    // Show success notification
    toast.success('Task created!', {
      description: 'Your task has been added to your list.',
      action: {
        label: 'View Tasks',
        onClick: () => router.push('/tasks'),
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)]">
       

        <ChatInterface onTaskCreated={handleTaskCreated} />
      </div>
    </DashboardLayout>
  );
}
