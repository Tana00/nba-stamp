import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiryTime: null,
      availableQty: null,
      downloadStatus: null,
      setLoginData: ({ token, tokenExpires, availableQty }) =>
        set({ accessToken: token, expiryTime: tokenExpires, availableQty }),
      clearLoginData: () => set({ accessToken: null, expiryTime: null, availableQty: null }),
      isTokenExpired: () => {
        const { expiryTime } = get();
        if (!expiryTime) return true; // Treat as expired if no expiry time is set
        const currentTime = new Date();
        const tokenExpiryTime = new Date(expiryTime);
        return currentTime >= tokenExpiryTime;
      },
      setDownloadStatus: (status) => set({ downloadStatus: status }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
