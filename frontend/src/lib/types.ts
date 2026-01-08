/**
 * TypeScript type definitions for the application.
 */

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}
