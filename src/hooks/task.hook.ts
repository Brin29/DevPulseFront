import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateTaskRequest, TaskStatus } from "../models/task.model";
import { createTask, getTasks, updateTaskStatus } from "../services/task.service";

export const taskServiceKey = {
  all: ["tasks"] as const,
  lists: () => [...taskServiceKey.all, "list"] as const,
};

export const useTasks = (teamId?: string) => {
  return useQuery({
    queryKey: teamId
      ? [...taskServiceKey.lists(), teamId]
      : taskServiceKey.lists(),
    queryFn: () => getTasks(teamId),
    select: (response) => response.data,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskRequest) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskServiceKey.lists() });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskServiceKey.lists() });
    },
  });
};
