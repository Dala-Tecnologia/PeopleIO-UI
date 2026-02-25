/**
 * Remove null, undefined e string vazia do payload para evitar erros de desserialização no backend
 * Mantém a estrutura aninhada intacta
 */
export function cleanFormData(data: any): any {
  if (data === null || data === undefined) {
    return undefined;
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data
        .map((item) => cleanFormData(item))
        .filter((item) => item !== undefined);
    }

    const cleaned: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const value = data[key];
        const cleanedValue = cleanFormData(value);

        // Incluir apenas valores não-undefined e não-vazio (mantém 0, false, etc)
        if (cleanedValue !== undefined && cleanedValue !== "") {
          cleaned[key] = cleanedValue;
        }
      }
    }
    return cleaned;
  }

  // Valores primitivos: retornar como está (mantém 0, false, etc)
  return data;
}
