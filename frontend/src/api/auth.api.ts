import { apiClient } from './client';
import type { AuthResponse, User } from '../types';

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signupRequest = async (
  payload: SignupPayload,
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
  return response.data;
};

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};

export const meRequest = async (): Promise<{ user: User }> => {
  const response = await apiClient.get<{ user: User }>('/auth/me');
  return response.data;
};
