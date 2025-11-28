import type { Control, UseFormRegister, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { FormDataInput } from "@/types/FormData";
import { insertMaskInCEP } from "@/functions/cep";
import { useState } from "react";
import { SelectField } from "../ui/select-field";
import { estadosOptions } from "@/constrants/options";

interface EnderecoFormProps {
  register: UseFormRegister<FormDataInput>;
  control: Control<FormDataInput>;
  setValue: UseFormSetValue<FormDataInput>;
  errors: FieldErrors<FormDataInput>;
}

export const EnderecoForm = ({ register, setValue, control, errors }: EnderecoFormProps) => {
  const [loadingCep, setLoadingCep] = useState(false);

  async function buscarCEP(cep: string) {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) return;

    try {
      setLoadingCep(true);

      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) return;

      setValue("endereco.rua", data.logradouro || "", { shouldValidate: false });
      setValue("endereco.bairro", data.bairro || "", { shouldValidate: false });
      setValue("endereco.cidade", data.localidade || "", { shouldValidate: false });
      setValue("endereco.estado", data.uf || "", { shouldValidate: false });
    } catch {
      console.error("Erro ao buscar CEP");
    } finally {
      setLoadingCep(false);
    }
  }

  function handleCepChange(e: React.ChangeEvent<HTMLInputElement>) {
    const masked = insertMaskInCEP(e.target.value);
    setValue("endereco.cep", masked, { shouldValidate: true });
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="pio-label">CEP</label>
        <input
          {...register("endereco.cep")}
          className="pio-input"
          placeholder="00000-000"
          onChange={handleCepChange}
          onBlur={(e) => buscarCEP(e.target.value)}
        />
        {errors.endereco?.cep && (
          <p className="text-sm text-red-400 mt-1">
            {errors.endereco.cep.message}
          </p>
        )}
        {loadingCep && (
          <p className="text-sm text-blue-400 mt-1">Buscando CEP...</p>
        )}
      </div>

      <div>
        <label className="pio-label">Rua</label>
        <input {...register("endereco.rua")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">Número</label>
        <input {...register("endereco.numero")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">Bairro</label>
        <input {...register("endereco.bairro")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">Cidade</label>
        <input {...register("endereco.cidade")} className="pio-input" />
      </div>

      <SelectField
        control={control}
        name="endereco.estado"
        label="Estado"
        options={estadosOptions}
      />
    </div>
  );
};
