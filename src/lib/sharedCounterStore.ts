type Listener = () => void;

export interface SharedCounterStore {
  getSnapshot: () => number;
  subscribe: (listener: Listener) => () => void;
  increment: (step?: number) => void;
  decrement: (step?: number) => void;
  reset: () => void;
}

const STORE_KEY = '__webflowSharedCounter';

const createStore = (): SharedCounterStore => {
  let count = 0;
  const listeners = new Set<Listener>();
  const emit = () => listeners.forEach((l) => l());

  return {
    getSnapshot: () => count,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    increment: (step = 1) => {
      count += step;
      emit();
    },
    decrement: (step = 1) => {
      count -= step;
      emit();
    },
    reset: () => {
      count = 0;
      emit();
    },
  };
};

const getGlobal = (): Record<string, unknown> => {
  if (typeof window !== 'undefined') return window as unknown as Record<string, unknown>;
  if (typeof globalThis !== 'undefined') return globalThis as unknown as Record<string, unknown>;
  return {};
};

export const sharedCounterStore: SharedCounterStore = (() => {
  const g = getGlobal();
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = createStore();
  }
  return g[STORE_KEY] as SharedCounterStore;
})();
