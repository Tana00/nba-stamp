import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiryTime: null,
      availableQty: null,
      downloadStatus: null,
      name: null,
      email: null,
      isVerified: null,
      setLoginData: ({ token, tokenExpires, availableQty, firstName, lastName }) =>
        set({ accessToken: token, expiryTime: tokenExpires, availableQty, name: `${firstName} ${lastName}` }),
      clearLoginData: () => set({ accessToken: null, expiryTime: null, availableQty: null }),
      isTokenExpired: () => {
        const { expiryTime } = get();
        if (!expiryTime) return true; // Treat as expired if no expiry time is set
        const currentTime = new Date();
        const tokenExpiryTime = new Date(expiryTime);
        return currentTime >= tokenExpiryTime;
      },
      setDownloadStatus: (status) => set({ downloadStatus: status }),
      setEmail: (email) => set({ email }),
      setIsVerified: (res) => set({ isVerified: res }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
