import type { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";
import type { FormData } from "@/types/FormData";
import { insertMaskInCPF } from "@/functions/cpf";
import { insertMaskInPhone } from "@/functions/phone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InputField } from "../ui/InputField";

type Props = {
  register: UseFormRegister<FormData>;
  control: Control<FormData>;
  errors: FieldErrors<FormData>;
};

export const DadosPessoaisForm = ({ register, control, errors }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <InputField
        label="Nome completo"
        {...register("nome")}
        error={errors.nome}
      />
      <InputField label="CPF" {...register("cpf")} error={errors.cpf} />

      <div>
        <label className="pio-label">Data de Nascimento</label>
        <Controller
          control={control}
          name="dataNascimento"
          render={({ field }) => (
            <DatePicker
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date?.toISOString() ?? "")}
            />
          )}
        />
      </div>

      <InputField label="E-mail" {...register("email")} error={errors.email} />
      <InputField label="Telefone" {...register("telefone")} error={errors.telefone} />
      <div>
        <label className="pio-label">Sexo</label>

        <Controller
          control={control}
          name="sexo"
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Masculino">Masculino</SelectItem>
                <SelectItem value="Feminino">Feminino</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
                <SelectItem value="Prefiro não informar">
                  Prefiro não informar
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <label className="pio-label">Escolaridade</label>

        <Controller
          control={control}
          name="escolaridade"
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className="pio-input">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Fundamental incompleto">
                  Fundamental incompleto
                </SelectItem>
                <SelectItem value="Fundamental completo">
                  Fundamental completo
                </SelectItem>
                <SelectItem value="Médio incompleto">
                  Médio incompleto
                </SelectItem>
                <SelectItem value="Médio completo">Médio completo</SelectItem>
                <SelectItem value="Superior incompleto">
                  Superior incompleto
                </SelectItem>
                <SelectItem value="Superior completo">
                  Superior completo
                </SelectItem>
                <SelectItem value="Pós-graduação">Pós-graduação</SelectItem>
                <SelectItem value="Mestrado">Mestrado</SelectItem>
                <SelectItem value="Doutorado">Doutorado</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div>
        <label className="pio-label">Estado Civil</label>

        <Controller
          control={control}
          name="estadoCivil"
          render={({ field }) => (
            <Select value={field.value ?? ""} onValueChange={field.onChange}>
              <SelectTrigger className="pio-input">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Solteiro(a)">Solteiro(a)</SelectItem>
                <SelectItem value="Casado(a)">Casado(a)</SelectItem>
                <SelectItem value="Divorciado(a)">Divorciado(a)</SelectItem>
                <SelectItem value="Separado(a)">Separado(a)</SelectItem>
                <SelectItem value="Viúvo(a)">Viúvo(a)</SelectItem>
                <SelectItem value="União estável">União estável</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {/* CAMPO DE NACIONALIDADE */}
      <div>
        <label className="pio-label">Nacionalidade</label>
        <input
          {...register("nacionalidade")}
          className="pio-input"
          placeholder="Ex: Brasileira"
        />
      </div>

      {/* CAMPO DE NATURALIDADE */}
      <div>
        <label className="pio-label">Naturalidade</label>
        <input
          {...register("naturalidade")}
          className="pio-input"
          placeholder="Ex: Salvador - BA"
        />
      </div>
    </div>
  );
};
