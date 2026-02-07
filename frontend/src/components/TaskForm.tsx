/**
 * Task creation form component with Phase 5 fields.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar, Tag, Repeat, Flag } from 'lucide-react';
import { TaskCreate, TaskPriority, RecurrencePattern } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { slideUpVariants } from '@/lib/animations';

interface TaskFormProps {
  onTaskCreated: (task: any) => void;
  onCancel?: () => void;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-gray-400' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-red-500' },
];

const RECURRENCE_OPTIONS: { value: RecurrencePattern; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function TaskForm({ onTaskCreated, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [recurrence, setRecurrence] = useState<RecurrencePattern>('none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
        recurrence_pattern: recurrence,
        tags: tags.length > 0 ? tags : undefined,
      };

      onTaskCreated(taskData);

      // Clear form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setRecurrence('none');
      setTags([]);
      setTagInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setRecurrence('none');
    setTags([]);
    setTagInput('');
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
                rows={3}
                disabled={loading}
                className="w-full px-4 py-2.5 bg-background-elevated border border-border-default rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:border-border-focus focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
              <p className="text-xs text-text-muted mt-1.5">
                {description.length}/5000 characters
              </p>
            </div>

            {/* Phase 5: Priority & Due Date row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Flag size={14} className="inline mr-1" />
                  Priority
                </label>
                <div className="flex gap-2">
                  {PRIORITY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        priority === opt.value
                          ? `${opt.color} text-white shadow-md`
                          : 'bg-background-elevated text-text-secondary border border-border-default hover:border-border-focus'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  <Calendar size={14} className="inline mr-1" />
                  Due Date
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2 bg-background-elevated border border-border-default rounded-lg text-text-primary text-sm transition-all focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50"
                />
              </div>
            </div>

            {/* Phase 5: Recurrence */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Repeat size={14} className="inline mr-1" />
                Recurrence
              </label>
              <div className="flex gap-2">
                {RECURRENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRecurrence(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      recurrence === opt.value
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'bg-background-elevated text-text-secondary border border-border-default hover:border-border-focus'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase 5: Tags */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                <Tag size={14} className="inline mr-1" />
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag and press Enter"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-background-elevated border border-border-default rounded-lg text-text-primary text-sm placeholder:text-text-muted transition-all focus:outline-none focus:ring-2 focus:ring-border-focus disabled:opacity-50"
                />
                <Button type="button" variant="secondary" size="sm" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-medium"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        x
                      </button>
                    </span>
                  ))}
                </div>
              )}
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
