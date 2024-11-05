import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL:
    process.env.VUE_APP_API_BASE_URL ||
    "https://exarbete-production.up.railway.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
