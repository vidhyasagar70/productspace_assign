import { apiClient } from './client';
import type { Task, TaskStatus } from '../types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export const getTasksRequest = async (): Promise<{ tasks: Task[] }> => {
  const response = await apiClient.get<{ tasks: Task[] }>('/tasks');
  return response.data;
};

export const createTaskRequest = async (
  payload: CreateTaskPayload,
): Promise<{ task: Task }> => {
  const response = await apiClient.post<{ task: Task }>('/tasks', payload);
  return response.data;
};

export const updateTaskStatusRequest = async (
  id: number,
  status: TaskStatus,
): Promise<{ task: Task }> => {
  const response = await apiClient.patch<{ task: Task }>(`/tasks/${id}/status`, {
    status,
  });
  return response.data;
};

export const deleteTaskRequest = async (id: number): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/tasks/${id}`);
  return response.data;
};
