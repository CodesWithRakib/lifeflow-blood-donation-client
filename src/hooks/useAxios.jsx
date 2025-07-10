import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Always send cookies
});

// Only attach a response interceptor if you want to catch 401/403 errors
let interceptorsSet = false;

const useAxios = () => {
  if (!interceptorsSet) {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn(
            "🔐 Unauthorized - token cookie may be missing or expired"
          );
          // Optionally redirect:
          // window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
    interceptorsSet = true;
  }
  return axiosInstance;
};

export default useAxios;
