// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.VUE_APP_API_BASE_URL ||
    "https://exarbete-production.up.railway.app/", // Backend URL
});

export default api;
