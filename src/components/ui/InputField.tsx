import React from "react";
import type { FieldError } from "react-hook-form";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const InputField = ({ label, error, ...props }: InputFieldProps) => {
  return (
    <div>
      <label className="pio-label">{label}</label>

      <input
        {...props}
        className={`pio-input ${
          error ? "pio-input-error" : "pio-input"
        }`}
      />

      {error && (
        <p className="text-red-500 text-sm">{error.message}</p>
      )}
    </div>
  );
};
