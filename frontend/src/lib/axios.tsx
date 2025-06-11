import axios from "axios";
import { useTokenContext } from "@/lib/contexts/token";
import { useMemo } from "react";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// **SWR Fetcher Function**
export const fetcher = (url: string, accessToken?: string | null) =>
  api
    .get(url, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    })
    .then((res) => res.data);

export function useAuthAxios() {
  const { accessToken, refreshAccessToken } = useTokenContext();

  return useMemo(() => {
    const instance = axios.create({
      baseURL: "/api",
      withCredentials: true,
    });

    // Request interceptor: attach token
    instance.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 and refresh
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // Prevent infinite loop: don't try to refresh if already on refresh endpoint
        if (
          error.response?.status === 401 &&
          refreshAccessToken &&
          !originalRequest._retry &&
          !originalRequest.url.includes("/auth/refresh-token")
        ) {
          originalRequest._retry = true;
          try {
            await refreshAccessToken();
            // Retry the original request with the new token
            if (accessToken) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
            return instance.request(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [accessToken, refreshAccessToken]);
}
