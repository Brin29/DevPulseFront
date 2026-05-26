import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationTeamService } from "../services/invitationTeam.service";
import type { SendInvitationModel } from "../models/invitationTeams.models";

export const invitationTeamServiceKey = {
  all: ["invitations"] as const,
  lists: () => [...invitationTeamServiceKey.all, "list"] as const,
  list: () => [...invitationTeamServiceKey.lists()] as const,
  details: () => [...invitationTeamServiceKey.all, "detail"] as const,
  detail: (id: string) => [...invitationTeamServiceKey.details(), id] as const,
};

export const useInvitationsTeam = (id: string) => {
  return useQuery({
    queryKey: invitationTeamServiceKey.detail(id!),
    queryFn: () => invitationTeamService.fetchInvitationByIdTeam(id!),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};

export const useTeamInvitationMutations = () => {
  const queryClient = useQueryClient();

  const sendInvitationMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SendInvitationModel;
    }) => invitationTeamService.sendInvitation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.lists(),
      });
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: (token: string) =>
      invitationTeamService.acceptInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.lists(),
      });
    },
  });

  const deleteInvitationMutation = useMutation({
    mutationFn: (id: string) => invitationTeamService.deleteInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationTeamServiceKey.lists(),
      });
    },
  });

  return {
    sendInvitation: sendInvitationMutation,
    acceptInvitation: acceptInvitationMutation,
    deleteInvitation: deleteInvitationMutation,
  };
};
