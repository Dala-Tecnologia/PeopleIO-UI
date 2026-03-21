import { api } from '@/lib/api';

interface ValidarRGPayload {
  blobUrl: string;
  identidadeNumero: string;
  identidadeUF: string;
  identidadeDataEmissao: string | null;
}

interface ValidarCNHPayload {
  blobUrl: string;
  cnhNumero: string;
  cpf: string;
  dataNascimento: string;
  cnhDataVencimento: string | null;
}

interface ValidarComprovantePayload {
  blobUrl: string;
  nome: string;
  rua: string;
  cidade: string;
  cep: string;
}

export const documentoService = {
  validarRG: (payload: ValidarRGPayload) =>
    api.post('/documento/validar/rg', {
      BlobUrl: payload.blobUrl,
      IdentidadeNumero: payload.identidadeNumero,
      IdentidadeUF: payload.identidadeUF,
      IdentidadeDataEmissao: payload.identidadeDataEmissao,
    }),

  validarCNH: (payload: ValidarCNHPayload) =>
    api.post('/documento/validar/cnh', {
      BlobUrl: payload.blobUrl,
      CNHNumero: payload.cnhNumero,
      CPF: payload.cpf,
      DataNascimento: payload.dataNascimento,
      CNHDataVencimento: payload.cnhDataVencimento,
    }),

  validarComprovante: (payload: ValidarComprovantePayload) =>
    api.post('/documento/validar/comprovante-residencia', {
      BlobUrl: payload.blobUrl,
      Nome: payload.nome,
      Rua: payload.rua,
      Cidade: payload.cidade,
      CEP: payload.cep,
    }),
};
