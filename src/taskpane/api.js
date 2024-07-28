// src/api.ts
import axios from "axios";
import { useAuthStore } from "./store";

const api = axios.create({
  baseURL: "https://api.stampandseal-qa.lawpavilion.com/api/v1",
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const register = async (payload) => {
  try {
    const response = await api.post("/Account/create-user", { ...payload });

    // Save the registered email in Zustand store
    const { setEmail } = useAuthStore.getState();
    setEmail(payload.email);

    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const verifyOTP = async (otp) => {
  const { setIsVerified } = useAuthStore.getState();
  try {
    const response = await api.get(`/Account/verify-otp/${otp}`);
    const { data } = response.data;

    // Save the response in Zustand store
    setIsVerified(data);

    return response.data;
  } catch (error) {
    console.error("Error verifying:", error);
    setIsVerified(false);
    throw error;
  }
};

export const login = async (enrolmentNo, passcode) => {
  try {
    const response = await api.post("/Account/authenticate", { enrolmentNo, passcode });
    const { data } = response.data;
    // Save the access token in Zustand store
    const { setLoginData } = useAuthStore.getState();
    setLoginData(data);

    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getDashboardData = async () => {
  try {
    const response = await api.get("/Dashboard/overview");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
