/**
 * TaskList component - displays a list of tasks with modern UI.
 */

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Task, TaskUpdate } from '@/lib/types';
import SortableTaskItem from './SortableTaskItem';
import { fadeVariants } from '@/lib/animations';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onToggleComplete: (taskId: number, isCompleted: boolean) => Promise<void>;
  selectedTaskIds?: Set<number>;
  onToggleSelection?: (taskId: number) => void;
  selectionMode?: boolean;
  onReorder?: (tasks: Task[]) => void;
}

export default function TaskList({ tasks, onUpdate, onDelete, onToggleComplete, selectedTaskIds = new Set(), onToggleSelection, selectionMode = false, onReorder }: TaskListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);
      if (onReorder) {
        onReorder(reorderedTasks);
      }
    }
  };

  if (tasks.length === 0) {
    return (
      <motion.div
        className="bg-background-elevated border border-border-default rounded-xl p-12 text-center"
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-background-secondary flex items-center justify-center">
            <ClipboardList size={32} className="text-text-muted" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          No tasks yet
        </h3>
        <p className="text-text-secondary">
          Get started by creating your first task!
        </p>
      </motion.div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-3">
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <SortableTaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                isSelected={selectedTaskIds.has(task.id)}
                onToggleSelection={onToggleSelection}
                selectionMode={selectionMode}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </div>
    </DndContext>
  );
}
