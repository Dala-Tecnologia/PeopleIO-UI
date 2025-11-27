export type Arquivo = {
  nomeArquivo: string;
  url: string;
  tipoMime: string;
  dataUpload: string;
};

export type FormData = {
  nome: string;
  cpf: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cargo: string | null;
  departamento: string | null;
  dataAdmissao: string | null;
  identidadeNumero: string;
  identidadeOrgaoEmissor: string;
  identidadeUF: string;
  identidadeDataEmissao: string;
  ctpsNumero: string;
  ctpsSerie: string;
  ctpsDataEmissao: string;
  ctpsuf: string;
  tituloEleitor: string;
  tituloDataEmissao: string;
  tituloUF: string;
  tituloZona: string;
  tituloSecao: string;
  cnhNumero: string;
  cnhuf: string;
  cnhDataVencimento: string;
  cnhOrgaoEmissor: string;
  cnhTipo: string;
  corRaca: string;
  sexo: string;
  escolaridade: string;
  estadoCivil: string;
  naturalidade: string;
  nacionalidade: string;
  arquivoRG: Arquivo | null;
  arquivoCNH: Arquivo | null;
  arquivoCPF: Arquivo | null;
  arquivoComprovanteResidencia: Arquivo | null;
};

export type FormDataInput = Omit<
  FormData,
  "arquivoRG" | "arquivoCNH" | "arquivoCPF" | "arquivoComprovanteResidencia"
> & {
  arquivoRG: File | null;
  arquivoCNH: File | null;
  arquivoCPF: File | null;
  arquivoComprovanteResidencia: File | null;
};