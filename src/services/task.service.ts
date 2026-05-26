import type { CreateTaskRequest, Task, TaskStatus } from "../models/task.model";
import { sendRequest } from "./api";

export const getTasks = () =>
  sendRequest<undefined, Task[]>("/tasks", undefined, {}, "post");

export const createTask = (payload: CreateTaskRequest) =>
  sendRequest<CreateTaskRequest, Task>("/tasks", payload);

export const updateTaskStatus = (taskId: string, status: TaskStatus) =>
  sendRequest<{ status: TaskStatus }, Task>(`/tasks/${taskId}/status`, { status });
