export type TaskType = "bug" | "incident" | "improvement" | "task";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  assignee?: string;
}
