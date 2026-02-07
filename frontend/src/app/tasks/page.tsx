/**
 * Task list page - displays all tasks for authenticated user.
 * Phase 5: Adds search, filter, sort, activity log, and real-time updates.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import TaskFilterBar from '@/components/TaskFilterBar';
import ActivityLogPanel from '@/components/ActivityLogPanel';
import KeyboardShortcutsModal from '@/components/KeyboardShortcutsModal';
import BulkActionsToolbar from '@/components/BulkActionsToolbar';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Task, TaskCreate, TaskUpdate, TaskFilters } from '@/lib/types';
import { taskApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<number>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Phase 5: Filters and activity log
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Phase 5: Real-time WebSocket updates
  const handleWsMessage = useCallback((message: { type: string; task_id?: number }) => {
    if (!user) return;
    // Refresh tasks when a real-time update comes in
    if (['task_created', 'task_updated', 'task_deleted', 'task_completed', 'task_uncompleted'].includes(message.type)) {
      taskApi.list(user.id, filters).then(setTasks).catch(() => {});
      toast.info('Tasks updated in real-time');
    }
  }, [user, filters]);

  useWebSocket({
    userId: user?.id,
    onMessage: handleWsMessage,
    enabled: !!user,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchTasks() {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);

        const fetchedTasks = await taskApi.list(user.id, filters);
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load tasks. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [user, filters]);

  const handleTaskCreated = async (taskData: TaskCreate) => {
    if (!user) return;

    setCreating(true);
    setError(null);

    try {
      const newTask = await taskApi.create(user.id, taskData);
      setTasks([newTask, ...tasks]);
      setShowForm(false);
      toast.success('Task created successfully!', {
        description: taskData.title,
      });
    } catch (err) {
      console.error('Failed to create task:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task. Please try again.';
      setError(errorMessage);
      toast.error('Failed to create task', {
        description: errorMessage,
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (taskId: number, data: TaskUpdate) => {
    if (!user) return;

    try {
      const updatedTask = await taskApi.update(user.id, taskId, data);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Failed to update task:', err);
      toast.error('Failed to update task', {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
      throw err;
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!user) return;

    try {
      await taskApi.delete(user.id, taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('Failed to delete task', {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
      throw err;
    }
  };

  const handleToggleComplete = async (taskId: number, isCompleted: boolean) => {
    if (!user) return;

    try {
      const updatedTask = await taskApi.toggleComplete(user.id, taskId, isCompleted);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success(isCompleted ? 'Task completed!' : 'Task marked as incomplete');
    } catch (err) {
      console.error('Failed to toggle completion:', err);
      toast.error('Failed to update task', {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
      throw err;
    }
  };

  // Bulk operations
  const handleToggleSelection = (taskId: number) => {
    setSelectedTaskIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.size === tasks.length) {
      setSelectedTaskIds(new Set());
    } else {
      setSelectedTaskIds(new Set(tasks.map(task => task.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (!user || selectedTaskIds.size === 0) return;

    const confirmed = confirm(`Delete ${selectedTaskIds.size} selected task(s)?`);
    if (!confirmed) return;

    setBulkActionLoading(true);
    const count = selectedTaskIds.size;

    try {
      await Promise.all(
        Array.from(selectedTaskIds).map(taskId => taskApi.delete(user.id, taskId))
      );
      setTasks(tasks.filter(task => !selectedTaskIds.has(task.id)));
      setSelectedTaskIds(new Set());
      toast.success(`${count} ${count === 1 ? 'task' : 'tasks'} deleted successfully!`);
    } catch (error) {
      console.error('Failed to delete tasks:', error);
      toast.error('Failed to delete some tasks', {
        description: 'Please try again.',
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkComplete = async (isCompleted: boolean) => {
    if (!user || selectedTaskIds.size === 0) return;

    setBulkActionLoading(true);
    const count = selectedTaskIds.size;

    try {
      const updatedTasks = await Promise.all(
        Array.from(selectedTaskIds).map(taskId =>
          taskApi.toggleComplete(user.id, taskId, isCompleted)
        )
      );

      setTasks(tasks.map(task => {
        const updated = updatedTasks.find(t => t.id === task.id);
        return updated || task;
      }));
      setSelectedTaskIds(new Set());

      toast.success(
        isCompleted
          ? `${count} ${count === 1 ? 'task' : 'tasks'} marked as complete!`
          : `${count} ${count === 1 ? 'task' : 'tasks'} marked as incomplete!`
      );
    } catch (error) {
      console.error('Failed to update tasks:', error);
      toast.error('Failed to update some tasks', {
        description: 'Please try again.',
      });
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleReorder = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'n',
      callback: () => setShowForm(true),
      description: 'Create new task',
    },
    {
      key: 'Escape',
      callback: () => {
        setShowForm(false);
        setShowShortcutsModal(false);
        setShowActivityLog(false);
      },
      description: 'Close/Cancel',
    },
    {
      key: '?',
      shiftKey: true,
      callback: () => setShowShortcutsModal(true),
      description: 'Show keyboard shortcuts',
    },
  ], !!user);

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

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Loading tasks...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold">Error loading tasks</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text-primary">
              My Tasks
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              {selectedTaskIds.size > 0 && ` \u2022 ${selectedTaskIds.size} selected`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setShowActivityLog(!showActivityLog)}
            >
              Activity
            </Button>
            {tasks.length > 0 && (
              <Button
                variant="secondary"
                size="md"
                onClick={handleSelectAll}
              >
                {selectedTaskIds.size === tasks.length ? 'Deselect All' : 'Select All'}
              </Button>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ New Task'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Phase 5: Search, filter, sort bar */}
        <TaskFilterBar filters={filters} onFiltersChange={setFilters} />

        {showForm && (
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowForm(false)}
          />
        )}

        <TaskList
          tasks={tasks}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleComplete={handleToggleComplete}
          selectedTaskIds={selectedTaskIds}
          onToggleSelection={handleToggleSelection}
          selectionMode={selectedTaskIds.size > 0 || tasks.length > 0}
          onReorder={handleReorder}
        />

        <BulkActionsToolbar
          selectedCount={selectedTaskIds.size}
          totalCount={tasks.length}
          onSelectAll={handleSelectAll}
          onMarkComplete={() => handleBulkComplete(true)}
          onMarkIncomplete={() => handleBulkComplete(false)}
          onDelete={handleBulkDelete}
          loading={bulkActionLoading}
        />

        <KeyboardShortcutsModal
          isOpen={showShortcutsModal}
          onClose={() => setShowShortcutsModal(false)}
        />

        {/* Phase 5: Activity Log Panel */}
        <ActivityLogPanel
          userId={user.id}
          isOpen={showActivityLog}
          onClose={() => setShowActivityLog(false)}
        />

        {/* Help button */}
        <button
          onClick={() => setShowShortcutsModal(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to text-white p-4 rounded-full shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-110"
          title="Keyboard shortcuts (Shift + ?)"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </DashboardLayout>
  );
}
