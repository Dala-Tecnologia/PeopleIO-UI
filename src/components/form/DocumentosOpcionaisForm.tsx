import { useState } from "react";
import axios from "axios";
import type {
    Control,
    UseFormRegister,
    UseFormSetValue,
    UseFormGetValues,
    FieldErrors,
} from "react-hook-form";
import type { FormDataInput } from "@/types/FormData";
import type { Arquivo } from "@/types/FormData";
import { FileUpload } from "@/components/FileUpload";
import { cnhTipo, estadosOptions, profissoesOptions } from "@/constrants/options";
import { SelectField } from "../ui/select-field";
import { InputField } from "../ui/InputField";
import { DateField } from "../ui/date-field";
import { somenteNumerosMascara } from "@/functions/identidadeNumero";
import { useBlobUploader } from "@/hooks/useBlobUploader";
import { documentoService } from "@/services/documentoService";

type ValidationStatus = 'idle' | 'processing' | 'valid' | 'invalid';

interface FileValidation {
    status: ValidationStatus;
    errorMessage?: string;
}

type ValidatedFileKey = 'arquivoRG' | 'arquivoCNH' | 'arquivoCPF' | 'arquivoComprovanteResidencia' | 'arquivoCurriculo';

interface DocumentosOpcionaisFormProps {
    register: UseFormRegister<FormDataInput>;
    control: Control<FormDataInput>;
    setValue: UseFormSetValue<FormDataInput>;
    errors: FieldErrors<FormDataInput>;
    getValues: UseFormGetValues<FormDataInput>;
    onFileUploaded: (field: ValidatedFileKey, arquivo: Arquivo | null) => void;
}

const initialValidation: FileValidation = { status: 'idle' };

