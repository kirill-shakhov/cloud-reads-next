import { APP_ROUTES } from '@/shared/constants/routes';

import { buildUrl } from './buildUrl';

describe('buildUrl', () => {
  it('returns the page path without query parameters', () => {
    expect(buildUrl(APP_ROUTES.AUTH_LOGIN)).toBe('/auth/login');
  });

  it('encodes query parameter values', () => {
    expect(
      buildUrl(APP_ROUTES.AUTH_EMAIL_SENT, {
        email: 'john+test@example.com',
      })
    ).toBe('/auth/email-sent?email=john%2Btest%40example.com');
  });

  it('serializes number and boolean query parameters', () => {
    expect(
      buildUrl(APP_ROUTES.AUTH_EMAIL_CONFIRMATION, {
        attempt: 2,
        verified: false,
      })
    ).toBe('/auth/email-confirmation?attempt=2&verified=false');
  });
});
