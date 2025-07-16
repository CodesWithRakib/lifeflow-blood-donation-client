import axios from "axios";

// Explicitly set the base URL (helps with debugging)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://blood-donation-server-dun.vercel.app";

const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`, // Ensure /api matches your backend route
  withCredentials: true,
});

// Request interceptor to add headers
axiosInstance.interceptors.request.use((config) => {
  console.log(
    `[AXIOS] Sending ${config.method?.toUpperCase()} to ${config.url}`
  );
  return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(`[AXIOS Error]`, error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.warn("Authentication error - redirecting to login");
      // window.location.href = "/login"; // Uncomment if needed
    }
    return Promise.reject(error);
  }
);

const useAxios = () => axiosInstance;
export default useAxios;