export const DocumentosOpcionaisForm = ({ register, control, setValue, errors, getValues, onFileUploaded }: DocumentosOpcionaisFormProps) => {
    const { uploadFile } = useBlobUploader();

    const [validationState, setValidationState] = useState<Record<ValidatedFileKey, FileValidation>>({
        arquivoRG: initialValidation,
        arquivoCNH: initialValidation,
        arquivoCPF: initialValidation,
        arquivoComprovanteResidencia: initialValidation,
        arquivoCurriculo: initialValidation,
    });

    function setStatus(field: ValidatedFileKey, validation: FileValidation) {
        setValidationState(prev => ({ ...prev, [field]: validation }));
    }

    async function buildArquivo(file: File, prefix: string): Promise<{ arquivo: Arquivo; blobUrl: string }> {
        const nome = getValues('nome');
        const cpf = getValues('cpf');
        const extension = file.name.split('.').pop();
        const filename = `${prefix}-${crypto.randomUUID()}-${nome}.${extension}`;
        const blobUrl = await uploadFile(file, filename, cpf);
        return {
            arquivo: { nomeArquivo: filename, url: blobUrl, tipoMime: file.type, dataUpload: new Date().toISOString() },
            blobUrl,
        };
    }

    function getApiError(error: unknown, fallback: string): string {
        if (axios.isAxiosError(error) && error.response?.data?.errors?.[0]) {
            return error.response.data.errors[0];
        }
        return fallback;
    }

    async function handleRGFile(file: File | null) {
        setValue('arquivoRG', file);
        if (!file) {
            setStatus('arquivoRG', initialValidation);
            onFileUploaded('arquivoRG', null);
            return;
        }

        const identidadeNumero = getValues('identidadeNumero');
        const identidadeUF = getValues('identidadeUF');
        if (!identidadeNumero || !identidadeUF) {
            setStatus('arquivoRG', { status: 'invalid', errorMessage: 'Preencha o Número e a UF do RG antes de enviar o arquivo.' });
            return;
        }

        setStatus('arquivoRG', { status: 'processing' });
        try {
            const { arquivo, blobUrl } = await buildArquivo(file, 'RG');
            await documentoService.validarRG({
                blobUrl,
                identidadeNumero,
                identidadeUF,
                identidadeDataEmissao: getValues('identidadeDataEmissao') || null,
            });
            onFileUploaded('arquivoRG', arquivo);
            setStatus('arquivoRG', { status: 'valid' });
        } catch (error) {
            setStatus('arquivoRG', { status: 'invalid', errorMessage: getApiError(error, 'Erro ao validar o RG. Verifique o documento e os dados preenchidos.') });
        }
    }

    async function handleCNHFile(file: File | null) {
        setValue('arquivoCNH', file);
        if (!file) {
            setStatus('arquivoCNH', initialValidation);
            onFileUploaded('arquivoCNH', null);
            return;
        }

        const cnhNumero = getValues('cnhNumero');
        if (!cnhNumero) {
            setStatus('arquivoCNH', { status: 'invalid', errorMessage: 'Preencha o Número da CNH antes de enviar o arquivo.' });
            return;
        }

        setStatus('arquivoCNH', { status: 'processing' });
        try {
            const { arquivo, blobUrl } = await buildArquivo(file, 'CNH');
            await documentoService.validarCNH({
                blobUrl,
                cnhNumero,
                cpf: getValues('cpf'),
                dataNascimento: getValues('dataNascimento'),
                cnhDataVencimento: getValues('cnhDataVencimento') || null,
            });
            onFileUploaded('arquivoCNH', arquivo);
            setStatus('arquivoCNH', { status: 'valid' });
        } catch (error) {
            setStatus('arquivoCNH', { status: 'invalid', errorMessage: getApiError(error, 'Erro ao validar a CNH. Verifique o documento e os dados preenchidos.') });
        }
    }

    async function handleComprovanteFile(file: File | null) {
        setValue('arquivoComprovanteResidencia', file);
        if (!file) {
            setStatus('arquivoComprovanteResidencia', initialValidation);
            onFileUploaded('arquivoComprovanteResidencia', null);
            return;
        }

        const nome = getValues('nome');
        const rua = getValues('endereco.rua');
        const cidade = getValues('endereco.cidade');
        const cep = getValues('endereco.cep');
        if (!nome || !rua || !cidade || !cep) {
            setStatus('arquivoComprovanteResidencia', { status: 'invalid', errorMessage: 'Dados de endereço incompletos. Verifique Nome, Rua, Cidade e CEP.' });
            return;
        }

        setStatus('arquivoComprovanteResidencia', { status: 'processing' });
        try {
            const { arquivo, blobUrl } = await buildArquivo(file, 'CR');
            await documentoService.validarComprovante({ blobUrl, nome, rua, cidade, cep });
            onFileUploaded('arquivoComprovanteResidencia', arquivo);
            setStatus('arquivoComprovanteResidencia', { status: 'valid' });
        } catch (error) {
            setStatus('arquivoComprovanteResidencia', { status: 'invalid', errorMessage: getApiError(error, 'Erro ao validar o comprovante. Verifique o documento e os dados preenchidos.') });
        }
    }

    async function handleSimpleUpload(file: File | null, field: 'arquivoCPF' | 'arquivoCurriculo', prefix: string) {
        setValue(field, file);
        if (!file) {
            setStatus(field, initialValidation);
            onFileUploaded(field, null);
            return;
        }

        setStatus(field, { status: 'processing' });
        try {
            const { arquivo } = await buildArquivo(file, prefix);
            onFileUploaded(field, arquivo);
            setStatus(field, { status: 'valid' });
        } catch {
            setStatus(field, { status: 'invalid', errorMessage: 'Erro ao enviar o arquivo. Tente novamente.' });
        }
    }

    function FileStatus({ field }: { field: ValidatedFileKey }) {
        const { status, errorMessage } = validationState[field];
        if (status === 'processing') return <p className="text-sm text-blue-400 mt-1">Enviando e validando...</p>;
        if (status === 'valid') return <p className="text-sm text-green-400 mt-1">✓ Documento aceito</p>;
        if (status === 'invalid') return <p className="text-sm text-red-400 mt-1">✗ {errorMessage}</p>;
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <InputField
                    label={<span>Titulo de Eleitor - Número <span className="text-red-500">*</span></span>}
                    {...register("tituloEleitor")}
                    mask={somenteNumerosMascara}
                    error={errors.tituloEleitor}
                />

                <SelectField<FormDataInput>
                    control={control}
                    {...register("tituloUF")}
                    name="tituloUF"
                    label={<span>Titulo de Eleitor - UF <span className="text-red-500">*</span></span>}
                    options={estadosOptions}
                />

                <InputField
                    label={<span>Titulo de Eleitor - Zona <span className="text-red-500">*</span></span>}
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
                    mask={somenteNumerosMascara}
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

                <SelectField<FormDataInput>
                    control={control}
                    {...register("profissaoOption")}
                    name="profissaoOption"
                    label="Profissões"
                    options={profissoesOptions}
                />
            </div>

            <h3 className="text-xl font-semibold text-white my-6 text-center">Anexos</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-1">
                <div>
                    <FileUpload label="Documento de identidade (RG)" onSelected={handleRGFile} />
                    <FileStatus field="arquivoRG" />
                </div>

                <div>
                    <FileUpload label="CNH" onSelected={handleCNHFile} />
                    <FileStatus field="arquivoCNH" />
                </div>

                <div>
                    <FileUpload label="CPF" onSelected={(file) => handleSimpleUpload(file, 'arquivoCPF', 'CPF')} />
                    <FileStatus field="arquivoCPF" />
                </div>

                <div>
                    <FileUpload label="Comprovante de Residência" onSelected={handleComprovanteFile} />
                    <FileStatus field="arquivoComprovanteResidencia" />
                </div>

                <div>
                    <FileUpload label="Curriculo" onSelected={(file) => handleSimpleUpload(file, 'arquivoCurriculo', 'Curriculo')} />
                    <FileStatus field="arquivoCurriculo" />
                </div>
            </div>
        </>
    );
};
