import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import type { FormDataInput } from "@/types/FormData";
import { insertMaskInCPF } from "@/functions/cpf";
import { insertMaskInPhone } from "@/functions/phone";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/select-field";
import {
  corRacaOptions,
  escolaridadeOptions,
  estadoCivilOptions,
  sexoOptions,
} from "@/constrants/options";
import { DateField } from "../ui/date-field";

interface DadosPessoaisFormProps {
  register: UseFormRegister<FormDataInput>;
  control: Control<FormDataInput>;
  errors: FieldErrors<FormDataInput>;
}


export const DadosPessoaisForm = ({ register, control, errors }: DadosPessoaisFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <InputField
        label={<span>Nome completo <span className="text-red-500">*</span></span>}
        {...register("nome")}
        error={errors.nome}
      />

      <InputField
        label="Nome Social"
        {...register("nomeSocial")}
        error={errors.nomeSocial}
      />

      <InputField
        label={<span>CPF <span className="text-red-500">*</span></span>}
        {...register("cpf")}
        mask={insertMaskInCPF}
        error={errors.cpf}
      />

      <DateField
        control={control}
        name="dataNascimento"
        label={<span>Data de Nascimento <span className="text-red-500">*</span></span>}
        error={errors.dataNascimento}
      />

      <InputField
        label={<span>E-mail <span className="text-red-500">*</span></span>}
        {...register("email")}
        error={errors.email} />

      <InputField
        label={<span>Telefone <span className="text-red-500">*</span></span>}
        {...register("telefone")}
        mask={insertMaskInPhone}
        error={errors.telefone}
      />

      <SelectField<FormDataInput>
        control={control}
        name="sexo"
        label={<span>Sexo <span className="text-red-500">*</span></span>}
        options={sexoOptions}
      />

      <SelectField
        control={control}
        name="corRaca"
        label={<span>Cor/Raça <span className="text-red-500">*</span></span>}
        options={corRacaOptions}
      />

      <SelectField
        control={control}
        name="escolaridade"
        label={<span>Escolaridade <span className="text-red-500">*</span></span>}
        options={escolaridadeOptions}
      />

      <SelectField
        control={control}
        name="estadoCivil"
        label={<span>Estado Civil <span className="text-red-500">*</span></span>}
        options={estadoCivilOptions}
      />

      <InputField
        label={<span>Nacionalidade <span className="text-red-500">*</span></span>}
        {...register("nacionalidade")}
        error={errors.nacionalidade}
      />

      <InputField
        label={<span>Naturalidade <span className="text-red-500">*</span></span>}
        {...register("naturalidade")}
        error={errors.naturalidade}
      />
    </div>
  );
};
