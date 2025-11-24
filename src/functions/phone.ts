export const insertMaskInPhone = (phone: string) => {
  return phone
    .replace(/\D/g, "")     
    .slice(0, 11)
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2");

};
