import { useState } from "react";
import axios from "axios";
import type { Arquivo, FormData } from "@/types/FormData";
import { formatDateBROnly } from "@/functions/formatDate";
import { useBlobUploader } from "@/hooks/useBlobUploader";
import { candidatoService } from "@/services/candidatoService";
import { documentoService } from "@/services/documentoService";
import { cleanFormData } from "@/lib/cleanFormData";
import { sexoOptions, corRacaOptions, escolaridadeOptions, estadoCivilOptions } from "@/constrants/options";

type ValidationStatus = 'idle' | 'processing' | 'valid' | 'invalid';
interface FileValidation { status: ValidationStatus; errorMessage?: string; }
type AnexoKey = 'arquivoRG' | 'arquivoCNH' | 'arquivoCPF' | 'arquivoComprovanteResidencia' | 'arquivoCurriculo';

interface CandidatoDataProps {
  candidato: FormData;
  candidatoId?: string;
}

const DataField = ({
  label,
  value,
  name,
  editable = false,
  onChange,
  isDate = false,
  selectOptions,
}: {
  label: string;
  value: string | null | undefined;
  name?: string;
  editable?: boolean;
  onChange?: (name: string | undefined, value: string) => void;
  isDate?: boolean;
  selectOptions?: { value: string; label: string }[];
}) => {
  if (!value && !editable) return null;

  const displayValue = selectOptions
    ? (selectOptions.find(o => o.value === value)?.label ?? value)
    : isDate ? formatDateBROnly(value) : value;

  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {editable && selectOptions ? (
        <select
          className="pio-input mt-1 w-full bg-gray-800 text-white p-2 rounded"
          value={value ?? ""}
          onChange={(e) => onChange?.(name, e.target.value)}
        >
          <option value="">Selecione...</option>
          {selectOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : editable ? (
        <input
          type={isDate ? "date" : "text"}
          className="pio-input mt-1 w-full bg-gray-800 text-white p-2 rounded"
          value={value ?? ""}
          onChange={(e) => onChange?.(name, e.target.value)}
        />
      ) : (
        <p className="text-lg text-white">{displayValue}</p>
      )}
    </div>
  );
};

const fileInputClass = "block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-950 file:text-white hover:file:bg-blue-900 cursor-pointer";

function AnexoUploadField({ label, arquivo, file, editing, validation, accept, onFileChange, onConfirm, confirmLabel }: {
  label: string;
  arquivo: Arquivo | null | undefined;
  file: File | null;
  editing: boolean;
  validation: FileValidation;
  accept: string;
  onFileChange: (f: File | null) => void;
  onConfirm: () => void;
  confirmLabel: string;
}) {
  const isProcessing = validation.status === 'processing';
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <h5 className="text-md font-semibold text-white mb-3">{label}</h5>
      <div className="space-y-2">
        {arquivo && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Arquivo atual:</span>
            <a href={arquivo.url} target="_blank" rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline truncate max-w-xs">
              {arquivo.nomeArquivo}
            </a>
          </div>
        )}
        {editing && (
          <div className="space-y-2">
            <input type="file" accept={accept} className={fileInputClass}
              onChange={(e) => onFileChange(e.target.files?.[0] || null)} />
            {file && (
              <button onClick={onConfirm} disabled={isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? "Enviando e validando..." : confirmLabel}
              </button>
            )}
            {validation.status === 'valid' && <p className="text-sm text-green-400">✓ Documento aceito</p>}
            {validation.status === 'invalid' && <p className="text-sm text-red-400">✗ {validation.errorMessage}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export const CandidatoData = ({ candidato, candidatoId }: CandidatoDataProps) => {
  const [editing, setEditing] = useState(true);
  const [local, setLocal] = useState<FormData>(candidato);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(candidato.fotoUrl?.url || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Estados para os anexos
  const [arquivoRGFile, setArquivoRGFile] = useState<File | null>(null);
  const [arquivoCNHFile, setArquivoCNHFile] = useState<File | null>(null);
  const [arquivoCPFFile, setArquivoCPFFile] = useState<File | null>(null);
  const [arquivoComprovanteFile, setArquivoComprovanteFile] = useState<File | null>(null);
  const [arquivoCurriculoFile, setArquivoCurriculoFile] = useState<File | null>(null);

  const [anexoValidation, setAnexoValidation] = useState<Record<AnexoKey, FileValidation>>({
    arquivoRG: { status: 'idle' },
    arquivoCNH: { status: 'idle' },
    arquivoCPF: { status: 'idle' },
    arquivoComprovanteResidencia: { status: 'idle' },
    arquivoCurriculo: { status: 'idle' },
  });

  const { uploadFile } = useBlobUploader();

  function setAnexoStatus(field: AnexoKey, validation: FileValidation) {
    setAnexoValidation(prev => ({ ...prev, [field]: validation }));
  }

  function getApiError(error: unknown, fallback: string): string {
    if (axios.isAxiosError(error) && error.response?.data?.errors?.[0]) {
      return error.response.data.errors[0];
    }
    return fallback;
  }

  async function buildArquivo(file: File, prefix: string): Promise<{ arquivo: Arquivo; blobUrl: string }> {
    const extension = file.name.split('.').pop();
    const filename = `${prefix}-${crypto.randomUUID()}-${local.nome}.${extension}`;
    const blobUrl = await uploadFile(file, filename, local.cpf);
    return {
      arquivo: { nomeArquivo: filename, url: blobUrl, tipoMime: file.type, dataUpload: new Date().toISOString() },
      blobUrl,
    };
  }

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const newObj = { ...obj };
    let cur: any = newObj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      cur[k] = { ...(cur[k] ?? {}) };
      cur = cur[k];
    }
    cur[keys[keys.length - 1]] = value;
    return newObj;
  };

  const handleFieldChange = (name: string | undefined, value: string) => {
    if (!name) return;
    setLocal((prev) => setNestedValue(prev, name, value));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;

    setUploadingPhoto(true);
    try {
      const filename = `foto-perfil-${Date.now()}.${photoFile.name.split(".").pop()}`;
      const remotePath = await uploadFile(photoFile, filename, local.cpf);

      const newFotoUrl = {
        nomeArquivo: photoFile.name,
        url: remotePath,
        tipoMime: photoFile.type,
        dataUpload: new Date().toISOString(),
      };

      setLocal((prev) => ({
        ...prev,
        fotoUrl: newFotoUrl,
      }));

      setPhotoFile(null);
      console.log("Foto de perfil atualizada com sucesso");
    } catch (error) {
      console.error("Erro ao fazer upload da foto:", error);
      alert("Erro ao fazer upload da foto. Tente novamente.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRGUpload = async () => {
    if (!arquivoRGFile) return;
    setAnexoStatus('arquivoRG', { status: 'processing' });
    try {
      const { arquivo, blobUrl } = await buildArquivo(arquivoRGFile, 'RG');
      await documentoService.validarRG({
        blobUrl,
        identidadeNumero: local.identidadeNumero,
        identidadeUF: local.identidadeUF,
        identidadeDataEmissao: local.identidadeDataEmissao,
      });
      setLocal(prev => ({ ...prev, arquivoRG: arquivo }));
      setArquivoRGFile(null);
      setAnexoStatus('arquivoRG', { status: 'valid' });
    } catch (error) {
      setAnexoStatus('arquivoRG', { status: 'invalid', errorMessage: getApiError(error, 'Erro ao validar o RG. Verifique o documento e os dados cadastrados.') });
    }
  };

  const handleCNHUpload = async () => {
    if (!arquivoCNHFile) return;
    setAnexoStatus('arquivoCNH', { status: 'processing' });
    try {
      const { arquivo, blobUrl } = await buildArquivo(arquivoCNHFile, 'CNH');
      await documentoService.validarCNH({
        blobUrl,
        cnhNumero: local.cnhNumero,
        cpf: local.cpf,
        dataNascimento: local.dataNascimento,
        cnhDataVencimento: local.cnhDataVencimento,
      });
      setLocal(prev => ({ ...prev, arquivoCNH: arquivo }));
      setArquivoCNHFile(null);
      setAnexoStatus('arquivoCNH', { status: 'valid' });
    } catch (error) {
      setAnexoStatus('arquivoCNH', { status: 'invalid', errorMessage: getApiError(error, 'Erro ao validar a CNH. Verifique o documento e os dados cadastrados.') });
    }
  };

  const handleComprovanteUpload = async () => {
    if (!arquivoComprovanteFile) return;
    setAnexoStatus('arquivoComprovanteResidencia', { status: 'processing' });
    try {
      const { arquivo, blobUrl } = await buildArquivo(arquivoComprovanteFile, 'CR');
      await documentoService.validarComprovante({
        blobUrl,
        nome: local.nome,
        rua: local.endereco.rua,
        cidade: local.endereco.cidade,
        cep: local.endereco.cep,
      });
      setLocal(prev => ({ ...prev, arquivoComprovanteResidencia: arquivo }));
      setArquivoComprovanteFile(null);
      setAnexoStatus('arquivoComprovanteResidencia', { status: 'valid' });
    } catch (error) {
      setAnexoStatus('arquivoComprovanteResidencia', { status: 'invalid', errorMessage: getApiError(error, 'Erro ao validar o comprovante. Verifique o documento e os dados cadastrados.') });
    }
  };

  const handleSimpleUpload = async (
    file: File | null,
    prefix: string,
    field: AnexoKey,
    setFile: (v: File | null) => void
  ) => {
    if (!file) return;
    setAnexoStatus(field, { status: 'processing' });
    try {
      const { arquivo } = await buildArquivo(file, prefix);
      setLocal(prev => ({ ...prev, [field]: arquivo }));
      setFile(null);
      setAnexoStatus(field, { status: 'valid' });
    } catch {
      setAnexoStatus(field, { status: 'invalid', errorMessage: 'Erro ao enviar o arquivo. Tente novamente.' });
    }
  };

  const handleSave = async () => {
    if (!candidatoId) {
      setSaveError("ID do candidato não encontrado");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const cleanedData = cleanFormData(local);
      await candidatoService.update(candidatoId, cleanedData);
      setPhotoFile(null);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao salvar candidato:", error);
      setSaveError(
        error instanceof Error ? error.message : "Erro ao salvar as alterações. Tente novamente."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setLocal(candidato);
    setEditing(false);
    setPhotoFile(null);
    setPhotoPreview(candidato.fotoUrl?.url || null);
    setSaveError(null);
    
    setArquivoRGFile(null);
    setArquivoCNHFile(null);
    setArquivoCPFFile(null);
    setArquivoComprovanteFile(null);
    setArquivoCurriculoFile(null);
    setAnexoValidation({
      arquivoRG: { status: 'idle' },
      arquivoCNH: { status: 'idle' },
      arquivoCPF: { status: 'idle' },
      arquivoComprovanteResidencia: { status: 'idle' },
      arquivoCurriculo: { status: 'idle' },
    });
  };

  return (
    <>
    {showSuccessModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/70" />
        <div className="relative bg-gray-800 rounded-lg shadow-xl p-8 flex flex-col items-center gap-4 min-w-[280px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-900">
            <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white">Dados atualizados!</h3>
          <button
            onClick={() => setShowSuccessModal(false)}
            className="mt-2 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
          >
            Ok
          </button>
        </div>
      </div>
    )}
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        {saveError && (
          <div className="px-4 py-3 bg-red-900/50 border border-red-600 rounded text-red-100 text-sm">
            {saveError}
          </div>
        )}
        <div className="flex justify-end gap-2">
          {editing && (
            <>
              <button
                className="px-3 py-1 bg-blue-950 rounded text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Atualizar"}
              </button>
              <button
                className="px-3 py-1 bg-red-600 rounded text-white hover:bg-red-700 disabled:opacity-50"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>
      {/* Foto de Perfil */}
      <section className="bg-gray-800/50 p-6 rounded-lg">
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Foto de Perfil</h4>
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
            {photoPreview ? (
              <img src={photoPreview} alt="Prévia da foto" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400">Sem foto</span>
            )}
          </div>

          {editing && (
            <div className="w-full max-w-xs">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-950 file:text-white
                  hover:file:bg-blue-900
                  cursor-pointer"
              />
              {photoFile && (
                <button
                  onClick={handlePhotoUpload}
                  disabled={uploadingPhoto}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed w-full"
                >
                  {uploadingPhoto ? "Enviando..." : "Confirmar Upload"}
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      {/* Dados Pessoais */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Nome Completo" value={local.nome} name="nome" editable={editing} onChange={handleFieldChange} />
          <DataField label="Nome Social" value={local.nomeSocial} name="nomeSocial" editable={editing} onChange={handleFieldChange} />
          <DataField label="CPF" value={local.cpf} name="cpf" onChange={handleFieldChange} />
          <DataField label="Data de Nascimento" value={local.dataNascimento} name="dataNascimento" editable={editing} onChange={handleFieldChange} isDate={true} />
          <DataField label="Email" value={local.email} name="email" editable={editing} onChange={handleFieldChange} />
          <DataField label="Telefone" value={local.telefone} name="telefone" editable={editing} onChange={handleFieldChange} />
          <DataField label="Cor/Raça" value={local.corRaca} name="corRaca" editable={editing} onChange={handleFieldChange} selectOptions={corRacaOptions} />
          <DataField label="Sexo" value={local.sexo} name="sexo" editable={editing} onChange={handleFieldChange} selectOptions={sexoOptions} />
          <DataField label="Escolaridade" value={local.escolaridade} name="escolaridade" editable={editing} onChange={handleFieldChange} selectOptions={escolaridadeOptions} />
          <DataField label="Estado Civil" value={local.estadoCivil} name="estadoCivil" editable={editing} onChange={handleFieldChange} selectOptions={estadoCivilOptions} />
          <DataField label="Naturalidade" value={local.naturalidade} name="naturalidade" editable={editing} onChange={handleFieldChange} />
          <DataField label="Nacionalidade" value={local.nacionalidade} name="nacionalidade" editable={editing} onChange={handleFieldChange} />
        </div>
      </section>

      {/* Endereço */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Endereço</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="CEP" value={local.endereco.cep} name="endereco.cep" editable={editing} onChange={handleFieldChange} />
          <DataField label="Rua" value={local.endereco.rua} name="endereco.rua" editable={editing} onChange={handleFieldChange} />
          <DataField label="Número" value={local.endereco.numero} name="endereco.numero" editable={editing} onChange={handleFieldChange} />
          <DataField label="Bairro" value={local.endereco.bairro} name="endereco.bairro" editable={editing} onChange={handleFieldChange} />
          <DataField label="Cidade" value={local.endereco.cidade} name="endereco.cidade" editable={editing} onChange={handleFieldChange} />
          <DataField label="Estado" value={local.endereco.estado} name="endereco.estado" editable={editing} onChange={handleFieldChange} />
        </div>
      </section>

      {/* Documentação */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Documentação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="RG - Número" value={local.identidadeNumero} name="identidadeNumero" editable={editing} onChange={handleFieldChange} />
          <DataField label="RG - Órgão Emissor" value={local.identidadeOrgaoEmissor} name="identidadeOrgaoEmissor" editable={editing} onChange={handleFieldChange} />
          <DataField label="RG - UF" value={local.identidadeUF} name="identidadeUF" editable={editing} onChange={handleFieldChange} />
          <DataField label="RG - Data de Emissão" value={local.identidadeDataEmissao} name="identidadeDataEmissao" editable={editing} onChange={handleFieldChange} isDate={true} />
          <DataField label="CTPS - Número" value={local.ctpsNumero} name="ctpsNumero" editable={editing} onChange={handleFieldChange} />
          <DataField label="CTPS - Série" value={local.ctpsSerie} name="ctpsSerie" editable={editing} onChange={handleFieldChange} />
          <DataField label="CTPS - Data de Emissão" value={local.ctpsDataEmissao} name="ctpsDataEmissao" editable={editing} onChange={handleFieldChange} isDate={true} />
          <DataField label="CTPS - UF" value={local.ctpsuf} name="ctpsuf" editable={editing} onChange={handleFieldChange} />
        </div>
      </section>
      
      {/* Título de Eleitor */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Título de Eleitor</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Título de Eleitor" value={local.tituloEleitor} name="tituloEleitor" editable={editing} onChange={handleFieldChange} />
          <DataField label="Título - Data de Emissão" value={local.tituloDataEmissao} name="tituloDataEmissao" editable={editing} onChange={handleFieldChange} isDate={true} />
          <DataField label="Título - UF" value={local.tituloUF} name="tituloUF" editable={editing} onChange={handleFieldChange} />
          <DataField label="Título - Zona" value={local.tituloZona} name="tituloZona" editable={editing} onChange={handleFieldChange} />
          <DataField label="Título - Seção" value={local.tituloSecao} name="tituloSecao" editable={editing} onChange={handleFieldChange} />
        </div>
      </section>
      
      {/* CNH */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">CNH</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="CNH - Número" value={local.cnhNumero} name="cnhNumero" editable={editing} onChange={handleFieldChange} />
          <DataField label="CNH - UF" value={local.cnhuf} name="cnhuf" editable={editing} onChange={handleFieldChange} />
          <DataField label="CNH - Data de Vencimento" value={local.cnhDataVencimento} name="cnhDataVencimento" editable={editing} onChange={handleFieldChange} isDate={true} />
          <DataField label="CNH - Órgão Emissor" value={local.cnhOrgaoEmissor} name="cnhOrgaoEmissor" editable={editing} onChange={handleFieldChange} />
          <DataField label="CNH - Tipo" value={local.cnhTipo} name="cnhTipo" editable={editing} onChange={handleFieldChange} />
        </div>
      </section>

      {/* Anexos */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Anexos</h4>
        <div className="space-y-6">
          {/* RG */}
          <AnexoUploadField
            label="RG"
            arquivo={local.arquivoRG}
            file={arquivoRGFile}
            editing={editing}
            validation={anexoValidation.arquivoRG}
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(f) => { setArquivoRGFile(f); setAnexoStatus('arquivoRG', { status: 'idle' }); }}
            onConfirm={handleRGUpload}
            confirmLabel="Confirmar Upload RG"
          />

          {/* CNH */}
          <AnexoUploadField
            label="CNH"
            arquivo={local.arquivoCNH}
            file={arquivoCNHFile}
            editing={editing}
            validation={anexoValidation.arquivoCNH}
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(f) => { setArquivoCNHFile(f); setAnexoStatus('arquivoCNH', { status: 'idle' }); }}
            onConfirm={handleCNHUpload}
            confirmLabel="Confirmar Upload CNH"
          />

          {/* CPF */}
          <AnexoUploadField
            label="CPF"
            arquivo={local.arquivoCPF}
            file={arquivoCPFFile}
            editing={editing}
            validation={anexoValidation.arquivoCPF}
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(f) => { setArquivoCPFFile(f); setAnexoStatus('arquivoCPF', { status: 'idle' }); }}
            onConfirm={() => handleSimpleUpload(arquivoCPFFile, 'CPF', 'arquivoCPF', setArquivoCPFFile)}
            confirmLabel="Confirmar Upload CPF"
          />

          {/* Comprovante de Residência */}
          <AnexoUploadField
            label="Comprovante de Residência"
            arquivo={local.arquivoComprovanteResidencia}
            file={arquivoComprovanteFile}
            editing={editing}
            validation={anexoValidation.arquivoComprovanteResidencia}
            accept=".pdf,.jpg,.jpeg,.png"
            onFileChange={(f) => { setArquivoComprovanteFile(f); setAnexoStatus('arquivoComprovanteResidencia', { status: 'idle' }); }}
            onConfirm={handleComprovanteUpload}
            confirmLabel="Confirmar Upload Comprovante"
          />

          {/* Currículo */}
          <AnexoUploadField
            label="Currículo"
            arquivo={local.arquivoCurriculo}
            file={arquivoCurriculoFile}
            editing={editing}
            validation={anexoValidation.arquivoCurriculo}
            accept=".pdf,.doc,.docx"
            onFileChange={(f) => { setArquivoCurriculoFile(f); setAnexoStatus('arquivoCurriculo', { status: 'idle' }); }}
            onConfirm={() => handleSimpleUpload(arquivoCurriculoFile, 'Curriculo', 'arquivoCurriculo', setArquivoCurriculoFile)}
            confirmLabel="Confirmar Upload Currículo"
          />
        </div>
      </section>
    </div>
    </>
  );
}
