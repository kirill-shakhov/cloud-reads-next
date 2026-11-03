import axios, {
  type AxiosAdapter,
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { ACCESS_TOKEN_STORAGE_KEY } from '@/modules/auth/constants';

import $api from './createAxiosInstance';

interface Reply {
  status: number;
  data?: unknown;
}

const respond = (
  config: InternalAxiosRequestConfig,
  { status, data = {} }: Reply
): Promise<AxiosResponse> => {
  const response = { data, status, statusText: '', headers: {}, config };

  if (status >= 200 && status < 300) {
    return Promise.resolve(response);
  }

  return Promise.reject(
    new AxiosError(
      'Request failed',
      AxiosError.ERR_BAD_REQUEST,
      config,
      null,
      response
    )
  );
};

describe('$api interceptors', () => {
  const adapter = vi.fn<AxiosAdapter>();
  let replies: Reply[] = [];

  beforeEach(() => {
    localStorage.clear();
    adapter.mockReset();
    adapter.mockImplementation((config) =>
      respond(config, replies.shift() ?? { status: 200 })
    );
    $api.defaults.adapter = adapter;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('attaches the stored token as a Bearer header', async () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'token-1');
    replies = [{ status: 200 }];

    await $api.get('/profile');

    expect(adapter.mock.calls[0][0].headers.get('Authorization')).toBe(
      'Bearer token-1'
    );
  });

  it('refreshes the token once on 401 and retries the request', async () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'expired');
    replies = [{ status: 401 }, { status: 200, data: { ok: true } }];
    const refresh = vi
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { accessToken: 'fresh' } });

    const response = await $api.get('/profile');

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(response.data).toEqual({ ok: true });
    expect(adapter).toHaveBeenCalledTimes(2);
    expect(adapter.mock.calls[1][0].headers.get('Authorization')).toBe(
      'Bearer fresh'
    );
    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('fresh');
  });

  it('clears the token and rejects when the refresh fails', async () => {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'expired');
    replies = [{ status: 401 }];
    vi.spyOn(axios, 'get').mockRejectedValue(new Error('refresh failed'));

    await expect($api.get('/profile')).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('does not retry a request that is still unauthorized after a refresh', async () => {
    replies = [{ status: 401 }, { status: 401 }];
    const refresh = vi
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: { accessToken: 'fresh' } });

    await expect($api.get('/profile')).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(refresh).toHaveBeenCalledTimes(1);
    expect(adapter).toHaveBeenCalledTimes(2);
  });

  it.each(['auth/login', 'auth/google', 'auth/2fa/verify'])(
    'does not refresh the token when %s returns 401',
    async (url) => {
      localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'temp-token');
      replies = [{ status: 401 }];
      const refresh = vi.spyOn(axios, 'get');

      await expect($api.post(url, {})).rejects.toMatchObject({
        response: { status: 401 },
      });

      expect(refresh).not.toHaveBeenCalled();
      expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('temp-token');
    }
  );
});
