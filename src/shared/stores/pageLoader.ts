import { create } from 'zustand';

const MINIMUM_LOADING_TIME = 500;

interface PageLoaderState {
  activeRequestsCount: number;
  showPageLoader: () => void;
  hidePageLoader: () => void;
}

let startTime = 0;

export const usePageLoaderStore = create<PageLoaderState>((set, get) => {
  const decrementQueue = (): void => {
    set((state) => ({
      activeRequestsCount: Math.max(0, state.activeRequestsCount - 1),
    }));

    if (get().activeRequestsCount === 0) {
      startTime = 0;
    }
  };

  return {
    activeRequestsCount: 0,

    showPageLoader: () => {
      if (startTime === 0) {
        startTime = Date.now();
      }

      set((state) => ({ activeRequestsCount: state.activeRequestsCount + 1 }));
    },

    // Every hide gets its own timer so overlapping requests never leave the loader stuck.
    hidePageLoader: () => {
      const timeFromStart = Date.now() - startTime;

      if (timeFromStart >= MINIMUM_LOADING_TIME) {
        decrementQueue();
        return;
      }

      setTimeout(decrementQueue, MINIMUM_LOADING_TIME - timeFromStart);
    },
  };
});

export const selectIsPageLoading = (state: PageLoaderState): boolean =>
  state.activeRequestsCount > 0;
