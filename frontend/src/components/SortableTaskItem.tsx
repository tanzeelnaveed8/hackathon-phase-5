/**
 * SortableTaskItem - wrapper for TaskItem with drag-and-drop support
 */

'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskItem from './TaskItem';
import { Task, TaskUpdate } from '@/lib/types';

interface SortableTaskItemProps {
  task: Task;
  onUpdate: (taskId: number, data: TaskUpdate) => Promise<void>;
  onDelete: (taskId: number) => Promise<void>;
  onToggleComplete: (taskId: number, isCompleted: boolean) => Promise<void>;
  isSelected?: boolean;
  onToggleSelection?: (taskId: number) => void;
  selectionMode?: boolean;
}

export default function SortableTaskItem(props: SortableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskItem {...props} />
    </div>
  );
}
