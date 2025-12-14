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
        label="Nome completo"
        {...register("nome")}
        error={errors.nome}
      />

      <InputField
        label="Nome Social"
        {...register("nomeSocial")}
        error={errors.nomeSocial}
      />

      <InputField
        label="CPF"
        {...register("cpf")}
        mask={insertMaskInCPF}
        error={errors.cpf}
      />

      <DateField
        control={control}
        name="dataNascimento"
        label="Data de Nascimento"
        error={errors.dataNascimento}
      />

      <InputField
        label="E-mail"
        {...register("email")}
        error={errors.email} />

      <InputField
        label="Telefone"
        {...register("telefone")}
        mask={insertMaskInPhone}
        error={errors.telefone}
      />

      <SelectField<FormDataInput>
        control={control}
        name="sexo"
        label="Sexo"
        options={sexoOptions}
      />

      <SelectField
        control={control}
        name="corRaca"
        label="Cor/Raça"
        options={corRacaOptions}
      />

      <SelectField
        control={control}
        name="escolaridade"
        label="Escolaridade"
        options={escolaridadeOptions}
      />

      <SelectField
        control={control}
        name="estadoCivil"
        label="Estado Civil"
        options={estadoCivilOptions}
      />

      <InputField
        label="Nacionalidade"
        {...register("nacionalidade")}
        error={errors.nacionalidade}
      />

      <InputField
        label="Naturalidade"
        {...register("naturalidade")}
        error={errors.naturalidade}
      />
    </div>
  );
};
