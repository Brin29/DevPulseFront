import type { SendInvitationModel } from "../models/invitationTeams.models";
import api, { sendRequest } from "./api";

export const invitationTeamService = {
  fetchInvitationByIdTeam: (id: string) =>
    api.get(`/teams/${id}/invitations`).then((r) => r.data),

  sendInvitation: (id: string, payload: SendInvitationModel) =>
    sendRequest<SendInvitationModel, { id: string }>(
      `/teams/${id}/invitations`,
      payload,
    ).then((r) => r.data),

  acceptInvitation: (token: string) =>
    api.post(`/teams/invitation/${token}/accept`).then((r) => r.data),

  deleteInvitation: (id: string) =>
    api.delete(`/teams/invitations/${id}`).then((r) => r.data),
};
