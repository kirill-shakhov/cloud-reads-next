import type { AxiosError } from 'axios';

export function extractErrorMessage(error: AxiosError | string): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error.response) {
    const data = error.response.data;

    if (typeof data === 'object' && data !== null && 'message' in data) {
      return data.message as string;
    }
  }

  return error.message;
}
