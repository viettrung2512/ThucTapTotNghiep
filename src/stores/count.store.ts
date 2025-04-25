import { create } from "zustand";

export interface CounterState {
   count: number;
   increment: () => void;
   decrement: () => void;
}

export const createCounterStore = () =>
   create<CounterState>()((set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
   }));
