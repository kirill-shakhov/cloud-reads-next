import type {
  GoogleButtonConfiguration,
  GoogleCredentialResponse,
} from '@/modules/auth/types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          prompt: () => void;
          renderButton: (
            parent: HTMLElement,
            options: GoogleButtonConfiguration,
            clickHandler?: () => void
          ) => void;
        };
      };
    };
  }
}
