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
    const { setEmail, setEnrolmentNo } = useAuthStore.getState();
    setEmail(payload.email);
    setEnrolmentNo(payload.enrolmentNo);

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

export const login = async (scn, passcode, email) => {
  try {
    const response = await api.post("/Account/authenticate", { scn, passcode, email });
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

export const forgotPasscode = async (enrolmentNo) => {
  try {
    const response = await api.post("/Account/forgot-passcode", { enrolmentNo });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const verifyForgotPasscodeOTP = async (otp) => {
  try {
    const response = await api.post("/Account/verify-forgot-passcode-otp", { otp });
    const { data } = response.data;
    // Save the access token in Zustand store
    const { setForgotPasswordData } = useAuthStore.getState();
    setForgotPasswordData(data);

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resetPasscode = async (enrolmentNo, passcode, token, confirmPasscode) => {
  try {
    const response = await api.post("/Account/reset-passcode", { enrolmentNo, passcode, confirmPasscode, token });

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const resendOTP = async (enrolmentNo) => {
  try {
    const response = await api.get(`/Account/resend-otp?enrolmentNo=${enrolmentNo}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
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

export const buyStamp = async (payload) => {
  try {
    const response = await api.post("/Stamp/buy", { ...payload });

    return response.data;
  } catch (error) {
    console.error("Error buying stamp:", error);
    throw error;
  }
};

export const affixStamp = async (payload) => {
  try {
    const response = await api.post("/Stamp/affix", { ...payload });

    // Save the stamp signature in Zustand store
    const { setStampSignature } = useAuthStore.getState();
    setStampSignature(response.data?.data);

    return response.data;
  } catch (error) {
    console.error("Error getting stamp signature:", error);
    throw error;
  }
};

export const setQRCode = async (payload) => {
  try {
    const response = await api.post("/Stamp/set-qr-code", { ...payload });

    return response.data;
  } catch (error) {
    console.error("Error setting QR code:", error);
    throw error;
  }
};
