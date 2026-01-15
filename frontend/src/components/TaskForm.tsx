/**
 * Task creation form component with modern UI.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { TaskCreate } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { slideUpVariants } from '@/lib/animations';

interface TaskFormProps {
  onTaskCreated: (task: any) => void;
  onCancel?: () => void;
}

export default function TaskForm({ onTaskCreated, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (title.length > 500) {
      setError('Title must be 500 characters or less');
      return;
    }

    if (description.length > 5000) {
      setError('Description must be 5000 characters or less');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const taskData: TaskCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      // The parent component will handle the API call
      onTaskCreated(taskData);

      // Clear form
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setError(null);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <motion.div
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="mb-6"
    >
      <Card variant="elevated" className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gradient-primary-from to-gradient-primary-to">
          <CardTitle className="text-white flex items-center gap-2">
            <Plus size={20} />
            Create New Task
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
            >
              <p className="text-sm text-red-500">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              maxLength={500}
              required
              disabled={loading}
              helperText={`${title.length}/500 characters`}
            />

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details about this task..."
                maxLength={5000}
                rows={4}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-background-elevated border border-border-default rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:border-border-focus focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              <p className="text-xs text-text-muted mt-1.5">
                {description.length}/5000 characters
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                disabled={!title.trim()}
                leftIcon={<Plus size={18} />}
                className="flex-1"
              >
                Create Task
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
