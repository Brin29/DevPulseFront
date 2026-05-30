import api from "./api";

export const paramsService = {
  fetchMembersParams: (teamId: string) => api.get(`/teams/${teamId}/members`).then((r) => r.data)
}