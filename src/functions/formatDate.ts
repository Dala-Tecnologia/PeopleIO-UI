/**
 * Formata uma data ISO (2026-02-02T03:00:00Z) para o padrão brasileiro (DD/MM/YYYY HH:MM:SS)
 * @param isoDate - Data em formato ISO 8601
 * @returns Data formatada no padrão brasileiro com hora em 24 horas
 */
export const formatDateBR = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "";

  try {
    const date = new Date(isoDate);

    // Verificar se a data é válida
    if (isNaN(date.getTime())) {
      return isoDate; // Retorna a data original se não conseguir converter
    }

    // Extrair componentes da data
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    // Extrair componentes da hora (em formato 24 horas)
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return isoDate || "";
  }
};

/**
 * Formata uma data ISO para o padrão brasileiro (DD/MM/YYYY) sem hora
 * @param isoDate - Data em formato ISO 8601
 * @returns Data formatada no padrão brasileiro
 */
export const formatDateBROnly = (isoDate: string | null | undefined): string => {
  if (!isoDate) return "";

  try {
    const date = new Date(isoDate);

    if (isNaN(date.getTime())) {
      return isoDate;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return isoDate || "";
  }
};
