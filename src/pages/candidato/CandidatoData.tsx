import React, { useState } from "react";
import type { FormData } from "@/types/FormData";

interface CandidatoDataProps {
  candidato: FormData;
}

const DataField = ({
  label,
  value,
  name,
  editable = false,
  onChange,
}: {
  label: string;
  value: string | null | undefined;
  name?: string;
  editable?: boolean;
  onChange?: (name: string | undefined, value: string) => void;
}) => {
  if (!value && !editable) return null;
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      {editable ? (
        <input
          className="pio-input mt-1 w-full bg-gray-800 text-white p-2 rounded"
          value={value ?? ""}
          onChange={(e) => onChange?.(name, e.target.value)}
        />
      ) : (
        <p className="text-lg text-white">{value}</p>
      )}
    </div>
  );
};

export const CandidatoData = ({ candidato }: CandidatoDataProps) => {
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState<FormData>(candidato);

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

  const handleSave = () => {
    console.log("Saved candidate (local state):", local);
    setEditing(false);
  };

  const handleCancel = () => {
    setLocal(candidato);
    setEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-2">
        {!editing && (
          <button
            className="px-3 py-1 bg-blue-600 rounded text-white"
            onClick={() => setEditing(true)}
          >
            Editar
          </button>
        )}
        {editing && (
          <>
            <button className="px-3 py-1 bg-blue-900 rounded text-white" onClick={handleSave}>
              Atualizar
            </button>
            <button className="px-3 py-1 bg-red-600 rounded text-white" onClick={handleCancel}>
              Cancelar
            </button>
          </>
        )}
      </div>
      {/* Dados Pessoais */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Dados Pessoais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Nome Completo" value={local.nome} name="nome" editable={editing} onChange={handleFieldChange} />
          <DataField label="Nome Social" value={local.nomeSocial} name="nomeSocial" editable={editing} onChange={handleFieldChange} />
          <DataField label="CPF" value={local.cpf} name="cpf" onChange={handleFieldChange} />
          <DataField label="Data de Nascimento" value={local.dataNascimento} name="dataNascimento" onChange={handleFieldChange} />
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
          <DataField label="RG - Data de Emissão" value={local.identidadeDataEmissao} name="identidadeDataEmissao" onChange={handleFieldChange} />
          <DataField label="CTPS - Número" value={local.ctpsNumero} name="ctpsNumero" onChange={handleFieldChange} />
          <DataField label="CTPS - Série" value={local.ctpsSerie} name="ctpsSerie" onChange={handleFieldChange} />
          <DataField label="CTPS - Data de Emissão" value={local.ctpsDataEmissao} name="ctpsDataEmissao" onChange={handleFieldChange} />
          <DataField label="CTPS - UF" value={local.ctpsuf} name="ctpsuf" onChange={handleFieldChange} />
        </div>
      </section>
      
      {/* CNH */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">CNH</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="CNH - Número" value={candidato.cnhNumero} />
          <DataField label="CNH - UF" value={candidato.cnhuf} />
          <DataField label="CNH - Data de Vencimento" value={candidato.cnhDataVencimento} />
          <DataField label="CNH - Órgão Emissor" value={candidato.cnhOrgaoEmissor} />
          <DataField label="CNH - Tipo" value={candidato.cnhTipo} />
        </div>
      </section>
    </div>
  );
}
