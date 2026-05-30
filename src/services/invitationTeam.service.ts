import type { SendInvitationModel } from "../models/invitationTeams.models";
import type { GetParams } from "../models/parms.model";
import api, { sendRequest } from "./api";

export const invitationTeamService = {
  fetchInvitationByIdTeam: (params: GetParams, id: string) =>
    api.get(`/teams/${id}/invitations`, { params }).then((r) => r.data),

  sendInvitation: (id: string, payload: SendInvitationModel) =>
    sendRequest<SendInvitationModel, { id: string }>(
      `/teams/${id}/invitations`,
      payload,
    ).then((r) => r.data),

  acceptInvitation: (token: string) =>
    api.post(`/teams/invitations/${token}/accept`).then((r) => r.data),

  cancelInvitation: (token: string) =>
    api.patch(`/teams/invitations/${token}/cancel`).then((r) => r.data),

  deleteInvitation: (id: string) =>
    api.delete(`/teams/invitations/${id}`).then((r) => r.data),
};
