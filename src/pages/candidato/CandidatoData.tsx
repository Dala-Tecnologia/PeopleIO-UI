import type { FormData } from "@/types/FormData";

interface CandidatoDataProps {
  candidato: FormData;
}

const DataField = ({ label, value }: { label: string; value: string | null | undefined }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-lg text-white">{value}</p>
    </div>
  );
};

export const CandidatoData = ({ candidato }: CandidatoDataProps) => {
  return (
    <div className="space-y-8">
      {/* Dados Pessoais */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Dados Pessoais</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="Nome Completo" value={candidato.nome} />
          <DataField label="Nome Social" value={candidato.nomeSocial} />
          <DataField label="CPF" value={candidato.cpf} />
          <DataField label="Data de Nascimento" value={candidato.dataNascimento} />
          <DataField label="Email" value={candidato.email} />
          <DataField label="Telefone" value={candidato.telefone} />
          <DataField label="Cor/Raça" value={candidato.corRaca} />
          <DataField label="Sexo" value={candidato.sexo} />
          <DataField label="Escolaridade" value={candidato.escolaridade} />
          <DataField label="Estado Civil" value={candidato.estadoCivil} />
          <DataField label="Naturalidade" value={candidato.naturalidade} />
          <DataField label="Nacionalidade" value={candidato.nacionalidade} />
        </div>
      </section>

      {/* Endereço */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Endereço</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="CEP" value={candidato.endereco.cep} />
          <DataField label="Rua" value={candidato.endereco.rua} />
          <DataField label="Número" value={candidato.endereco.numero} />
          <DataField label="Bairro" value={candidato.endereco.bairro} />
          <DataField label="Cidade" value={candidato.endereco.cidade} />
          <DataField label="Estado" value={candidato.endereco.estado} />
        </div>
      </section>

      {/* Documentação */}
      <section>
        <h4 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Documentação</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DataField label="RG - Número" value={candidato.identidadeNumero} />
          <DataField label="RG - Órgão Emissor" value={candidato.identidadeOrgaoEmissor} />
          <DataField label="RG - UF" value={candidato.identidadeUF} />
          <DataField label="RG - Data de Emissão" value={candidato.identidadeDataEmissao} />
          <DataField label="CTPS - Número" value={candidato.ctpsNumero} />
          <DataField label="CTPS - Série" value={candidato.ctpsSerie} />
          <DataField label="CTPS - Data de Emissão" value={candidato.ctpsDataEmissao} />
          <DataField label="CTPS - UF" value={candidato.ctpsuf} />
        </div>
      </section>
      
      {/* CNH */}
      {candidato.cnhNumero && (
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
      )}

    </div>
  );
};
