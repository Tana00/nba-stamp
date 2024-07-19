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

export const login = async (enrolmentNo, passcode) => {
  try {
    const response = await api.post("/Account/authenticate", { enrolmentNo, passcode });
    const { token } = response.data.data;
    // Save the access token in Zustand store
    const { setAccessToken } = useAuthStore.getState();
    setAccessToken(token);

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
