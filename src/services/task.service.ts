import type { GetTaskParams } from "../models/parms.model";
import type {
  CreateTaskCommentRequest,
  CreateTaskRequest,
  UpdateStatusTaskRequest,
  UpdateTaskCommentRequest,
  UpdateTaskRequest,
} from "../models/task.model";
import api, { sendRequest } from "./api";

export const taskService = {
  fetchAllTask: (params: GetTaskParams, teamId: string) =>
    api.get(`/teams/${teamId}/tasks`, { params }).then((r) => r.data),

  fetchTaskById: (taskId: string, teamId: string) =>
    api.get(`/teams/${teamId}/tasks/${taskId}`).then((r) => r.data),

  createTask: (teamId: string, payload: CreateTaskRequest) =>
    sendRequest<CreateTaskRequest, { id: string }>(
      `/teams/${teamId}/tasks`,
      payload,
    ).then((r) => r.data),

  updateTask: (teamId: string, taskId: string, payload: UpdateTaskRequest) =>
    sendRequest<UpdateTaskRequest, { id: string }>(
      `/teams/${teamId}/tasks/${taskId}`,
      payload,
      undefined,
      "put"
    ).then((r) => r.data),

  deleteTask: (teamId: string, taskId: string) =>
    api.delete(`/teams/${teamId}/tasks/${taskId}`).then((r) => r.data),

  updateStatusTask: (teamId: string, taskId: string, payload: UpdateStatusTaskRequest) => 
    sendRequest<UpdateStatusTaskRequest, { id: string }>(`/teams/${teamId}/tasks/${taskId}/status`, payload, undefined, "patch").then((r) => r.data),

  createComment: (teamId: string, taskId: string, payload: CreateTaskCommentRequest) => 
    sendRequest<CreateTaskCommentRequest, { id: string }>(`/teams/${teamId}/tasks/${taskId}/comments`, payload).then((r) => r.data),

  fetchAllComments: (teamId: string, taskId: string) => 
    api.get(`/teams/${teamId}/tasks/${taskId}/comments`).then((r) => r.data),

  updateComment: (teamId: string, taskId: string, commentId: string, payload: UpdateTaskCommentRequest) => 
    sendRequest<UpdateTaskCommentRequest, { id: string }>(`/teams/${teamId}/tasks/${taskId}/comments/${commentId}`, payload).then((r) => r.data),

  deleteComment: (teamId: string, taskId: string, commentId: string,) => 
    api.delete(`/teams/${teamId}/tasks/${taskId}/comments/${commentId}`).then((r) => r.data)
};