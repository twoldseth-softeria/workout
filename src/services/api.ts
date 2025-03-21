import {
  WorkoutTypeResponse,
  WorkoutLogResponse,
  WorkoutType,
  WorkoutLog,
  CreateWorkoutTypeRequest,
  CreateWorkoutLogRequest,
} from '../types/workout';

const API_URL = '/api';

// Workout Type API
export const fetchWorkoutTypes = async (): Promise<WorkoutType[]> => {
  const response = await fetch(`${API_URL}/workoutType`);
  if (!response.ok) {
    throw new Error('Failed to fetch workout types');
  }
  const data: WorkoutTypeResponse = await response.json();
  return data.data;
};

export const createWorkoutType = async (workoutType: CreateWorkoutTypeRequest): Promise<void> => {
  const response = await fetch(`${API_URL}/workoutType`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutType),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create workout type');
  }
};

export const updateWorkoutType = async (id: string, workoutType: CreateWorkoutTypeRequest): Promise<void> => {
  const response = await fetch(`${API_URL}/workoutType/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutType),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update workout type');
  }
};

export const deleteWorkoutType = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/workoutType/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete workout type');
  }
};

// Workout Log API
export const fetchWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const response = await fetch(`${API_URL}/workoutLog`);
  if (!response.ok) {
    throw new Error('Failed to fetch workout logs');
  }
  const data: WorkoutLogResponse = await response.json();
  return data.data;
};

export const createWorkoutLog = async (workoutLog: CreateWorkoutLogRequest): Promise<void> => {
  const response = await fetch(`${API_URL}/workoutLog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutLog),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create workout log');
  }
};

export const updateWorkoutLog = async (id: string, workoutLog: CreateWorkoutLogRequest): Promise<void> => {
  const response = await fetch(`${API_URL}/workoutLog/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(workoutLog),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update workout log');
  }
};

export const deleteWorkoutLog = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/workoutLog/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete workout log');
  }
};