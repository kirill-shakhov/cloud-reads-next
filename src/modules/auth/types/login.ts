export interface IUser {
  email: string;
  id: string;
  isActivated: boolean;
  roles: Array<string>;
}

export type LoginStatus = 'success' | 'two-factor-required' | 'error';
