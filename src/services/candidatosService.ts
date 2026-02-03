import { api } from "@/lib/api";
import type { FormData } from "@/types/FormData";

export const candidatosService = {

  create: async (payload: FormData) => {
    const { data } = await api.post("/candidatos", payload);
    return data;
  },

  update: async (id: string, payload: Partial<FormData>) => {
    const { data } = await api.put(`/candidatos/${id}`, payload);
    return data;
  },

  list: async () => {
    const { data } = await api.get("/candidatos");
    return data.value;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/candidatos/${id}`);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/candidatos/${id}`);
    return data;
  },
};