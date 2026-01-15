/**
 * API client for backend communication.
 * Automatically attaches JWT tokens from httpOnly cookies.
 */

import { Task, TaskCreate, TaskUpdate } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

interface ApiClientOptions extends RequestInit {
  body?: any;
}

/**
 * Generic API client wrapper with automatic JWT attachment.
 */
export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {}
): Promise<T> {
  const { body, ...restOptions } = options;

  // Get JWT token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    ...restOptions,
    credentials: 'include', // Send httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }), // Add JWT token if available
      ...restOptions.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: 'Request failed',
    }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  // Handle 204 No Content responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * Task API methods.
 */
export const taskApi = {
  /**
   * List all tasks for authenticated user.
   */
  list: (userId: string) =>
    apiClient<Task[]>(`/api/${userId}/tasks`, { method: 'GET' }),

  /**
   * Create a new task.
   */
  create: (userId: string, data: TaskCreate) =>
    apiClient<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: data,
    }),

  /**
   * Get a specific task by ID.
   */
  get: (userId: string, taskId: number) =>
    apiClient<Task>(`/api/${userId}/tasks/${taskId}`, { method: 'GET' }),

  /**
   * Update a task.
   */
  update: (userId: string, taskId: number, data: TaskUpdate) =>
    apiClient<Task>(`/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      body: data,
    }),

  /**
   * Delete a task.
   */
  delete: (userId: string, taskId: number) =>
    apiClient<void>(`/api/${userId}/tasks/${taskId}`, { method: 'DELETE' }),

  /**
   * Toggle task completion status.
   */
  toggleComplete: (userId: string, taskId: number, isCompleted: boolean) =>
    apiClient<Task>(`/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      body: { is_completed: isCompleted },
    }),
};
