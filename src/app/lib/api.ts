import axios from "axios";
import { clearAuthToken, loadAuthToken } from "./auth-storage";
import type { ApiEnvelope, ApiFieldError } from "../types";

function resolveApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname, origin } = window.location;
    const isLocalHost = hostname === "localhost" || hostname === "127.0.0.1";

    if (isLocalHost) {
      return "http://127.0.0.1:5000";
    }

    return origin;
  }

  return "http://127.0.0.1:5000";
}

const api = axios.create({
  baseURL: `${resolveApiBaseUrl()}/api`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = loadAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthToken();
    }

    return Promise.reject(error);
  },
);

export function getApiError(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
    if (!error.response) {
      return "We could not reach the server. Please check the API URL and try again.";
    }

    const response = error.response?.data;

    if (response?.errors?.length) {
      return response.errors[0].message;
    }

    return response?.message ?? fallbackMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}

export function getApiFieldErrors(error: unknown): ApiFieldError[] {
  if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
    return error.response?.data?.errors ?? [];
  }

  return [];
}

export default api;
