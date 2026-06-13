import Header from '../components/organism/Header';
import api from './api';

export const registerAPI = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const loginAPI = async (payload) => {
  const response = await api.post("/auth", payload);
  return response.data;
}
export const activateAPI = async (payload) => {
  const response = await api.post("/auth/register/activate", payload);
  return response.data;
}
export const resendOTPAPI = async (payload) => {
  const response = await api.post("/auth/register/resend-otp", payload);
  return response.data;
}

export const forgotPasswordAPI = async (payload) => {
  const response = await api.post("/auth/check-email", payload);
  return response.data;
};

export const verifyResetOtpAPI = async (payload) => {
  const response = await api.post("/auth/check-email/verify-otp", payload);
  return response.data;
};

export const resetPasswordAPI = async (payload) => {
  const response = await api.post("/auth/check-email/verify-otp/reset", payload);
  return response.data;
};
export const logoutAPI = async (token) => {
  const response = await api.delete("/auth/logout", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};