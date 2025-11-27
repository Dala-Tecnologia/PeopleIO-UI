import type {
  Control,
  UseFormRegister,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import type {  FormDataInput } from "@/types/FormData";
import { DatePicker } from "@/components/ui/datepicker";
import { FileUpload } from "@/components/FileUpload";

interface DocumentosFormProps {
  register: UseFormRegister<FormDataInput>;
  control: Control<FormDataInput>;
  setValue: UseFormSetValue<FormDataInput>;
  errors: FieldErrors<FormDataInput>;
}

export const DocumentosForm = ({ register, control, setValue }: DocumentosFormProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="pio-label">RG</label>
        <input {...register("identidadeNumero")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">Órgão Emissor</label>
        <input {...register("identidadeOrgaoEmissor")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">UF do RG</label>
        <input {...register("identidadeUF")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">Data de Emissão</label>
        <Controller
          control={control}
          name="identidadeDataEmissao"
          render={({ field }) => (
            <DatePicker
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date?.toISOString() ?? "")}
            />
          )}
        />
      </div>

      <div>
        <label className="pio-label">CTPS Número</label>
        <input {...register("ctpsNumero")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">CTPS Série</label>
        <input {...register("ctpsSerie")} className="pio-input" />
      </div>

      <div>
        <label className="pio-label">Data Emissão CTPS</label>
        <Controller
          control={control}
          name="ctpsDataEmissao"
          render={({ field }) => (
            <DatePicker
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date?.toISOString() ?? "")}
            />
          )}
        />
      </div>
      <FileUpload
        label="RG (PDF/Imagem)"
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
  );
};
