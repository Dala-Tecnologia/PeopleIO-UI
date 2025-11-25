// Aplica máscara de CEP: 00000-000
export function insertMaskInCEP(value: string): string {
  if (!value) return "";

  // Remove tudo que não é número
  let v = value.replace(/\D/g, "");

  // Limita a 8 dígitos
  v = v.substring(0, 8);

  // Aplica máscara
  if (v.length > 5) {
    return v.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
  }

  return v;
}
