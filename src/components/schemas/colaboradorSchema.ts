import { z } from "zod";

export const arquivoSchema = z.object({
  file: z.instanceof(File),
  nomeArquivo: z.string().optional(),
  url: z.string().optional(),
  dataUpload: z.string().optional(),
  tipoMime: z.string().optional(),
});

export const enderecoSchema = z.object({
  rua: z.string().min(1, { message: "O campo Rua é obrigatório." }),
  numero: z.string().min(1, { message: "O campo Número é obrigatório." }),
  bairro: z.string().min(1, { message: "O campo Bairro é obrigatório." }),
  cidade: z.string().min(1, { message: "O campo Cidade é obrigatório." }),
  estado: z.string().min(1, { message: "O campo Estado é obrigatório." }),
  cep: z
    .string()
    .min(8, { message: "O campo CEP deve conter no mínimo 8 dígitos." }),
});

export const colaboradorSchema = z.object({
  nome: z.string().min(3, {
    message: "O campo Nome completo deve ter pelo menos 3 caracteres.",
  }),
  cpf: z.string().min(11, { message: "O campo CPF deve ter 11 dígitos." }),
  dataNascimento: z
    .string()
    .min(1, { message: "O campo Data de Nascimento é obrigatório." }),

  email: z.string().email({ message: "Informe um e-mail válido." }),

  telefone: z
    .string()
    .min(10, { message: "O campo Telefone deve ter no mínimo 10 dígitos." }),

  endereco: enderecoSchema,

  cargo: z.string().nullable(),
  departamento: z.string().nullable(),
  dataAdmissao: z.string().nullable(),

  identidadeNumero: z.string(),
  identidadeOrgaoEmissor: z.string(),
  identidadeUF: z.string(),
  identidadeDataEmissao: z.string(),

  ctpsNumero: z
    .string()
    .min(1, { message: "O campo Nº da CTPS é obrigatório." }),
  ctpsSerie: z
    .string()
    .min(1, { message: "O campo Série da CTPS é obrigatório." }),
  ctpsDataEmissao: z
    .string()
    .min(1, { message: "O campo Data de Emissão da CTPS é obrigatório." }),
  ctpsuf: z.string().min(2, { message: "O campo UF da CTPS é obrigatório." }),

  tituloEleitor: z
    .string()
    .min(1, { message: "O campo Título de Eleitor é obrigatório." }),
  tituloDataEmissao: z
    .string()
    .min(1, { message: "O campo Data de Emissão do Título é obrigatório." }),
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
    .min(1, { message: "O campo Número da CNH é obrigatório." }),
  cnhuf: z.string().min(2, { message: "O campo UF da CNH é obrigatório." }),
  cnhDataVencimento: z
    .string()
    .min(1, { message: "O campo Data de Vencimento é obrigatório." }),
  cnhOrgaoEmissor: z
    .string()
    .min(1, { message: "O campo Órgão Emissor da CNH é obrigatório." }),
  cnhTipo: z.string().min(1, { message: "O campo Tipo de CNH é obrigatório." }),

  corRaca: z.string().min(1, { message: "O campo Cor/Raça é obrigatório." }),
  sexo: z.string().min(1, { message: "O campo Sexo é obrigatório." }),
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
  arquivoRG: arquivoSchema.nullable(),
  arquivoCNH: arquivoSchema.nullable(),
  arquivoCPF: arquivoSchema.nullable(),
  arquivoComprovanteResidencia: arquivoSchema.nullable(),
});
