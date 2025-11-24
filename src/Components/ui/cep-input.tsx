// components/ui/cep-input.tsx
"use client"

import * as React from "react"
import InputMask from "react-input-mask"
import { cn } from "@/lib/utils" // Utility for combining Tailwind classes
import { Input } from "@/components/ui/input" // shadcn/ui Input component

const CEPInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <InputMask mask="99999-999" maskChar={null} {...props}>
        {(inputProps: string[]) => (
          <Input
            {...inputProps}
            ref={ref}
            className={cn("w-full", className)}
            placeholder="00000-000"
          />
        )}
      </InputMask>
    )
  }
)
CEPInput.displayName = "CEPInput"

export { CEPInput }
