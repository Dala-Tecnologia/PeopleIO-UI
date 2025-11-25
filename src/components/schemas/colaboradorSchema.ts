import { z } from "zod";

export const arquivoSchema = z.object({
  nomeArquivo: z.string().optional(),
  url: z.string().optional(),
  dataUpload: z.string().optional(),
  tipoMime: z.string().optional(),
});

export const enderecoSchema = z.object({
  rua: z.string(),
  numero: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  estado: z.string(),
  cep: z.string(),
});

export const colaboradorSchema = z.object({
  nome: z.string().min(3),
  cpf: z.string().min(11),
  dataNascimento: z.string(),
  email: z.string().email(),
  telefone: z.string().nullable(),

  endereco: enderecoSchema,

  cargo: z.string().nullable(),
  departamento: z.string().nullable(),
  dataAdmissao: z.string().nullable(),

  identidadeNumero: z.string(),
  identidadeOrgaoEmissor: z.string(),
  identidadeUF: z.string(),
  identidadeDataEmissao: z.string(),

  ctpsNumero: z.string(),
  ctpsSerie: z.string(),
  ctpsDataEmissao: z.string(),
  ctpsuf: z.string(),

  tituloEleitor: z.string(),
  tituloDataEmissao: z.string(),
  tituloUF: z.string(),
  tituloZona: z.string(),
  tituloSecao: z.string(),

  cnhNumero: z.string(),
  cnhuf: z.string(),
  cnhDataVencimento: z.string(),
  cnhOrgaoEmissor: z.string(),
  cnhTipo: z.string(),

  corRaca: z.string(),
  sexo: z.string(),
  escolaridade: z.string(),
  estadoCivil: z.string(),
  naturalidade: z.string(),
  nacionalidade: z.string(),

  arquivoRG: z.any().nullable(),
  arquivoCNH: z.any().nullable(),
  arquivoCPF: z.any().nullable(),
  arquivoComprovanteResidencia: z.any().nullable(),
});
