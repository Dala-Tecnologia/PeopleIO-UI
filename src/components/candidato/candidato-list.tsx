import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { candidatoService } from "../../services/candidatoService";
import { Modal } from "@/components/ui/modal";
import { Loader } from "../ui/loader";
import { insertMaskInCPF } from "@/functions/cpf";
import { useMsal } from "@azure/msal-react";

type Candidato = {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
};

export const CandidatoList = () => {
  const { accounts } = useMsal();
  const [items, setItems] = useState<Candidato[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidatoToDelete, setCandidatoToDelete] = useState<Candidato | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const activeAccount = accounts[0];
  const claimMap = (activeAccount?.idTokenClaims ?? {}) as Record<string, unknown>;
  const userName = activeAccount?.name || "Usuario";
  const userEmail = activeAccount?.username || "Email nao informado";
  const userPhoto = typeof claimMap.picture === "string" ? claimMap.picture : null;
  const userRole = typeof claimMap.jobTitle === "string" ? claimMap.jobTitle : "Sessao autenticada";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("") || "U";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await candidatoService.list();
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
      await candidatoService.delete(candidatoToDelete.id);
      setItems(items.filter((c) => c.id !== candidatoToDelete.id));
      closeDeleteModal();
    }
  };

  if (error) return <div className="text-red-500">Erro ao carregar candidatos: {error}</div>;

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
      <div className="mx-auto mb-25 max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight app-heading sm:text-5xl">
          Candidatos
        </h2>
        <p className="mt-2 text-lg text-gray-400">
          Listagem de Candidatos registrados.
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Perfil da sessao</p>
          <div className="mt-4 flex items-center gap-3">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={`Foto de ${userName}`}
                className="h-14 w-14 rounded-full border border-slate-200 object-cover dark:border-slate-600"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-950 text-base font-bold text-white">
                {userInitials}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-base font-semibold text-slate-900 dark:text-white">{userName}</p>
              <p className="truncate text-sm text-slate-500 dark:text-slate-300">{userRole}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 border-t border-slate-200 pt-4 text-sm dark:border-slate-700">
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="truncate font-medium text-slate-800 dark:text-slate-100">{userEmail}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</dt>
              <dd className="font-medium text-emerald-700 dark:text-emerald-300">Online</dd>
            </div>
          </dl>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <Link
                to="/candidato/novo"
                className="rounded-md bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800"
              >
                Novo candidato
              </Link>
            </div>
            <div className="w-full lg:ml-5 lg:w-1/2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por nome, CPF ou email..."
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="relative mt-4 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-600 rtl:text-right dark:text-gray-400">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
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
                    Acoes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((candidato) => (
                  <tr key={candidato.id} className="border-b bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800/50 dark:hover:bg-gray-600">
                    <th scope="row" className="whitespace-nowrap px-6 py-4 font-medium dark:text-white">
                      {candidato.nome}
                    </th>
                    <td className="px-6 py-4">
                      {candidato.email}
                    </td>
                    <td className="px-6 py-4">
                      {insertMaskInCPF(candidato.cpf)}
                    </td>
                    <td className="flex gap-4 px-6 py-4">
                      <Link to={`/candidato/${candidato.id}`} className="font-medium text-blue-600 hover:underline dark:text-blue-500">Editar</Link>
                      <button onClick={() => openDeleteModal(candidato)} className="font-medium text-red-600 hover:underline dark:text-red-500">Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
