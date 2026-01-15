/**
 * TaskItem component - displays a single task with modern UI and smooth interactions.
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2, GripVertical, Calendar } from 'lucide-react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { Task, TaskUpdate } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal, { ModalFooter } from '@/components/ui/Modal';
import { slideUpVariants } from '@/lib/animations';

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onToggleComplete: (taskId: number, isCompleted: boolean) => Promise<void>;
  isSelected?: boolean;
  onToggleSelection?: (taskId: number) => void;
  selectionMode?: boolean;
}

export default function TaskItem({ task, onUpdate, onDelete, onToggleComplete, isSelected = false, onToggleSelection, selectionMode = false }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onUpdate(task.id, {
        title: editTitle.trim(),
        description: editDescription.trim() || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await onToggleComplete(task.id, !task.is_completed);
    } catch (error) {
      console.error('Failed to toggle completion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.div
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        layout
      >
        <Card
          variant="elevated"
          hover={!isEditing}
          className={`p-4 transition-all duration-300 ${
            isSelected ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : ''
          } ${task.is_completed ? 'opacity-60' : ''}`}
        >
          {isEditing ? (
            <div className="space-y-4">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
                disabled={loading}
                error={!editTitle.trim() ? 'Title cannot be empty' : undefined}
              />
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Description (optional)
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Add more details..."
                  maxLength={5000}
                  rows={3}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-background-elevated border border-border-default rounded-lg text-text-primary placeholder:text-text-muted transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-primary focus:border-border-focus focus:ring-border-focus disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-xs text-text-muted mt-1">
                  {editDescription.length}/5000 characters
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSave}
                  isLoading={loading}
                  disabled={!editTitle.trim()}
                >
                  Save Changes
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              {/* Drag handle */}
              <div className="flex-shrink-0 pt-1 cursor-grab active:cursor-grabbing text-text-muted hover:text-text-primary transition-colors">
                <GripVertical size={20} />
              </div>

              {/* Selection checkbox */}
              {selectionMode && onToggleSelection && (
                <div className="flex-shrink-0 pt-1">
                  <Checkbox.Root
                    checked={isSelected}
                    onCheckedChange={() => onToggleSelection(task.id)}
                    className="w-5 h-5 rounded border-2 border-border-default bg-background-elevated hover:border-border-focus transition-all duration-200 flex items-center justify-center data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-gradient-primary-from data-[state=checked]:to-gradient-primary-to data-[state=checked]:border-transparent"
                  >
                    <Checkbox.Indicator>
                      <Check size={14} className="text-white" />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                </div>
              )}

              {/* Completion checkbox */}
              <div className="flex-shrink-0 pt-1">
                <Checkbox.Root
                  checked={task.is_completed}
                  onCheckedChange={handleToggleComplete}
                  disabled={loading}
                  className="w-5 h-5 rounded border-2 border-border-default bg-background-elevated hover:border-border-focus transition-all duration-200 flex items-center justify-center data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-gradient-primary-from data-[state=checked]:to-gradient-primary-to data-[state=checked]:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Checkbox.Indicator>
                    <Check size={14} className="text-white" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>

              {/* Task content */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-base font-medium transition-all duration-200 ${
                    task.is_completed
                      ? 'line-through text-text-muted'
                      : 'text-text-primary'
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs text-text-muted">
                  <Calendar size={12} />
                  <span>{new Date(task.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                <motion.button
                  onClick={() => setIsEditing(true)}
                  disabled={loading}
                  className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-elevated transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit2 size={18} />
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                  className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 disabled:opacity-50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Delete confirmation modal */}
      <Modal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      >
        <div className="py-4">
          <div className="p-4 bg-background-secondary rounded-lg border border-border-default">
            <p className="text-sm font-medium text-text-primary">{task.title}</p>
            {task.description && (
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>
        <ModalFooter>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setShowDeleteModal(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={handleDelete}
            isLoading={loading}
          >
            Delete Task
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

