import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colaboradorSchema } from "@/components/schemas/colaboradorSchema";

import type { FormData, FormDataInput } from "@/types/FormData";

import { DadosPessoaisForm } from "./DadosPessoaisForm";
import { DocumentosForm } from "./DocumentosForm";
import { EnderecoForm } from "./EnderecoForm";
import { DocumentosOpcionaisForm } from "./DocumentosOpcionaisForm";
import { useBlobUploader } from "@/hooks/useBlobUploader";
import { colaboradoresService } from "@/services/colaboradoresService";


export const FormularioColaborador = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormDataInput>({
    resolver: zodResolver(colaboradorSchema as any),
    mode: "onChange",
    defaultValues: {
      nome: "",
      cpf: "",
      dataNascimento: "",
      email: "",
      telefone: "",
      endereco: {
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
      },
      cargo: null,
      departamento: null,
      dataAdmissao: null,
      identidadeNumero: "",
      identidadeOrgaoEmissor: "",
      identidadeUF: "",
      identidadeDataEmissao: "",
      ctpsNumero: "",
      ctpsSerie: "",
      ctpsDataEmissao: "",
      ctpsuf: "",
      tituloEleitor: "",
      tituloDataEmissao: "",
      tituloUF: "",
      tituloZona: "",
      tituloSecao: "",
      cnhNumero: "",
      cnhuf: "",
      cnhDataVencimento: "",
      cnhOrgaoEmissor: "",
      cnhTipo: "",
      corRaca: "",
      sexo: "",
      escolaridade: "",
      estadoCivil: "",
      naturalidade: "",
      nacionalidade: "",
      arquivoRG: null,
      arquivoCNH: null,
      arquivoCPF: null,
      arquivoComprovanteResidencia: null,
    },
  });

  const uploader = useBlobUploader() as any;

  async function processFile(
    file: File | null,
    prefix: string,
    nome: string,
    cpf: string
  ) {
    if (!file) return null;

    const extension = file.name.split(".").pop();
    const filename = `${prefix}-${crypto.randomUUID()}-${nome}.${extension}`;

    const uploadFn = typeof uploader === "function" ? uploader
      : uploader?.uploadFile ?? uploader?.upload;

    if (!uploadFn) {
      throw new Error("Uploader não configurado corretamente");
    }

    return await uploadFn(file, filename, cpf);
  }

  async function onSubmit(data: FormDataInput) {
    try {
      const rgUrl = await processFile(data.arquivoRG, "RG", data.nome, data.cpf);
      const cnhUrl = await processFile(data.arquivoCNH, "CNH", data.nome, data.cpf);
      const cpfUrl = await processFile(data.arquivoCPF, "CPF", data.nome, data.cpf);
      const crUrl = await processFile(
        data.arquivoComprovanteResidencia,
        "CR",
        data.nome,
        data.cpf
      );

      // Converte para FormData com Arquivo objects
      const payload: FormData = {
        ...data,
        arquivoRG: rgUrl
          ? {
            nomeArquivo: rgUrl.split("/").pop()!,
            url: rgUrl,
            tipoMime: data.arquivoRG!.type,
            dataUpload: new Date().toISOString(),
          }
          : null,
        arquivoCNH: cnhUrl
          ? {
            nomeArquivo: cnhUrl.split("/").pop()!,
            url: cnhUrl,
            tipoMime: data.arquivoCNH!.type,
            dataUpload: new Date().toISOString(),
          }
          : null,
        arquivoCPF: cpfUrl
          ? {
            nomeArquivo: cpfUrl.split("/").pop()!,
            url: cpfUrl,
            tipoMime: data.arquivoCPF!.type,
            dataUpload: new Date().toISOString(),
          }
          : null,
        arquivoComprovanteResidencia: crUrl
          ? {
            nomeArquivo: crUrl.split("/").pop()!,
            url: crUrl,
            tipoMime: data.arquivoComprovanteResidencia!.type,
            dataUpload: new Date().toISOString(),
          }
          : null,
      };

      // Envia para API
      const result = await colaboradoresService.create(payload);
      console.log("Enviado com sucesso:", result);

    } catch (error) {
      console.error("Erro na submissão do formulário:", error);
      throw error;
    }
  }

  return (
    <>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight .app-heading sm:text-5xl">
          Cadastro de Colaborador
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Por favor, preencher o formulário corretamente.
        </p>
      </div>

      <form
        className="mx-auto mt-16 max-w-3xl space-y-12 sm:mt-20"
        onSubmit={handleSubmit(onSubmit)}
      >
        <section className="bg-gray-800/50 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6">
            Dados Pessoais
          </h3>
          <DadosPessoaisForm
            register={register}
            control={control}
            errors={errors}
          />
        </section>

        <section className="bg-gray-800/50 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Endereço</h3>
          <EnderecoForm
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </section>

        <section className="bg-gray-800/50 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Documentação</h3>
          <DocumentosForm
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </section>

        <section className="bg-gray-800/50 p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-6">Documentação extra</h3>
          <DocumentosOpcionaisForm
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
          />
        </section>

        <button type="submit" className="pio-btn-primary w-full text-lg">
          Salvar
        </button>
      </form>
    </>
  );
};