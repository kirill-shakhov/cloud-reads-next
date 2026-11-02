export interface IUser {
  email: string;
  id: string;
  isActivated: boolean;
  roles: Array<string>;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  state?: string;
}

export type RegistrationStep = 1 | 2 | 3 | 4;
