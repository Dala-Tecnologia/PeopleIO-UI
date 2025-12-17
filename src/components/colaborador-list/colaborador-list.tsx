import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colaboradoresService } from "../../services/colaboradoresService";
import { Modal } from "@/components/ui/modal";
import { Loader } from "../ui/loader";

type Colaborador = {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
};

export const ColaboradoresList = () => {
  const [items, setItems] = useState<Colaborador[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [colaboradorToDelete, setColaboradorToDelete] = useState<Colaborador | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await colaboradoresService.list();
        setItems(data);
        setIsLoading(false);
      } catch (err: any) {
        setIsLoading(false);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const openDeleteModal = (colaborador: Colaborador) => {
    setColaboradorToDelete(colaborador);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setColaboradorToDelete(null);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (colaboradorToDelete) {
      await colaboradoresService.delete(colaboradorToDelete.id);
      setItems(items.filter((c) => c.id !== colaboradorToDelete.id));
      closeDeleteModal();
    }
  };

  if (error) return <div className="text-red-500">Erro ao carregar colaboradores: {error}</div>;

  const normalizedSearch = searchQuery.toLowerCase();
  const numericSearch = searchQuery.replace(/\D/g, "");

  const filteredItems = items.filter(
    (colaborador) =>
      colaborador.nome.toLowerCase().includes(normalizedSearch) ||
      (numericSearch.length > 0 && colaborador.cpf.replace(/\D/g, "").includes(numericSearch)) ||
      (colaborador.email &&
        colaborador.email.toLowerCase().includes(normalizedSearch))
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="mx-auto max-w-2xl text-center mb-25">
        <h2 className="text-4xl font-semibold tracking-tight app-heading sm:text-5xl">
          Colaboradores
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Listagem de colaboradores registrados.
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Link to="/colaboradores/novo" className="pio-btn-primary">Novo colaborador</Link>
        <div className="w-1/3 ml-5">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome, CPF ou email..."
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>
      

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Nome
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                CPF
              </th>
              <th scope="col" className="px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((colaborador) => (
              <tr key={colaborador.id} className="bg-white border-b dark:bg-gray-800/50 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium dark:text-gray-900 whitespace-nowrap dark:text-white">
                  {colaborador.nome}
                </th>
                <td className="px-6 py-4">
                  {colaborador.email}
                </td>
                <td className="px-6 py-4">
                  {colaborador.cpf}
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <Link to={`/colaboradores/${colaborador.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</Link>
                  <button onClick={() => openDeleteModal(colaborador)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        title="Excluir Colaborador"
      >
        <p>Você tem certeza que deseja excluir o colaborador <strong>{colaboradorToDelete?.nome}</strong>?</p>
        <p className="mt-2">Essa ação não poderá ser desfeita.</p>
      </Modal>
    </>
  );
}
