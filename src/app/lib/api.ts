<<<<<<< HEAD
<<<<<<< HEAD
import { clearAuthToken, loadAuthToken } from "./auth-storage";

const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000";
const API_URL = `${API_BASE_URL.replace(/\/$/, "")}/api`;

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = loadAuthToken();
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      clearAuthToken();
    }

    const error = new Error(payload?.message ?? "Request failed.");
    // @ts-expect-error custom fields
    error.errors = payload?.errors ?? [];
    throw error;
  }

  return payload;
}

export function getErrorMessage(error: unknown, fallbackMessage: string) {
=======
=======
>>>>>>> e91372e (initial commit)
import axios from "axios";
import { loadAuthToken } from "./auth-storage";
import type { ApiEnvelope, ApiFieldError } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000/api",
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

<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> e91372e (initial commit)

export function getApiFieldErrors(error: unknown): ApiFieldError[] {
  if (axios.isAxiosError<ApiEnvelope<unknown>>(error)) {
    return error.response?.data?.errors ?? [];
  }

  return [];
}

export default api;
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
