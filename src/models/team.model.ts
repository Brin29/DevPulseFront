export type UserRole = "admin" | "developer" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  slug: string;
  logo?: string;
  members: TeamMember[];
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  slug: string;
  logo?: string;
}


export interface UpdateTeamRequest {
  name: string;
  description: string;
  slug: string;
  logo?: string;
}
