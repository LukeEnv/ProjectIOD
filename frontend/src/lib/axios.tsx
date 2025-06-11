import axios from "axios";
import { useTokenContext } from "@/lib/contexts/token";
import { useMemo } from "react";

export const api = axios.create({
  baseURL: "/api/v1",
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
      baseURL: "/api/v1",
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
        if (error.response?.status === 401 && refreshAccessToken) {
          try {
            await refreshAccessToken();
            // Retry the original request with the new token
            if (accessToken) {
              error.config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return instance.request(error.config);
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
