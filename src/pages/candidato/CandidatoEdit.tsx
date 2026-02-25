import { useState } from "react";
import type { FormData } from "@/types/FormData";
import { formatDateBROnly } from "@/functions/formatDate";
import { useBlobUploader } from "@/hooks/useBlobUploader";
import { candidatoService } from "@/services/candidatoService";
import { cleanFormData } from "@/lib/cleanFormData";

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
}: {
  label: string;
  value: string | null | undefined;
  name?: string;
  editable?: boolean;
  onChange?: (name: string | undefined, value: string) => void;
  isDate?: boolean;
}) => {
  if (!value && !editable) return null;

  const displayValue = isDate ? formatDateBROnly(value) : value;

  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {editable ? (
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

export const CandidatoData = ({ candidato, candidatoId }: CandidatoDataProps) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<FormData>(candidato);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(candidato.fotoUrl?.url || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const { uploadFile } = useBlobUploader();

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
      console.log("Candidato atualizado com sucesso:", cleanedData);
      setEditing(false);
      setPhotoFile(null);
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
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        {saveError && (
          <div className="px-4 py-3 bg-red-900/50 border border-red-600 rounded text-red-100 text-sm">
            {saveError}
          </div>
        )}
        <div className="flex justify-end gap-2">
          {!editing && (
            <button
              className="px-3 py-1 bg-blue-950 rounded text-white hover:bg-blue-900 disabled:opacity-50"
              onClick={() => setEditing(true)}
            >
              Editar
            </button>
          )}
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
          <DataField label="Data de Nascimento" value={local.dataNascimento} name="dataNascimento" onChange={handleFieldChange} isDate={true} />
          <DataField label="Email" value={local.email} name="email" editable={editing} onChange={handleFieldChange} />
          <DataField label="Telefone" value={local.telefone} name="telefone" editable={editing} onChange={handleFieldChange} />
          <DataField label="Cor/Raça" value={local.corRaca} name="corRaca" editable={editing} onChange={handleFieldChange} />
          <DataField label="Sexo" value={local.sexo} name="sexo" editable={editing} onChange={handleFieldChange} />
          <DataField label="Escolaridade" value={local.escolaridade} name="escolaridade" editable={editing} onChange={handleFieldChange} />
          <DataField label="Estado Civil" value={local.estadoCivil} name="estadoCivil" editable={editing} onChange={handleFieldChange} />
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
          <DataField label="RG - Número" value={local.identidadeNumero} name="identidadeNumero" onChange={handleFieldChange} />
          <DataField label="RG - Órgão Emissor" value={local.identidadeOrgaoEmissor} name="identidadeOrgaoEmissor" onChange={handleFieldChange} />
          <DataField label="RG - UF" value={local.identidadeUF} name="identidadeUF" onChange={handleFieldChange} />
          <DataField label="RG - Data de Emissão" value={local.identidadeDataEmissao} name="identidadeDataEmissao" onChange={handleFieldChange} isDate={true} />
          <DataField label="CTPS - Número" value={local.ctpsNumero} name="ctpsNumero" onChange={handleFieldChange} />
          <DataField label="CTPS - Série" value={local.ctpsSerie} name="ctpsSerie" onChange={handleFieldChange} />
          <DataField label="CTPS - Data de Emissão" value={local.ctpsDataEmissao} name="ctpsDataEmissao" onChange={handleFieldChange} isDate={true} />
          <DataField label="CTPS - UF" value={local.ctpsuf} name="ctpsuf" onChange={handleFieldChange} />
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
    </div>
  );
}
