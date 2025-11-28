import type {
    Control,
    UseFormRegister,
    UseFormSetValue,
    FieldErrors,
} from "react-hook-form";
import type { FormDataInput } from "@/types/FormData";
import { FileUpload } from "@/components/FileUpload";
import { cnhTipo, estadosOptions } from "@/constrants/options";
import { SelectField } from "../ui/select-field";
import { InputField } from "../ui/InputField";
import { DateField } from "../ui/date-field";

interface DocumentosOpcionaisFormProps {
    register: UseFormRegister<FormDataInput>;
    control: Control<FormDataInput>;
    setValue: UseFormSetValue<FormDataInput>;
    errors: FieldErrors<FormDataInput>;
}

export const DocumentosOpcionaisForm = ({ register, control, setValue, errors }: DocumentosOpcionaisFormProps) => {
    return (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                    label="Titulo de Eleitor - Número"
                    {...register("tituloEleitor")}
                    error={errors.tituloEleitor}
                />

                <SelectField<FormDataInput>
                    control={control}
                    {...register("tituloUF")}
                    name="tituloUF"
                    label="Titulo de Eleitor - UF"
                    options={estadosOptions}
                />

                <InputField
                    label="Titulo de Eleitor - Zona"
                    {...register("tituloZona")}
                    error={errors.tituloZona}
                />

                <InputField
                    label="Titulo de Eleitor - Seção"
                    {...register("tituloSecao")}
                    error={errors.tituloSecao}
                />

                <InputField
                    label="CNH - Número"
                    {...register("cnhNumero")}
                    error={errors.cnhNumero}
                />

                <SelectField<FormDataInput>
                    control={control}
                    {...register("cnhuf")}
                    name="cnhuf"
                    label="CNH - UF"
                    options={estadosOptions}
                />

                <DateField
                    control={control}
                    name="cnhDataVencimento"
                    label="CNH - Data de Vencimento"
                    error={errors.cnhDataVencimento}
                />

                <InputField
                    label="CNH - Orgão Emissor"
                    {...register("cnhOrgaoEmissor")}
                    error={errors.cnhOrgaoEmissor}
                />

                <SelectField<FormDataInput>
                    control={control}
                    {...register("cnhTipo")}
                    name="cnhTipo"
                    label="CNH - Tipo"
                    options={cnhTipo}
                />


            </div>
            <h3 className="text-xl font-semibold text-white my-6 text-center">Anexos</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                <FileUpload
                    label="Documento de identidade (RG)"
                    onSelected={(file) =>
                        setValue(
                            "arquivoRG",
                            file
                        )
                    }
                />

                <FileUpload
                    label="CNH"
                    onSelected={(file) =>
                        setValue(
                            "arquivoCNH",
                            file
                        )
                    }
                />

                <FileUpload
                    label="CPF"
                    onSelected={(file) =>
                        setValue(
                            "arquivoCPF",
                            file
                        )
                    }
                />

                <FileUpload
                    label="Comprovante de Residência"
                    onSelected={(file) =>
                        setValue(
                            "arquivoComprovanteResidencia",
                            file
                        )
                    }
                />

            </div>
        </>
    );
};
