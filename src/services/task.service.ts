import type { CreateTaskRequest, Task, TaskStatus } from "../models/task.model";
import { sendRequest } from "./api";

export const getTasks = (teamId?: string) => {
  const endpoint = teamId ? `/teams/${teamId}/tasks` : "/tasks";
  return sendRequest<undefined, Task[]>(endpoint, undefined, {}, "post");
};

export const createTask = (payload: CreateTaskRequest) =>
  sendRequest<CreateTaskRequest, Task>("/tasks", payload);

export const updateTaskStatus = (taskId: string, status: TaskStatus) =>
  sendRequest<{ status: TaskStatus }, Task>(`/tasks/${taskId}/status`, { status });
