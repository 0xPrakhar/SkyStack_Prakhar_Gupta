import axios from "axios";
import { loadAuthToken } from "./auth-storage";
import type { ApiEnvelope, ApiFieldError } from "../types";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: `${baseUrl.replace(/\/$/, "")}/api`,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = loadAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiError(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again.",
) {
  if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
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
