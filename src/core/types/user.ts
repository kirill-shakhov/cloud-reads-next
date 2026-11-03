export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserSettings {
  isDarkModeEnabled: boolean;
}

export interface UserFullDTO {
  id: string;
  isOnline?: boolean;
  activationLink: string;
  email: string;
  country: string | null;
  bio?: string | null;
  username: string;
  firstName: string;
  image: string;
  isActivated: boolean;
  lastName: string;
  roles: Role[];
  twoFactorEnabled: boolean;
  userSettings: UserSettings;
}
