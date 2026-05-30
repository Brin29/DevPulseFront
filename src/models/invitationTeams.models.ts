export interface SendInvitationModel {
  email: string;
  role: string;
}

export interface Invitation {
  _id: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
}
