import { GOOGLE_CONFIG } from '@/modules/auth/constants';

export function insertGoogleScriptTag(): Promise<boolean> {
  if (window.google) {
    return Promise.resolve(true);
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = GOOGLE_CONFIG.SCRIPT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.append(script);
  });
}
