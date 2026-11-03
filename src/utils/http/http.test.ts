import { AxiosError, type AxiosResponse } from 'axios';

import { extractErrorMessage } from './http';

const createError = (data: unknown, message = 'Request failed'): AxiosError =>
  new AxiosError(message, undefined, undefined, undefined, {
    data,
    status: 400,
    statusText: '',
    headers: {},
  } as AxiosResponse);

describe('extractErrorMessage', () => {
  it('returns a string error as is', () => {
    expect(extractErrorMessage('Oops')).toBe('Oops');
  });

  it('prefers the message from the response body', () => {
    expect(
      extractErrorMessage(createError({ message: 'Bad credentials' }))
    ).toBe('Bad credentials');
  });

  it('falls back to the axios error message', () => {
    expect(extractErrorMessage(createError({}, 'Network Error'))).toBe(
      'Network Error'
    );
  });
});
