import { z } from "zod";

// Schema para validação durante edição (aceita File)
export const arquivoSchema = z.instanceof(File).nullable();

export const enderecoSchema = z.object({
  rua: z.string().min(1, { message: "O campo Rua é obrigatório." }),
  numero: z.string().min(1, { message: "O campo Número é obrigatório." }),
  bairro: z.string().min(1, { message: "O campo Bairro é obrigatório." }),
  cidade: z.string().min(1, { message: "O campo Cidade é obrigatório." }),
  estado: z.string().min(1, { message: "O campo Estado é obrigatório." }),
  cep: z
    .string()
    .min(8, { message: "CEP deve ter ao menos 8 caracteres." })
    .max(9, { message: "CEP inválido." })
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 8, {
      message: "CEP deve conter 8 dígitos numéricos.",
    }),
});

export const colaboradorSchema = z.object({
  nome: z.string().min(3, {
    message: "O campo Nome completo deve ter pelo menos 3 caracteres.",
  }),
  nomeSocial: z.string().nullable(),
  cpf: z
    .string()
    .min(11, { message: "CPF deve ter ao menos 11 caracteres." })
    .max(14, { message: "CPF inválido." })
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length === 11, {
      message: "CPF deve conter 11 dígitos numéricos.",
    }),

  telefone: z
    .string()
    .min(10, { message: "Telefone inválido." })
    .max(15)
    .transform((v) => v.replace(/\D/g, ""))
    .refine((v) => v.length >= 10 && v.length <= 11, {
      message: "Telefone deve ter 10 ou 11 dígitos.",
    }),

  dataNascimento: z
    .string()
    .min(1, { message: "O campo Data de Nascimento é obrigatório." }),

  email: z
    .email({ message: "Informe um e-mail válido." }),

  endereco: enderecoSchema,
  cargo: z.string().nullable(),
  departamento: z.string().nullable(),
  dataAdmissao: z.string().nullable(),

  identidadeNumero: z
    .string()
    .max(10, "RG deve ter no máximo 10 caracteres."),
  identidadeOrgaoEmissor: z
    .string()
    .max(10, "Órgão Emissor deve ter no máximo 10 caracteres."),
  identidadeUF: z
    .string(),
  identidadeDataEmissao: z
    .string(),

  ctpsNumero: z
    .string()
    .min(1, { message: "O campo Nº da CTPS é obrigatório." })
    .max(10, "Numero do CTPS deve ter no máximo 10 caracteres."),
  ctpsSerie: z
    .string()
    .min(1, { message: "O campo Série da CTPS é obrigatório." })
    .max(10, "Numero de Série do CTPS deve ter no máximo 10 caracteres."),
  ctpsDataEmissao: z
    .string()
    .min(1, { message: "O campo Data de Emissão da CTPS é obrigatório." }),
  
  ctpsuf: z
    .string()
    .min(2, { message: "O campo UF da CTPS é obrigatório." }),

  tituloEleitor: z
    .string()
    .min(1, { message: "O campo Título de Eleitor é obrigatório." }),
  /* tituloDataEmissao: z
    .string()
    .min(1, { message: "O campo Data de Emissão do Título é obrigatório." }), */
  tituloUF: z
    .string()
    .min(2, { message: "O campo UF do Título é obrigatório." }),
  tituloZona: z
    .string()
    .min(1, { message: "O campo Zona Eleitoral é obrigatório." }),
  tituloSecao: z
    .string()
    .min(1, { message: "O campo Seção Eleitoral é obrigatório." }),

  cnhNumero: z
    .string()
    .nullable(),
  cnhuf: z
    .string()
    .nullable(),
  cnhDataVencimento: z
    .string()
    .nullable(),
  cnhOrgaoEmissor: z
    .string()
    .nullable(),
  cnhTipo: z
    .string()
    .nullable(),

  corRaca: z
    .string()
    .min(1, { message: "O campo Cor/Raça é obrigatório." }),
  sexo: z
    .string()
    .min(1, { message: "O campo Sexo é obrigatório." }),
  escolaridade: z
    .string()
    .min(1, { message: "O campo Escolaridade é obrigatório." }),
  estadoCivil: z
    .string()
    .min(1, { message: "O campo Estado Civil é obrigatório." }),
  naturalidade: z
    .string()
    .min(1, { message: "O campo Naturalidade é obrigatório." })
    .regex(/^[A-Za-zÀ-ú\s]+$/, {
      message: "Naturalidade deve conter apenas letras.",
    }),
  nacionalidade: z
    .string()
    .min(1, { message: "O campo Nacionalidade é obrigatório." })
    .regex(/^[A-Za-zÀ-ú\s]+$/, {
      message: "Nacionalidade deve conter apenas letras.",
    }),
  arquivoRG: arquivoSchema,
  arquivoCNH: arquivoSchema,
  arquivoCPF: arquivoSchema,
  arquivoComprovanteResidencia: arquivoSchema,
});