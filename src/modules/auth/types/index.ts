export interface IUser {
  email: string;
  id: string;
  isActivated: boolean;
  roles: Array<string>;
}

export type RegistrationStep = 1 | 2 | 3 | 4;

export interface RegistrationData {
  username: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  image: File | null;
  country: string;
  bio: string;
}
