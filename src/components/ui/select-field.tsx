import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type SelectFieldProps<T extends FieldValues,> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  options: string[];
  className?: string;
};

export const SelectField = <T extends FieldValues,>({
  control,
  name,
  label,
  placeholder = "Selecione",
  options,
  className,
} : SelectFieldProps<T>) => {
  return (
    <div>
      <label className="pio-label">{label}</label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select value={field.value ?? ""} onValueChange={field.onChange}>
            <SelectTrigger className={className ?? "pio-input"}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
};
