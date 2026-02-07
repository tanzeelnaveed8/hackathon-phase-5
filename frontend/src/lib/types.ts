/**
 * TypeScript type definitions for the application.
 */

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type RecurrencePattern = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  priority: TaskPriority;
  due_date: string | null;
  recurrence_pattern: RecurrencePattern;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  recurrence_pattern?: RecurrencePattern;
  tags?: string[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  recurrence_pattern?: RecurrencePattern;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  user_id: string;
  task_id: number | null;
  action: string;
  details: string | null;
  created_at: string;
}

export interface TaskFilters {
  search?: string;
  priority?: TaskPriority;
  is_completed?: boolean;
  tag?: string;
  sort_by?: 'created_at' | 'due_date' | 'priority' | 'title';
  sort_order?: 'asc' | 'desc';
}
