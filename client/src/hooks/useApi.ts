import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

interface ApiErrorResponse {
  success: false;
  error: string;
  details?: any;
}

interface ApiSuccessResponse<T> {
  success: true;
  data?: T;
  message?: string;
}

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = useCallback(() => {
    return localStorage.getItem("authToken");
  }, []);

  const request = useCallback(
    async <T,>(
      method: "GET" | "POST" | "PUT" | "DELETE",
      endpoint: string,
      data?: any,
      requiresAuth: boolean = true
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (requiresAuth) {
          const token = getAuthToken();
          if (!token) {
            throw new Error("Não autenticado");
          }
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await axios({
          method,
          url: `${API_BASE_URL}${endpoint}`,
          data,
          headers,
        });

        const result: ApiResponse<T> = response.data;

        if (!result.success) {
          throw new Error(result.error || "Erro na requisição");
        }

        return result.data || null;
      } catch (err) {
        const errorMessage =
          err instanceof AxiosError
            ? err.response?.data?.error || err.message
            : err instanceof Error
            ? err.message
            : "Erro desconhecido";

        setError(errorMessage);
        console.error("API Error:", errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [getAuthToken]
  );

  return {
    loading,
    error,
    get: <T,>(endpoint: string, requiresAuth?: boolean) =>
      request<T>("GET", endpoint, undefined, requiresAuth),
    post: <T,>(endpoint: string, data?: any, requiresAuth?: boolean) =>
      request<T>("POST", endpoint, data, requiresAuth),
    put: <T,>(endpoint: string, data?: any, requiresAuth?: boolean) =>
      request<T>("PUT", endpoint, data, requiresAuth),
    delete: <T,>(endpoint: string, requiresAuth?: boolean) =>
      request<T>("DELETE", endpoint, undefined, requiresAuth),
  };
}
