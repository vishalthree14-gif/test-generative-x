import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // 🔥 THIS WAS THE MAIN ISSUE
});

export default API;
