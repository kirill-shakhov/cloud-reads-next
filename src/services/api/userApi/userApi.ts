import $api from '@/services/api/createAxiosInstance';

import type { UserFullDTO } from '@/core/types/user';

class UserApi {
  async getUser(): Promise<UserFullDTO> {
    const { data } = await $api.get<UserFullDTO>('/profile');

    return data;
  }
}

export const userApi = new UserApi();
