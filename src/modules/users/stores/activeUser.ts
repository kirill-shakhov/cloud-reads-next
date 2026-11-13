import { create } from 'zustand';

import { getQueryClient } from '@/services/api/queryClient';
import { userApi } from '@/services/api/userApi/userApi';

import type { UserFullDTO } from '@/core/types/user';

export const ACTIVE_USER_QUERY_KEY = ['user', 'active'] as const;

interface ActiveUserState {
  user: UserFullDTO | null;
  fetchUser: () => Promise<UserFullDTO>;
  resetUser: () => void;
}

export const useActiveUserStore = create<ActiveUserState>((set) => ({
  user: null,

  fetchUser: async () => {
    const user = await getQueryClient().fetchQuery({
      queryKey: ACTIVE_USER_QUERY_KEY,
      queryFn: () => userApi.getUser(),
    });

    set({ user });

    return user;
  },

  resetUser: () => {
    set({ user: null });
    getQueryClient().removeQueries({ queryKey: ACTIVE_USER_QUERY_KEY });
  },
}));
