import type {
  CreateTeamRequest,
  UpdateTeamRequest,
} from "../models/team.model";
import api, { sendRequest } from "./api";

export const teamService = {
  fetchAllTeam: () => api.get(`/teams`, {}).then((r) => r.data.teams),

  fetchTeamById: (id: string) => api.get(`/teams/${id}`).then((r) => r.data),

  createTeam: (payload: CreateTeamRequest) =>
    sendRequest<CreateTeamRequest, { id: string }>(`/teams`, payload).then((r) => r.data),

  editTeam: (id: string, payload: UpdateTeamRequest) =>
    sendRequest<UpdateTeamRequest, { id: string}>(`/teams/${id}`, payload, undefined, "put").then((r) => r.data),

  deleteTeam: (id: string) => api.delete(`/teams/${id}`).then((r) => r.data),
};