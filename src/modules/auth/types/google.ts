export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
  state?: string;
}

export interface GoogleButtonConfiguration {
  theme?: string;
  size?: string;
}
