import { api } from "@/lib/api";
import type { FormData } from "@/types/FormData";

export const candidatoService = {

  create: async (payload: FormData) => {
    const { data } = await api.post("/candidato", payload);
    return data;
  },

  update: async (id: string, payload: Partial<FormData>) => {
    const { data } = await api.put(`/candidato/${id}`, payload);
    return data;
  },

  list: async () => {
    const { data } = await api.get("/candidato");
    return data.value;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/candidato/${id}`);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/candidato/${id}`);
    return data;
  },
};