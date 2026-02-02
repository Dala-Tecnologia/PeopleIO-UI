import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidatoSchema } from "@/components/schemas/candidatoSchema";

import type { FormData, FormDataInput } from "@/types/FormData";

import { Loader } from "@/components/ui/loader";
import { DadosPessoaisForm } from "./DadosPessoaisForm";
import { DocumentosForm } from "./DocumentosForm";
import { EnderecoForm } from "./EnderecoForm";
import { DocumentosOpcionaisForm } from "./DocumentosOpcionaisForm";
import { useBlobUploader } from "@/hooks/useBlobUploader";
import { candidatoService } from "@/services/candidatoService";
import { useNotification } from "@/components/ui/NotificationContext";

export const FormularioCandidato = () => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormDataInput>({
    resolver: zodResolver(candidatoSchema as any),
    mode: "onChange",
    defaultValues: {
      nome: "",
      nomeSocial: "",
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
      cnhDataVencimento: null,
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
      arquivoCurriculo: null
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const uploader = useBlobUploader() as any;

  async function processFile(
    file: File | null,
    prefix: string,
    nome: string,
    cpf: string,
  ) {
    if (!file) return null;
  
    const extension = file.name.split(".").pop();
    const filename = `${prefix}-${crypto.randomUUID()}-${nome}.${extension}`;
  
    const uploadFn = typeof uploader === "function" ? uploader
      : uploader?.uploadFile ?? uploader?.upload;
  
    if (!uploadFn) {
      throw new Error("Uploader não configurado corretamente");
    }
  
    const url = await uploadFn(file, filename, cpf);
  
    return {
      nomeArquivo: filename,
      url: url,
      tipoMime: file.type,
      dataUpload: new Date().toISOString(),
    };
  }

  async function onSubmit(data: FormDataInput) {
    try {
      setIsLoading(true);
      const arquivoRG = await processFile(data.arquivoRG, "RG", data.nome, data.cpf);
      const arquivoCNH = await processFile(data.arquivoCNH, "CNH", data.nome, data.cpf);
      const arquivoCPF = await processFile(data.arquivoCPF, "CPF", data.nome, data.cpf);
      const arquivoCurriculo = await processFile(data.arquivoCurriculo, "Curriculo", data.nome, data.cpf);
      const arquivoComprovanteResidencia = await processFile(
        data.arquivoComprovanteResidencia,
        "CR",
        data.nome,
        data.cpf
      );

      const payload: FormData = {
        ...data,
        cnhDataVencimento: data.cnhDataVencimento || null,
        arquivoRG,
        arquivoCNH,
        arquivoCPF,
        arquivoComprovanteResidencia,
        arquivoCurriculo,
      };

      await candidatoService.create(payload);
      setIsLoading(false);
      showNotification({ message: "Dados salvos com sucesso!", type: "success" });
      navigate("/candidato");

    } catch (error) {
      showNotification({ message: "Houve um problema ao tentar salvar os dados. Tente novamente.", type: "error" });
      console.error("Erro na submissão do formulário:", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight app-heading sm:text-5xl">
          Cadastro do Candidato
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