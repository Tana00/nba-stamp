import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the initial state
const initialState = {
  accessToken: null,
  expiryTime: null,
  availableQty: null,
  downloadStatus: null,
  name: null,
  email: null,
  isVerified: null,
  stampSignature: null,
  enrolmentNo: null,
  forgotPasswordData: null,
  setLoginData: () => {},
  clearLoginData: () => {},
  isTokenExpired: () => true,
  setDownloadStatus: () => {},
  setEmail: () => {},
  setEnrolmentNo: () => {},
  setIsVerified: () => {},
  setStampSignature: () => {},
  resetStampSignature: () => {},
  setForgotPasswordData: () => {},
};

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      ...initialState,
      setLoginData: ({ token, tokenExpires, availableQty, firstName, lastName }) =>
        set({ accessToken: token, expiryTime: tokenExpires, availableQty, name: `${firstName} ${lastName}` }),
      clearLoginData: () => set(initialState), // Reset to initialState
      isTokenExpired: () => {
        const { expiryTime } = get();
        if (!expiryTime) return true; // Treat as expired if no expiry time is set
        const currentTime = new Date();
        const tokenExpiryTime = new Date(expiryTime);
        return currentTime >= tokenExpiryTime;
      },
      setDownloadStatus: (status) => set({ downloadStatus: status }),
      setEmail: (email) => set({ email }),
      setEnrolmentNo: (enrolmentNo) => set({ enrolmentNo }),
      setIsVerified: (res) => set({ isVerified: res }),
      setStampSignature: (res) => set({ stampSignature: res }),
      resetStampSignature: () => set({ stampSignature: null }),
      setForgotPasswordData: (res) => set({ forgotPasswordData: res }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
