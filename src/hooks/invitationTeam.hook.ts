import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationTeamService } from "../services/invitationTeam.service";
import type { SendInvitationModel } from "../models/invitationTeams.models";
import type { GetParams } from "../models/parms.model";
import type { ApiResponseError } from "../models/api.model";

export const invitationTeamServiceKey = {
  all: ["invitations"] as const,
  lists: () => [...invitationTeamServiceKey.all, "list"] as const,
  list: (params: GetParams, id: string) =>
    [...invitationTeamServiceKey.lists(), params, id] as const,
  details: () => [...invitationTeamServiceKey.all, "detail"] as const,
  detail: (id: string) => [...invitationTeamServiceKey.details(), id] as const,
};

export const useInvitationsTeam = (params: GetParams, id: string) => {
  return useQuery({
    queryKey: invitationTeamServiceKey.list(params, id!),
    queryFn: () => invitationTeamService.fetchInvitationByIdTeam(params, id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useTeamInvitationMutations = () => {
  const queryClient = useQueryClient();

  // const invalidateInvitations = async () => {
  //   if (!teamId) return;

  //   await queryClient.invalidateQueries({
  //     queryKey: invitationTeamServiceKey.detail(teamId),
  //   });
  // };

  const sendInvitationMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SendInvitationModel;
    }) => invitationTeamService.sendInvitation(id, payload),
    // onSuccess: async () => {
    //   await invalidateInvitations();
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.all,
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: (token: string) =>
      invitationTeamService.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.all,
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: (token: string) =>
      invitationTeamService.cancelInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.all,
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  const deleteInvitationMutation = useMutation({
    mutationFn: (id: string) => invitationTeamService.deleteInvitation(id),
    // onSuccess: async () => {
    //   await invalidateInvitations();
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.all,
      });
    },
    onError: (error: ApiResponseError) => {
      console.log(error);
    },
  });

  return {
    sendInvitation: sendInvitationMutation,
    acceptInvitation: acceptInvitationMutation,
    cancelInvitation: cancelInvitationMutation,
    deleteInvitation: deleteInvitationMutation,
  };
};
