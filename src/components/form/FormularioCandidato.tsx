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
  const [currentStep, setCurrentStep] = useState(0);
  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
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
      arquivoCurriculo: null,
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

    const uploadFn =
      typeof uploader === "function"
        ? uploader
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
      const arquivoRG = await processFile(
        data.arquivoRG,
        "RG",
        data.nome,
        data.cpf,
      );
      const arquivoCNH = await processFile(
        data.arquivoCNH,
        "CNH",
        data.nome,
        data.cpf,
      );
      const arquivoCPF = await processFile(
        data.arquivoCPF,
        "CPF",
        data.nome,
        data.cpf,
      );
      const arquivoCurriculo = await processFile(
        data.arquivoCurriculo,
        "Curriculo",
        data.nome,
        data.cpf,
      );
      const arquivoComprovanteResidencia = await processFile(
        data.arquivoComprovanteResidencia,
        "CR",
        data.nome,
        data.cpf,
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
      showNotification({
        message: "Houve um problema ao tentar salvar os dados. Tente novamente.",
        type: "error",
      });
      console.error("Erro na submissão do formulário:", error);
      setIsLoading(false);
    }
  }

  const steps = [
    {
      title: "Dados Pessoais",
      fields: ["nome", "cpf", "dataNascimento", "email", "telefone"] as const,
      component: (
        <DadosPessoaisForm
          register={register}
          control={control}
          errors={errors}
        />
      ),
    },
    {
      title: "Endereço",
      fields: ["endereco.cep", "endereco.rua", "endereco.numero", "endereco.bairro", "endereco.cidade", "endereco.estado"] as const,
      component: (
        <EnderecoForm
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      ),
    },
    {
      title: "Documentação",
      fields: ["identidadeNumero", "identidadeOrgaoEmissor", "identidadeUF", "identidadeDataEmissao", "ctpsNumero", "ctpsSerie", "ctpsDataEmissao", "ctpsuf"] as const,
      component: (
        <DocumentosForm
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      ),
    },
    {
      title: "Documentação extra",
      fields: [] as const,
      component: (
        <DocumentosOpcionaisForm
          register={register}
          control={control}
          setValue={setValue}
          errors={errors}
        />
      ),
    },
  ] as const;

  const handleNext = async () => {
    const fields = steps[currentStep].fields;
    if (fields) {
      const isValid = await trigger(fields);
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

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
        <section className="bg-blue-950 p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">
              {steps[currentStep].title}
            </h3>
            <span className="text-gray-400">
              Etapa {currentStep + 1} de {steps.length}
            </span>
          </div>
          {steps[currentStep].component}
        </section>

        <div className="flex justify-between">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="pio-btn-primary mr-1"
            >
              Anterior
            </button>
          )}
          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="pio-btn-primary ml-1"
            >
              Próximo
            </button>
          )}
          {currentStep === steps.length - 1 && (
            <button type="submit" className="pio-btn-primary w-full text-lg">
              Salvar
            </button>
          )}
        </div>
      </form>
    </>
  );
};