import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { candidatoesService } from "../../services/candidatoesService";
import { Modal } from "@/components/ui/modal";
import { Loader } from "../ui/loader";
import { insertMaskInCPF } from "@/functions/cpf";

type Candidato = {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
};

export const CandidatoesList = () => {
  const [items, setItems] = useState<Candidato[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidatoToDelete, setCandidatoToDelete] = useState<Candidato | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await candidatoesService.list();
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

  const openDeleteModal = (candidato: Candidato) => {
    setCandidatoToDelete(candidato);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCandidatoToDelete(null);
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (candidatoToDelete) {
      await candidatoesService.delete(candidatoToDelete.id);
      setItems(items.filter((c) => c.id !== candidatoToDelete.id));
      closeDeleteModal();
    }
  };

  if (error) return <div className="text-red-500">Erro ao carregar candidatoes: {error}</div>;

  const normalizedSearch = searchQuery.toLowerCase();
  const numericSearch = searchQuery.replace(/\D/g, "");

  const filteredItems = items.filter(
    (candidato) =>
      candidato.nome.toLowerCase().includes(normalizedSearch) ||
      (numericSearch.length > 0 && candidato.cpf.replace(/\D/g, "").includes(numericSearch)) ||
      (candidato.email &&
        candidato.email.toLowerCase().includes(normalizedSearch))
  );

  return (
    <>
      {isLoading && <Loader />}
      <div className="mx-auto max-w-2xl text-center mb-25">
        <h2 className="text-4xl font-semibold tracking-tight app-heading sm:text-5xl">
          Candidatoes
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Listagem de candidatoes registrados.
        </p>
      </div>
      <div className="flex justify-between items-center mb-4">
        <Link to="/candidatoes/novo" className="pio-btn-primary">Novo candidato</Link>
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
            {filteredItems.map((candidato) => (
              <tr key={candidato.id} className="bg-white border-b dark:bg-gray-800/50 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium dark:text-gray-900 whitespace-nowrap dark:text-white">
                  {candidato.nome}
                </th>
                <td className="px-6 py-4">
                  {candidato.email}
                </td>
                <td className="px-6 py-4">
                  {insertMaskInCPF(candidato.cpf)} 
                </td>
                <td className="px-6 py-4 flex gap-4">
                  <Link to={`/candidatoes/${candidato.id}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Editar</Link>
                  <button onClick={() => openDeleteModal(candidato)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Excluir</button>
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
        title="Excluir Candidato"
      >
        <p>Você tem certeza que deseja excluir o candidato <strong>{candidatoToDelete?.nome}</strong>?</p>
        <p className="mt-2">Essa ação não poderá ser desfeita.</p>
      </Modal>
    </>
  );
}
