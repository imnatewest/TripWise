import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // Rails backend
});

// Attach JWT token if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
