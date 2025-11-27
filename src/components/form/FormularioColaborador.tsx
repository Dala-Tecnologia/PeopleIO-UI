import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { colaboradorSchema } from "@/components/schemas/colaboradorSchema";

import type { FormData, FormDataInput } from "@/types/FormData";

import { DadosPessoaisForm } from "./DadosPessoaisForm";
import { DocumentosForm } from "./DocumentosForm";
import { EnderecoForm } from "./EnderecoForm";


export const FormularioColaborador = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormDataInput>({
    resolver: zodResolver(colaboradorSchema),
    mode: "onChange",
    defaultValues: {
      arquivoRG: null,
      arquivoCNH: null,
      arquivoCPF: null,
      arquivoComprovanteResidencia: null,
    },
  });

  async function uploadToBlob(file: File, filename: string) {
    const sasToken = import.meta.env.VITE_AZURE_SAS_TOKEN;
    const containerUrl = import.meta.env.VITE_AZURE_BLOB_URL;

    if (!sasToken || !containerUrl) {
      throw new Error(
        "Variáveis de ambiente VITE_AZURE_SAS_TOKEN e VITE_AZURE_BLOB_URL não configuradas"
      );
    }

    const url = `${containerUrl}/${filename}?${sasToken}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error(
        `Erro ao fazer upload: ${response.status} ${response.statusText}`
      );
    }

    return `${containerUrl}/${filename}`;
  }

  async function processFile(
    file: File | null,
    prefix: string,
    nome: string
  ) {
    if (!file) return null;

    const extension = file.name.split(".").pop();
    const filename = `${prefix}-${crypto.randomUUID()}-${nome}.${extension}`;

    return await uploadToBlob(file, filename);
  }

  async function onSubmit(data: FormDataInput) {
    try {
      const rgUrl = await processFile(data.arquivoRG, "RG", data.nome);
      const cnhUrl = await processFile(data.arquivoCNH, "CNH", data.nome);
      const cpfUrl = await processFile(data.arquivoCPF, "CPF", data.nome);
      const crUrl = await processFile(
        data.arquivoComprovanteResidencia,
        "CR",
        data.nome
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
      const resp = await fetch(
        "https://peopleio-api-dev.azurewebsites.net/api/v1/colaboradores",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Erro ao enviar API: ${resp.status} ${txt}`);
      }

      const result = await resp.json();
      console.log("Enviado com sucesso:", result);
    } catch (error) {
      console.error("Erro na submissão do formulário:", error);
      throw error;
    }
  }

  console.log("errors", errors);

  return (
    <div className="isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
        ></div>
      </div>

      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
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
          <h3 className="text-xl font-semibold text-white mb-6">Documentos</h3>
          <DocumentosForm
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
    </div>
  );
};