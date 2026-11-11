'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

import { GOOGLE_CONFIG } from '@/modules/auth/constants';
import type { GoogleCredentialResponse } from '@/modules/auth/types';

import i18n from '@/i18n';

interface GoogleSignInButtonProps {
  onLogin: (credential: string) => void;
}

export function GoogleSignInButton({ onLogin }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const onLoginRef = useRef(onLogin);
  const [isScriptReady, setIsScriptReady] = useState<boolean>(false);

  useEffect(() => {
    onLoginRef.current = onLogin;
  }, [onLogin]);

  useEffect(() => {
    if (!isScriptReady || !buttonRef.current || !window.google) {
      return;
    }

    const clientId = GOOGLE_CONFIG.CLIENT_ID?.trim();

    if (!clientId) {
      // eslint-disable-next-line no-console
      console.error(i18n.t('errors.auth.google.missingClientId'));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: GoogleCredentialResponse) =>
        onLoginRef.current(response.credential),
    });

    window.google.accounts.id.renderButton(
      buttonRef.current,
      GOOGLE_CONFIG.BUTTON_CONFIG
    );
  }, [isScriptReady]);

  return (
    <>
      <Script
        src={GOOGLE_CONFIG.SCRIPT_URL}
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div ref={buttonRef} />
    </>
  );
}
