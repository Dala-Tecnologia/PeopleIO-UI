import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { candidatoService } from "@/services/candidatoService";
import type { FormData } from "@/types/FormData";
import { Loader } from "@/components/ui/loader";

import { CandidatoData } from "./CandidatoEdit";

export const CandidatoProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [candidato, setCandidato] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      candidatoService.getById(id)
        .then(data => {
          setCandidato(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error("Erro ao buscar dados do candidato:", error);
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <Loader />;
  }

  if (!candidato) {
    return <div className="text-center text-white">Candidato não encontrado.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna da Esquerda: Foto e Nome */}
        <div className="md:col-span-1">
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-xl text-center">
            <img
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              src={candidato.fotoUrl?.url || 'https://via.placeholder.com/150'}
              alt="Foto do Candidato"
            />
            <h2 className="text-2xl font-semibold text-white">{candidato.nome}</h2>
          </div>
        </div>

        {/* Coluna da Direita: Formulário */}
        <div className="md:col-span-2">
          <div className="bg-gray-800/50 p-6 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Dados do Candidato
            </h3>
            <CandidatoData candidato={candidato} />
          </div>
        </div>
      </div>
    </div>
  );
};