import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { colaboradoresService } from "../../services/colaboradoresService";

type Colaborador = {
  id: string;
  nome: string;
  cpf: string;
  email?: string;
};

export const ColaboradoresList = () => {
  const [items, setItems] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await colaboradoresService.list();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div className="text-red-500">Erro ao carregar colaboradores: {error}</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Colaboradores</h1>
      <Link to="/colaboradores/new" className="btn">Novo colaborador</Link>
      <ul className="mt-4">
        {items.map((c) => (
          <li key={c.id} className="py-2">
            <Link to={`/colaboradores/${c.id}`}>
              {c.nome} - {c.cpf} - {c.email}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
