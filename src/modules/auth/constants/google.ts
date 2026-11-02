export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  SCRIPT_URL: 'https://accounts.google.com/gsi/client',
  BUTTON_CONFIG: {
    theme: 'outline',
    size: 'large',
  },
} as const;
