import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// request interceptor (adiciona token se houver)
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// response interceptor (padroniza erros)
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const msg = error?.response?.data?.message ?? error.message ?? "Erro desconhecido";
    return Promise.reject(new Error(msg));
  }
);

export default api;