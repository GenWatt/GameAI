import { create } from "zustand";

interface ConnectionError {
  type: "network" | "timeout" | "server" | "unknown";
  message: string;
  timestamp: string;
  retryable: boolean;
}

export type StatusType = "loading" | "online" | "offline";

interface ConnectionState {
  status: StatusType;
  error: ConnectionError | null;
  retryCount: number;

  setConnectionError: (error: ConnectionError | null) => void;
  setStatus: (status: StatusType) => void;
  incrementRetry: () => void;
  resetRetry: () => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: "loading",
  error: null,
  retryCount: 0,

  setConnectionError: (error) => set({ error }),
  setStatus: (status) => set({ status }),
  incrementRetry: () => set((state) => ({ retryCount: state.retryCount + 1 })),
  resetRetry: () => set({ retryCount: 0 }),
}));
