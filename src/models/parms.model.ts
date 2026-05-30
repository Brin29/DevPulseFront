export interface GetParams {
  page?: number;
  ordering?: string;
  limit?: number;
  search?: string;
}

export interface GetTaskParams {
  status?: string;
  priority?: string;
  assigneedId?: string;
  // page?: number;
  // limit?: number;
}