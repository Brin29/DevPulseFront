import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreateTaskCommentRequest,
  CreateTaskRequest,
  UpdateStatusTaskRequest,
  UpdateTaskCommentRequest,
  UpdateTaskRequest,
} from "../models/task.model";
import { taskService } from "../services/task.service";
import type { GetTaskParams } from "../models/parms.model";
import { paramsService } from "../services/params.service";
import type { ApiResponseError } from "../models/api.model";

export const taskServiceKey = {
  all: ["task"] as const,
  lists: () => [...taskServiceKey.all, "list"] as const,
  list: (params: GetTaskParams, teamId: string) =>
    [...taskServiceKey.lists(), params, teamId] as const,
  details: () => [...taskServiceKey.all, "detail"] as const,
  detail: (taskId: string, teamId: string) =>
    [...taskServiceKey.details(), taskId, teamId] as const,
  params: () => [...taskServiceKey.all, "params"] as const,
  formParams: (teamId: string) => [...taskServiceKey.params(), teamId] as const,
  comments: (teamId: string, taskId: string) =>
    [...taskServiceKey.all, "comments", teamId, taskId] as const,
};

export const useTasks = (teamId: string, params: GetTaskParams) => {
  return useQuery({
    queryKey: taskServiceKey.list(params, teamId),
    queryFn: () => taskService.fetchAllTask(params, teamId),
    placeholderData: keepPreviousData,
  });
};

export const useTask = (tasktId: string, teamId: string) => {
  return useQuery({
    queryKey: taskServiceKey.detail(tasktId!, teamId),
    queryFn: () => taskService.fetchTaskById(tasktId!, teamId),
    enabled: !!tasktId,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useTaskFormParams = (teamId: string) => {
  return useQuery({
    queryKey: taskServiceKey.formParams(teamId!),
    queryFn: () => paramsService.fetchMembersParams(teamId),
    staleTime: 1000 * 60 * 30,
  });
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({
      teamId,
      payload,
    }: {
      teamId: string;
      payload: CreateTaskRequest;
    }) => taskService.createTask(teamId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskServiceKey.lists() });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      teamId,
      taskId,
      payload,
    }: {
      teamId: string;
      taskId: string;
      payload: UpdateTaskRequest;
    }) => taskService.updateTask(teamId, taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskServiceKey.detail(variables.taskId, variables.teamId),
      });
      queryClient.invalidateQueries({ queryKey: taskServiceKey.lists() });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ teamId, taskId }: { teamId: string; taskId: string }) =>
      taskService.deleteTask(teamId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskServiceKey.lists() });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      teamId,
      taskId,
      payload,
    }: {
      teamId: string;
      taskId: string;
      payload: UpdateStatusTaskRequest;
    }) => taskService.updateStatusTask(teamId, taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskServiceKey.detail(variables.taskId, variables.teamId),
      });
      queryClient.invalidateQueries({ queryKey: taskServiceKey.lists() });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  return {
    create: createMutation,
    edit: editMutation,
    delete: deleteMutation,
    updateStatus: updateStatusMutation,
  };
};

export const useComments = (teamId: string, taskId: string) => {
  return useQuery({
    queryKey: taskServiceKey.comments(teamId, taskId),
    queryFn: () => taskService.fetchAllComments(teamId, taskId),
    enabled: !!teamId && !!taskId,
  });
};

export const useCommentMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: ({
      teamId,
      taskId,
      payload,
    }: {
      teamId: string;
      taskId: string;
      payload: CreateTaskCommentRequest;
    }) => taskService.createComment(teamId, taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskServiceKey.comments(variables.teamId, variables.taskId),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({
      teamId,
      taskId,
      commentId,
      payload,
    }: {
      teamId: string;
      taskId: string;
      commentId: string;
      payload: UpdateTaskCommentRequest;
    }) => taskService.updateComment(teamId, taskId, commentId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskServiceKey.comments(variables.teamId, variables.taskId),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      teamId,
      taskId,
      commentId,
    }: {
      teamId: string;
      taskId: string;
      commentId: string;
    }) => taskService.deleteComment(teamId, taskId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: taskServiceKey.comments(variables.teamId, variables.taskId),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  return {
    create: createMutation,
    edit: editMutation,
    delete: deleteMutation,
  };
};
