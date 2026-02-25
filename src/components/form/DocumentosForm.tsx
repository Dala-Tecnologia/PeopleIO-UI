import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import type { FormDataInput } from "@/types/FormData";
import { estadosOptions } from "@/constrants/options";
import { SelectField } from "../ui/select-field";
import { DateField } from "../ui/date-field";
import { InputField } from "../ui/InputField";
import { somenteNumerosMascara } from "@/functions/identidadeNumero";

interface DocumentosFormProps {
  register: UseFormRegister<FormDataInput>;
  control: Control<FormDataInput>;
  setValue: UseFormSetValue<FormDataInput>;
  errors: FieldErrors<FormDataInput>;
}

export const DocumentosForm = ({ register, control, errors }: DocumentosFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <InputField
        label="RG - Número"
        {...register("identidadeNumero")}
        mask={somenteNumerosMascara}
        error={errors.identidadeNumero}
      />
      <InputField
        label="RG - Órgão Emissor"
        {...register("identidadeOrgaoEmissor")}
        error={errors.identidadeOrgaoEmissor}
      />

      <SelectField<FormDataInput>
        control={control}
        {...register("identidadeUF")}
        name="identidadeUF"
        label="RG - UF"
        options={estadosOptions}
      />

      <DateField
        control={control}
        name="identidadeDataEmissao"
        label="RG - Data de Emissão"
        error={errors.identidadeDataEmissao}
      />

      <InputField
        label={<span>CTPS - Número <span className="text-red-500">*</span></span>}
        {...register("ctpsNumero")}
        error={errors.ctpsNumero}
        mask={somenteNumerosMascara}
      />

      <InputField
        label={<span>CTPS - Série <span className="text-red-500">*</span></span>}
        {...register("ctpsSerie")}
        error={errors.ctpsSerie}
      />

      <DateField
        control={control}
        name="ctpsDataEmissao"
        label={<span>CTPS - Data de Emissão <span className="text-red-500">*</span></span>}
        error={errors.ctpsDataEmissao}
      />

      <SelectField<FormDataInput>
        control={control}
        {...register("ctpsuf")}
        name="ctpsuf"
        label={<span>CTPS - UF <span className="text-red-500">*</span></span>}
        options={estadosOptions}
      />
    </div>
  );
};
