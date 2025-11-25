import type { Control, UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { FormData } from "@/types/FormData";
import { insertMaskInCEP } from "@/functions/cep";
import { useState } from "react";

type Props = {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  setValue: UseFormSetValue<FormData>;
  errors: FieldErrors<FormData>;
};

export const EnderecoForm = ({ register, setValue }: Props) => {
  const [loadingCep, setLoadingCep] = useState(false);

  async function buscarCEP(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    try {
      setLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) return;

      // Preenche automaticamente os campos
      setValue("endereco.rua", data.logradouro || "");
      setValue("endereco.bairro", data.bairro || "");
      setValue("endereco.cidade", data.localidade || "");
      setValue("endereco.estado", data.uf || "");
    } catch {
      console.error("Erro ao buscar CEP");
    } finally {
      setLoadingCep(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {/* CEP */}
      <div>
        <label className="pio-label">CEP</label>
        <input
          {...register("endereco.cep")}
          className="pio-input"
          placeholder="00000-000"
          onChange={(e) => (e.target.value = insertMaskInCEP(e.target.value))}
          onBlur={(e) => buscarCEP(e.target.value)}
        />
        {loadingCep && (
          <p className="text-sm text-blue-400 mt-1">Buscando CEP...</p>
        )}
      </div>

      {/* Rua */}
      <div>
        <label className="pio-label">Rua</label>
        <input {...register("endereco.rua")} className="pio-input" />
      </div>

      {/* Número */}
      <div>
        <label className="pio-label">Número</label>
        <input {...register("endereco.numero")} className="pio-input" />
      </div>

      {/* Bairro */}
      <div>
        <label className="pio-label">Bairro</label>
        <input {...register("endereco.bairro")} className="pio-input" />
      </div>

      {/* Cidade */}
      <div>
        <label className="pio-label">Cidade</label>
        <input {...register("endereco.cidade")} className="pio-input" />
      </div>

      {/* Estado */}
      <div>
        <label className="pio-label">Estado</label>
        <input {...register("endereco.estado")} className="pio-input" />
      </div>
    </div>
  );
};
