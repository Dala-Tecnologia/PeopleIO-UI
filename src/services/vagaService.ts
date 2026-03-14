import { api } from "@/lib/api";

export type JobPost = {
  id: string;
  empresa: string;
  titulo: string;
  modelo: "Remoto" | "Hibrido" | "Presencial";
  local: string;
  nivel: "Junior" | "Pleno" | "Senior";
  descricao: string;
  salario: string;
  tempo: string;
  candidaturas: number;
};

export type CreateJobPayload = Omit<JobPost, "id" | "tempo" | "candidaturas">;
export type VagaSource = "api" | "local";

const STORAGE_KEY = "peopleio.feed.jobs";

const seedJobs: JobPost[] = [
  {
    id: "job-1",
    empresa: "Nexa Systems",
    titulo: "Pessoa Desenvolvedora Front-end React",
    modelo: "Hibrido",
    local: "Sao Paulo - SP",
    nivel: "Pleno",
    descricao: "Atuar no desenvolvimento de interfaces com React e TypeScript para produtos B2B.",
    salario: "R$ 7.000 - R$ 9.000",
    tempo: "Publicado hoje",
    candidaturas: 23,
  },
  {
    id: "job-2",
    empresa: "Orbit Data",
    titulo: "Analista de QA",
    modelo: "Remoto",
    local: "Brasil",
    nivel: "Junior",
    descricao: "Validar fluxos de produto, criar cenarios de teste e apoiar automacao inicial.",
    salario: "R$ 4.000 - R$ 5.500",
    tempo: "Ha 3 horas",
    candidaturas: 41,
  },
  {
    id: "job-3",
    empresa: "People Core",
    titulo: "Engenheiro(a) Back-end .NET",
    modelo: "Presencial",
    local: "Campinas - SP",
    nivel: "Senior",
    descricao: "Evoluir APIs de alta disponibilidade e integrar servicos com foco em performance.",
    salario: "R$ 12.000 - R$ 15.000",
    tempo: "Ontem",
    candidaturas: 17,
  },
];

const normalizeJobs = (data: unknown): JobPost[] => {
  const raw = (data as { value?: unknown[] })?.value ?? data;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) => item as Partial<JobPost>)
    .filter((item) => !!item.id && !!item.empresa && !!item.titulo)
    .map((item) => ({
      id: String(item.id),
      empresa: String(item.empresa),
      titulo: String(item.titulo),
      modelo: (item.modelo as JobPost["modelo"]) ?? "Remoto",
      local: String(item.local ?? "Brasil"),
      nivel: (item.nivel as JobPost["nivel"]) ?? "Junior",
      descricao: String(item.descricao ?? ""),
      salario: String(item.salario ?? "Faixa salarial a combinar"),
      tempo: String(item.tempo ?? "Publicado recentemente"),
      candidaturas: Number(item.candidaturas ?? 0),
    }));
};

const getLocalJobs = (): JobPost[] => {
  if (typeof window === "undefined") return seedJobs;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedJobs));
      return seedJobs;
    }

    const parsed = JSON.parse(raw) as JobPost[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedJobs));
      return seedJobs;
    }

    return parsed;
  } catch {
    return seedJobs;
  }
};

const saveLocalJobs = (jobs: JobPost[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
};

const createLocalJob = (payload: CreateJobPayload): JobPost => ({
  id: crypto.randomUUID(),
  empresa: payload.empresa,
  titulo: payload.titulo,
  modelo: payload.modelo,
  local: payload.local,
  nivel: payload.nivel,
  descricao: payload.descricao,
  salario: payload.salario || "Faixa salarial a combinar",
  tempo: "Publicado agora",
  candidaturas: 0,
});

export const vagaService = {
  list: async (): Promise<{ jobs: JobPost[]; source: VagaSource }> => {
    try {
      const { data } = await api.get("/vaga");
      const jobs = normalizeJobs(data);
      if (jobs.length > 0) {
        saveLocalJobs(jobs);
        return { jobs, source: "api" };
      }

      return { jobs: getLocalJobs(), source: "local" };
    } catch {
      return { jobs: getLocalJobs(), source: "local" };
    }
  },

  create: async (
    payload: CreateJobPayload
  ): Promise<{ job: JobPost; source: VagaSource }> => {
    const localJob = createLocalJob(payload);

    try {
      const { data } = await api.post("/vaga", payload);
      const created = normalizeJobs([data])[0];

      if (created) {
        const current = getLocalJobs();
        saveLocalJobs([created, ...current]);
        return { job: created, source: "api" };
      }
    } catch {
      // Fallback para persistencia local quando endpoint de vagas nao estiver disponivel.
    }

    const current = getLocalJobs();
    saveLocalJobs([localJob, ...current]);
    return { job: localJob, source: "local" };
  },
};
