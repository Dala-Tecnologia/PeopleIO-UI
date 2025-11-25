
// Aplica máscara de CPF: 000.000.000-00
export function insertMaskInCPF(value: string): string {
  if (!value) return "";

  // Remove tudo que não é número
  let v = value.replace(/\D/g, "");

  // Limita a 11 números
  v = v.substring(0, 11);

  // Aplica máscara
  if (v.length > 9) {
    return v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/, "$1.$2.$3-$4");
  }
  if (v.length > 6) {
    return v.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
  }
  if (v.length > 3) {
    return v.replace(/^(\d{3})(\d{0,3}).*/, "$1.$2");
  }

  return v;
}
