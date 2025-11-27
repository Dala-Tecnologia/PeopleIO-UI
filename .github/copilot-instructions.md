# PeopleIO-UI Copilot Instructions

## Architecture Overview

**PeopleIO-UI** is a React 19 + TypeScript + Vite application for collecting employee/contractor data via a multi-section form with validation, document uploads to Azure Blob Storage, and backend submission to a .NET API.

### Key Application Flow
1. **FormularioColaborador** (main form component) orchestrates three sub-forms via `react-hook-form` + `zod` validation
2. **Form State** is centralized in `FormData` type; validation schemas defined in `colaboradorSchema.ts`
3. **File Uploads** go directly to Azure Blob Storage using SAS token; URLs are stored in payload
4. **Backend Integration** posts complete payload to `https://peopleio-api-dev.azurewebsites.net/api/v1/colaboradores`

### Component Hierarchy
```
FormularioColaborador
├── DadosPessoaisForm (personal data: name, CPF, email, phone, dates)
├── EnderecoForm (address with CEP autocomplete via ViaCEP API)
├── DocumentosForm (file uploads: RG, CNH, CPF, proof of residence)
└── FileUpload (individual file picker)
```

## Project Setup & Workflows

### Build & Development
- **Dev**: `npm run dev` (Vite HMR enabled)
- **Build**: `npm run build` (runs `tsc -b` type check, then `vite build`)
- **Lint**: `npm run lint` (ESLint + TypeScript)

### Key Paths
- `@` alias points to `src/` (configured in `vite.config.ts` and `tsconfig.json`)
- UI components: `src/components/ui/` (Radix-UI primitives + Tailwind)
- Forms: `src/components/form/` (sub-forms + main orchestrator)
- Validation: `src/components/schemas/`
- Utilities: `src/functions/` (input masking, CEP/CPF/phone formatters)
- Type definitions: `src/types/FormData.ts`

## Design Patterns & Conventions

### Form Handling (react-hook-form + Zod)
- **Resolver**: All forms use `zodResolver(colaboradorSchema)` pattern
- **Mode**: Set to `"onChange"` for real-time validation feedback
- **Props Pattern**: Sub-forms receive `register`, `control`, `errors`, `setValue` from parent
- **Nested Fields**: Access via dot notation—e.g., `setValue("endereco.cep", value)`

Example:
```tsx
const { control, register, setValue, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(colaboradorSchema),
  mode: "onChange",
});
```

### Input Masking
- Applied via reusable `mask` prop on `InputField` component
- Masking functions: `insertMaskInCPF()`, `insertMaskInPhone()`, `insertMaskInCEP()`
- Location: `src/functions/` with individual files per function
- Pattern: Strip non-digits, apply regex formatting (e.g., `"000.000.000-00"` for CPF)

### File Upload Architecture
- **Hook**: `useBlobUploader()` (src/hooks/useBlobUploader.ts) wraps Azure Blob logic
- **Blob URL**: From `import.meta.env.VITE_AZURE_BLOB_URL` (environment variable)
- **Upload Method**: Direct HTTP `PUT` with `x-ms-blob-type: BlockBlob` header
- **Filename Pattern**: `{prefix}-{uuid}-{name}.{extension}` (e.g., `RG-abc123-João Silva.pdf`)
- **Payload**: Includes `nomeArquivo`, `url`, `tipoMime`, `dataUpload`

### Styling & Utility Classes
- **Framework**: Tailwind CSS v4 + custom classes (`.pio-input`, `.pio-label` defined in `App.css`)
- **Class Merging**: Use `cn()` utility from `src/lib/utils.ts` to safely merge Tailwind classes
- **Pattern**: Radix-UI components + Tailwind styling (see `src/components/ui/`)

### Error Handling
- **Validation Errors**: Displayed via `error?.message` from `FieldError` object
- **API Errors**: Thrown as exceptions; currently logged to console
- **Network Errors**: File uploads throw on non-2xx response

## Critical Files for Common Tasks

| Task | Files |
|------|-------|
| Add new form field | `src/components/schemas/colaboradorSchema.ts` (add Zod validation), `src/types/FormData.ts` (add type), target sub-form component |
| Add input masking | `src/functions/{name}.ts`, import into sub-form, pass as `mask` prop to `InputField` |
| Modify validation | `src/components/schemas/colaboradorSchema.ts` (update schema) |
| Change form layout/styling | Target sub-form component or main `FormularioColaborador` (Tailwind classes) |
| Fix API integration | `FormularioColaborador.onSubmit()` method; note: SAS token currently hardcoded |
| Add/update UI component | `src/components/ui/` (new or modify existing Radix-UI wrapper) |

## Critical Gotchas & Current Issues

1. **Hardcoded SAS Token**: In `FormularioColaborador.uploadToBlob()`, SAS token is hardcoded as `"SEU_SAS_AQUI"` (placeholder). This will fail in production—move to environment variables ASAP.
2. **MIME Type Bug**: All file uploads use `data.arquivoRG!.type` regardless of file type; should use the correct file's MIME type.
3. **CEP Autocomplete**: Uses public ViaCEP API (no auth); assumes 8-digit format after masking.
4. **No Error UI**: API errors are logged to console but not shown to user—needs proper error handling component.
5. **Environment Variables**: Blob URL loaded via `import.meta.env.VITE_AZURE_BLOB_URL`; ensure `.env` or `.env.local` is configured.

## Testing & Debugging

- **Type Checking**: `tsc` validates types before build; check for TS errors in terminal
- **Form Validation**: Real-time via Zod; inspect browser DevTools console for `errors` object
- **File Upload Logs**: Check browser console for fetch responses and error messages
- **API Response**: Logged as `"Enviado com sucesso: {result}"` on successful submission

## When Adding New Features

1. **Update Type**: Add field to `FormData` type in `src/types/FormData.ts`
2. **Add Validation**: Define Zod schema in `src/components/schemas/colaboradorSchema.ts`
3. **Add Field Component**: Use `InputField`/`SelectField`/`DateField` in appropriate sub-form
4. **If Masking Needed**: Create utility in `src/functions/{name}.ts`
5. **Test Validation**: Run `npm run build` to catch TypeScript errors
6. **Verify in Form**: Check real-time validation in browser

---

**Last Updated**: November 27, 2025
