import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // send cookies with requests
});

// Function to attach JWT token from localStorage or cookie to Authorization header
const attachToken = (config) => {
  // Try to get token from localStorage
  let token = localStorage.getItem("accessToken");

  // If no token in localStorage, try to get from cookie named "jwt"
  if (!token) {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("jwt="))
      ?.split("=")[1];
    token = cookieToken;
  }

  // If token found, attach to headers
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

// To ensure interceptors are added only once
let interceptorsSet = false;

const useAxios = () => {
  if (!interceptorsSet) {
    // Request interceptor to add token
    axiosInstance.interceptors.request.use(attachToken, (error) =>
      Promise.reject(error)
    );

    // Response interceptor to handle unauthorized or forbidden errors
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn(
            "Unauthorized or Forbidden - token might be invalid or expired"
          );
          // Optionally clear token and redirect user to login page
          // localStorage.removeItem("jwt");
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
