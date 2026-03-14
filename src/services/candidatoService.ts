import { api } from "@/lib/api";
import type { FormData } from "@/types/FormData";
import axios from "axios";

function getApiErrorMessage(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError(error)) {
    return fallbackMessage;
  }

  const responseData = error.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData;
  }

  if (responseData && typeof responseData === "object") {
    const maybeMessage =
      (responseData as { message?: unknown }).message ??
      (responseData as { title?: unknown }).title;

    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export const candidatoService = {

  create: async (payload: FormData) => {
    try {
      const { data } = await api.post("/candidato", payload);
      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Erro ao criar candidato. Tente novamente.")
      );
    }
  },

  update: async (id: string, payload: Partial<FormData>) => {
    try {
      const { data } = await api.put(`/candidato/${id}`, payload);
      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Erro ao atualizar candidato. Tente novamente.")
      );
    }
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