import axios from "axios";

const privateApi = axios.create({
  baseURL: "https://taskify-production-cb14.up.railway.app", // ← changed
});


privateApi.interceptors.request.use((config) => {
  const t = localStorage.getItem("token");
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

privateApi.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default privateApi;