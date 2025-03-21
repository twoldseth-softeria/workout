export interface User {
  id: string;
  name: string;
  email: string;
}

export interface WorkoutType {
  id: string;
  sequence: number;
  name: string;
}

export interface WorkoutLog {
  id: string;
  sequence: number;
  date: string;
  workoutType: WorkoutType;
  minutes: number;
}

export interface WorkoutTypeResponse {
  data: WorkoutType[];
  meta: {
    count: number;
  };
}

export interface WorkoutLogResponse {
  data: WorkoutLog[];
  meta: {
    count: number;
  };
}

export interface UserResponse {
  data: User;
}

export interface CreateWorkoutTypeRequest {
  name: string;
}

export interface CreateWorkoutLogRequest {
  date: string;
  workoutType: WorkoutType;
  minutes: number;
}