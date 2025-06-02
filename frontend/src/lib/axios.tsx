import axios from "axios";

// Access token is set by the useAuth context
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // Ensures cookies (refresh token) are sent
});

// **Request Interceptor** - Attach Access Token to API calls
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// **Response Interceptor** - Refresh token on 401 error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        console.log("Access token expired, refreshing...");
        const res = await axios.post(
          "/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );

        setAccessToken(res.data.token); // Store new access token

        // Retry the failed request with the new token
        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        console.error("Failed to refresh token, logging out...");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// **SWR Fetcher Function**
const fetcher = (url: string) => api.get(url).then((res) => res.data);

export { api, fetcher };
// Do NOT export accessToken directly. Only set via setAccessToken from useAuth.
