

export function FormularioColaborador() {
  return (
    <form className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Cadastro de Colaborador</h2>

      {/* Dados Pessoais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nome</label>
          <input type="text" name="nome" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">CPF</label>
          <input type="text" name="cpf" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
          <input type="date" name="dataNascimento" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" name="email" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Telefone</label>
          <input type="text" name="telefone" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>

      {/* Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">RG</label>
          <input type="text" name="rg" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Órgão Emissor</label>
          <input type="text" name="orgaoEmissor" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">UF</label>
          <input type="text" name="uf" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Emissão</label>
          <input type="date" name="dataEmissao" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>

      {/* Dados Contratuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Cargo</label>
          <input type="text" name="cargo" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Departamento</label>
          <input type="text" name="departamento" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Admissão</label>
          <input type="date" name="dataAdmissao" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Data de Demissão</label>
          <input type="date" name="dataDemissao" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>

      {/* Botão de envio */}
      <div className="pt-4">
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Salvar Colaborador
        </button>
      </div>
    </form>
  );
}