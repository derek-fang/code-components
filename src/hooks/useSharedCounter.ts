import * as React from 'react';
import { sharedCounterStore } from '../lib/sharedCounterStore';

export const useSharedCounter = () => {
  const count = React.useSyncExternalStore(
    sharedCounterStore.subscribe,
    sharedCounterStore.getSnapshot,
    sharedCounterStore.getSnapshot,
  );

  return {
    count,
    increment: sharedCounterStore.increment,
    decrement: sharedCounterStore.decrement,
    reset: sharedCounterStore.reset,
  };
};
