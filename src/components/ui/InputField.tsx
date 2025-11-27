import React from "react";
import type { FieldError } from "react-hook-form";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
  mask?: (value: string) => string;
};

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, mask, ...props }, ref) => {
    return (
      <div>
        <label className="pio-label">{label}</label>
        <input
          {...props}
          ref={ref}
          className="pio-input"
          onChange={(e) => {
            let value = e.target.value;
            if (mask) {
              value = mask(value);
              e.target.value = value;
            }

            props.onChange?.(e); // mantém RHF funcionando
          }}
        />

        {error && (
          <span className="text-red-500 text-sm">{error.message}</span>
        )}
      </div>
    );
  }
);
