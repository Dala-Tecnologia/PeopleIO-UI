import { api } from "@/lib/api";
import type { FormData } from "@/types/FormData";

export const candidatoesService = {

  create: async (payload: FormData) => {
    const { data } = await api.post("/candidatoes", payload);
    return data;
  },

  update: async (id: string, payload: Partial<FormData>) => {
    const { data } = await api.put(`/candidatoes/${id}`, payload);
    return data;
  },

  list: async () => {
    const { data } = await api.get("/candidatoes");
    return data.value;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/candidatoes/${id}`);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/candidatoes/${id}`);
    return data;
  },
};