import { Controller, type Control, type FieldError, type FieldValues, type Path } from "react-hook-form";
import { DatePicker } from "@/components/ui/datepicker";
import type { ReactNode } from "react";

type DateFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: ReactNode;
  error?: FieldError;
};

export const DateField = <T extends FieldValues,>({ control, name, label, error }: DateFieldProps<T>) => {
  return (
    <div>
      <label className="pio-label">{label}</label>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <DatePicker
            value={field.value ? new Date(field.value) : undefined}
            onChange={(date) => field.onChange(date?.toISOString() ?? "")}
          />
        )}
      />

      {error && (
        <span className="text-red-500 text-sm">{error.message}</span>
      )}
    </div>
  );
};
