import { QueryClient } from '@tanstack/react-query';

import { getQueryClient } from './queryClient';

describe('getQueryClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the same instance across calls in the browser', () => {
    const first = getQueryClient();

    expect(first).toBeInstanceOf(QueryClient);
    expect(getQueryClient()).toBe(first);
  });

  it('returns a new instance on every call when window is undefined', () => {
    vi.stubGlobal('window', undefined);

    expect(getQueryClient()).not.toBe(getQueryClient());
  });
});
