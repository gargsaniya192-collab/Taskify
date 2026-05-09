import axios from "axios";

const api = axios.create({
  baseURL: "https://taskify-production-cb14.up.railway.app",
});
export default api;