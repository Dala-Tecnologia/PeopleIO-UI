import api from "@/lib/api";
import type { FormData } from "@/types/FormData";

export const colaboradoresService = {

  create: async (payload: FormData) => {
    const { data } = await api.post("/colaboradores", payload);
    return data;
  },

  update: async (id: string, payload: Partial<FormData>) => {
    const { data } = await api.put(`/colaboradores/${id}`, payload);
    return data;
  },

  list: async () => {
    const { data } = await api.get("/colaboradores");
    return data.value;
  },

  getById: async (id: string) => {
    const { data } = await api.get(`/colaboradores/${id}`);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/colaboradores/${id}`);
    return data;
  },
};