import { create } from 'zustand';

import { userApi } from '@/services/api/userApi/userApi';

import type { UserFullDTO } from '@/core/types/user';

interface ActiveUserState {
  user: UserFullDTO | null;
  fetchUser: () => Promise<UserFullDTO>;
  resetUser: () => void;
}

export const useActiveUserStore = create<ActiveUserState>((set) => ({
  user: null,

  fetchUser: async () => {
    const user = await userApi.getUser();

    set({ user });

    return user;
  },

  resetUser: () => set({ user: null }),
}));
