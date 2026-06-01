export type TaskType = "BUG" | "FEAUTERE" | "TASK";
export type TaskStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface Task {
  _id: string;
  title: string;
  description: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: { lastName: string; firstName: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: string;
  assigneeId: string;
  dueDate: string;
  type: string;
}

export interface UpdateTaskRequest {
  _id: string;
  title: string;
  description: string;
  priority: string;
  assigneeId: string;
  dueDate: string;
  type: string;
}


export interface UpdateStatusTaskRequest {
  status: TaskStatus;
}

export interface CreateTaskCommentRequest {
  content: string;
}

export interface UpdateTaskCommentRequest {
  content: string;
}