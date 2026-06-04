import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreateTeamRequest,
  UpdateTeamRequest,
} from "../models/team.model";
import { teamService } from "../services/team.service";
import type { ApiResponseError } from "../models/api.model";
// import { createTeam, getTeams } from "../services/team.service";

export const teamServiceKey = {
  all: ["teams"] as const,
  lists: () => [...teamServiceKey.all, "list"] as const,
  list: () => [...teamServiceKey.lists()] as const,
  details: () => [...teamServiceKey.all, "detail"] as const,
  detail: (id: string) => [...teamServiceKey.details(), id] as const,
};

export const useTeams = () => {
  return useQuery({
    queryKey: teamServiceKey.lists(),
    queryFn: () => teamService.fetchAllTeam(),
    placeholderData: keepPreviousData,
  });
};

export const useTeam = (id: string) => {
  return useQuery({
    queryKey: teamServiceKey.detail(id!),
    queryFn: () => teamService.fetchTeamById(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useTeamMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: CreateTeamRequest) => teamService.createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: teamServiceKey.lists(),
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTeamRequest }) =>
      teamService.editTeam(id, payload),
    onSuccess: (_, variables) => {
      (queryClient.invalidateQueries({
        queryKey: teamServiceKey.detail(variables.id),
      }),
        queryClient.invalidateQueries({
          queryKey: teamServiceKey.lists(),
        }));
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamServiceKey.lists() });
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
