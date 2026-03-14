import { useEffect, useMemo, useState } from "react";
import { vagaService, type CreateJobPayload, type JobPost } from "@/services/vagaService";
import { useMsal } from "@azure/msal-react";

type FeedPost = {
  id: string;
  autor: string;
  cargo: string;
  tempo: string;
  texto: string;
  tags: string[];
  curtidas: number;
  comentarios: number;
  curtido: boolean;
};

type SuggestedPerson = {
  id: string;
  nome: string;
  cargo: string;
  conexoes: number;
};

type SuggestedCompany = {
  id: string;
  nome: string;
  segmento: string;
  vagasAbertas: number;
};

const suggestedPeopleMock: SuggestedPerson[] = [
  { id: "p1", nome: "Marina Rios", cargo: "Tech Recruiter", conexoes: 41 },
  { id: "p2", nome: "Joao Vilela", cargo: "People Partner", conexoes: 28 },
  { id: "p3", nome: "Camila Freitas", cargo: "Talent Acquisition", conexoes: 34 },
];

const suggestedCompaniesMock: SuggestedCompany[] = [
  { id: "c1", nome: "Orbit Data", segmento: "Dados e Analytics", vagasAbertas: 4 },
  { id: "c2", nome: "Nexa Systems", segmento: "Software B2B", vagasAbertas: 6 },
  { id: "c3", nome: "People Core", segmento: "RH Tech", vagasAbertas: 2 },
];

const initialPosts: FeedPost[] = [
  {
    id: "1",
    autor: "Ana Lima",
    cargo: "Recrutadora Tech",
    tempo: "Agora",
    texto: "Abrimos novas vagas para front-end e QA. Quem tiver interesse, comenta com stack e disponibilidade.",
    tags: ["vagas", "frontend", "qa"],
    curtidas: 32,
    comentarios: 11,
    curtido: false,
  },
  {
    id: "2",
    autor: "Bruno Souza",
    cargo: "Candidato - Full Stack",
    tempo: "2 h",
    texto: "Finalizei desafio em React + .NET e subi o projeto no GitHub. Agradeco feedback do time sobre pontos de melhoria.",
    tags: ["portfolio", "react", "dotnet"],
    curtidas: 18,
    comentarios: 6,
    curtido: false,
  },
  {
    id: "3",
    autor: "Carla Nunes",
    cargo: "Talent Partner",
    tempo: "5 h",
    texto: "Dica rapida para entrevistas tecnicas: explique decisoes de arquitetura, nao apenas o codigo final.",
    tags: ["dica", "entrevista", "carreira"],
    curtidas: 47,
    comentarios: 14,
    curtido: true,
  },
];

export const CandidatoFeed = () => {
  const { accounts } = useMsal();
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [newPost, setNewPost] = useState("");
  const [newTag, setNewTag] = useState("carreira");

  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobPersistMode, setJobPersistMode] = useState<"api" | "local">("local");

  const [isCompanyPanelOpen, setIsCompanyPanelOpen] = useState(false);
  const [empresaNome, setEmpresaNome] = useState("");
  const [vagaTitulo, setVagaTitulo] = useState("");
  const [vagaDescricao, setVagaDescricao] = useState("");
  const [vagaModelo, setVagaModelo] = useState<JobPost["modelo"]>("Remoto");
  const [vagaNivel, setVagaNivel] = useState<JobPost["nivel"]>("Junior");
  const [vagaLocal, setVagaLocal] = useState("");
  const [vagaSalario, setVagaSalario] = useState("");
  const [suggestedPeople] = useState<SuggestedPerson[]>(suggestedPeopleMock);
  const [suggestedCompanies] = useState<SuggestedCompany[]>(suggestedCompaniesMock);

  const activeAccount = accounts[0];
  const claimMap = (activeAccount?.idTokenClaims ?? {}) as Record<string, unknown>;
  const userName = activeAccount?.name || "Usuario";
  const userEmail = activeAccount?.username || "usuario@peopleio.com";
  const userPhoto = typeof claimMap.picture === "string" ? claimMap.picture : null;
  const userRole = typeof claimMap.jobTitle === "string" ? claimMap.jobTitle : "Candidato(a)";
  const userHandle = `@${userEmail.split("@")[0] || "usuario"}`;
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("") || "U";

  useEffect(() => {
    const loadJobs = async () => {
      setIsLoadingJobs(true);
      setJobError(null);

      try {
        const result = await vagaService.list();
        setJobs(result.jobs);
        setJobPersistMode(result.source);
      } catch (error) {
        setJobError("Nao foi possivel carregar vagas no momento.");
        console.error("Erro ao carregar vagas:", error);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    void loadJobs();
  }, []);

  const metrics = useMemo(() => {
    const totalCurtidas = posts.reduce((acc, post) => acc + post.curtidas, 0);
    const totalComentarios = posts.reduce((acc, post) => acc + post.comentarios, 0);
    const totalCandidaturas = jobs.reduce((acc, job) => acc + job.candidaturas, 0);

    return {
      publicacoes: posts.length,
      vagas: jobs.length,
      curtidas: totalCurtidas,
      interacoes: totalComentarios + totalCandidaturas,
    };
  }, [jobs, posts]);

  const profileStats = useMemo(() => {
    return {
      conexoes: 120 + posts.length * 3,
      alcance: metrics.interacoes + 42,
      vagasSalvas: Math.max(3, Math.floor(metrics.vagas / 2)),
    };
  }, [metrics.interacoes, metrics.vagas, posts.length]);

  const handlePublish = () => {
    const texto = newPost.trim();
    if (!texto) return;

    const publishedPost: FeedPost = {
      id: crypto.randomUUID(),
      autor: "Voce",
      cargo: "Candidato",
      tempo: "Agora",
      texto,
      tags: [newTag],
      curtidas: 0,
      comentarios: 0,
      curtido: false,
    };

    setPosts((current) => [publishedPost, ...current]);
    setNewPost("");
  };

  const handleToggleLike = (postId: string) => {
    setPosts((current) =>
      current.map((post) => {
        if (post.id !== postId) return post;

        return {
          ...post,
          curtido: !post.curtido,
          curtidas: post.curtido ? post.curtidas - 1 : post.curtidas + 1,
        };
      })
    );
  };

  const handlePublishJob = async () => {
    if (!empresaNome.trim() || !vagaTitulo.trim() || !vagaDescricao.trim() || !vagaLocal.trim()) {
      return;
    }

    const payload: CreateJobPayload = {
      empresa: empresaNome.trim(),
      titulo: vagaTitulo.trim(),
      modelo: vagaModelo,
      local: vagaLocal.trim(),
      nivel: vagaNivel,
      descricao: vagaDescricao.trim(),
      salario: vagaSalario.trim() || "Faixa salarial a combinar",
    };

    try {
      const result = await vagaService.create(payload);
      setJobs((current) => [result.job, ...current]);
      setJobPersistMode(result.source);

      setEmpresaNome("");
      setVagaTitulo("");
      setVagaDescricao("");
      setVagaLocal("");
      setVagaSalario("");
      setVagaModelo("Remoto");
      setVagaNivel("Junior");
      setIsCompanyPanelOpen(false);
    } catch (error) {
      setJobError("Nao foi possivel publicar a vaga agora.");
      console.error("Erro ao publicar vaga:", error);
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6">
      <header className="rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">Comunidade People IO</p>
            <h1 className="mt-2 text-3xl font-semibold text-blue-950 dark:text-white">Feed de Candidatos</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Compartilhe experiencias, novidades de vagas e interaja com outros candidatos.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center text-sm sm:grid-cols-4">
            <div className="rounded-xl bg-cyan-50 px-4 py-3 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-100"><p className="text-xl font-bold">{metrics.publicacoes}</p><p>Posts</p></div>
            <div className="rounded-xl bg-emerald-50 px-4 py-3 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-100"><p className="text-xl font-bold">{metrics.vagas}</p><p>Vagas</p></div>
            <div className="rounded-xl bg-amber-50 px-4 py-3 text-amber-900 dark:bg-amber-950/60 dark:text-amber-100"><p className="text-xl font-bold">{metrics.curtidas}</p><p>Curtidas</p></div>
            <div className="rounded-xl bg-indigo-50 px-4 py-3 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-100"><p className="text-xl font-bold">{metrics.interacoes}</p><p>Interacoes</p></div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-500 dark:text-gray-300">Espaco de vagas com anuncio exclusivo para empresas</p>
          <button
            type="button"
            onClick={() => setIsCompanyPanelOpen((current) => !current)}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500"
          >
            {isCompanyPanelOpen ? "Fechar anuncio" : "Anunciar nova vaga"}
          </button>
        </div>
      </header>

      {isCompanyPanelOpen && (
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-emerald-800 dark:text-emerald-100">Formulario de anuncio de vaga</h2>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-100">Somente empresas</span>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2">
            <input value={empresaNome} onChange={(event) => setEmpresaNome(event.target.value)} placeholder="Nome da empresa" className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-gray-900 dark:text-white" />
            <input value={vagaTitulo} onChange={(event) => setVagaTitulo(event.target.value)} placeholder="Titulo da vaga" className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-gray-900 dark:text-white" />

            <select value={vagaModelo} onChange={(event) => setVagaModelo(event.target.value as JobPost["modelo"])} className="rounded-lg border border-emerald-300 bg-white px-2 py-2 text-sm text-gray-900 dark:border-emerald-800 dark:bg-gray-900 dark:text-white">
              <option value="Remoto">Remoto</option>
              <option value="Hibrido">Hibrido</option>
              <option value="Presencial">Presencial</option>
            </select>

            <select value={vagaNivel} onChange={(event) => setVagaNivel(event.target.value as JobPost["nivel"])} className="rounded-lg border border-emerald-300 bg-white px-2 py-2 text-sm text-gray-900 dark:border-emerald-800 dark:bg-gray-900 dark:text-white">
              <option value="Junior">Junior</option>
              <option value="Pleno">Pleno</option>
              <option value="Senior">Senior</option>
              <option value="Estágio">Estágio</option>
              <option value="JA">Jovem Aprendiz</option>
            </select>

            <input value={vagaLocal} onChange={(event) => setVagaLocal(event.target.value)} placeholder="Local da vaga" className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-gray-900 dark:text-white" />
            <input value={vagaSalario} onChange={(event) => setVagaSalario(event.target.value)} placeholder="Faixa salarial (opcional)" className="w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-gray-900 dark:text-white" />
          </div>

          <textarea value={vagaDescricao} onChange={(event) => setVagaDescricao(event.target.value)} placeholder="Descreva os requisitos e responsabilidades" className="mt-2 min-h-24 w-full rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-emerald-500 dark:border-emerald-800 dark:bg-gray-900 dark:text-white" />

          <div className="mt-3 flex justify-end">
            <button type="button" onClick={handlePublishJob} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500" disabled={isLoadingJobs}>
              Publicar vaga no feed
            </button>
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="h-20 bg-gradient-to-r from-blue-900 via-cyan-700 to-emerald-600" />

            <div className="px-5 pb-5">
              <div className="-mt-9 inline-flex rounded-full bg-white p-1 shadow-md dark:bg-gray-900">
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={`Foto de ${userName}`}
                    className="h-16 w-16 rounded-full border border-gray-200 object-cover dark:border-gray-600"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-sm font-bold text-white">
                    {userInitials}
                  </div>
                )}
              </div>

              <div className="mt-3">
                <h2 className="text-base font-semibold text-blue-950 dark:text-white">{userName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">{userHandle}</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-300">{userRole}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-gray-50 px-2 py-2 dark:bg-gray-800/80">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">{profileStats.conexoes}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-300">Conexoes</p>
                </div>
                <div className="rounded-lg bg-gray-50 px-2 py-2 dark:bg-gray-800/80">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">{profileStats.alcance}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-300">Alcance</p>
                </div>
                <div className="rounded-lg bg-gray-50 px-2 py-2 dark:bg-gray-800/80">
                  <p className="text-sm font-bold text-blue-900 dark:text-blue-100">{profileStats.vagasSalvas}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-300">Salvas</p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-3 dark:border-gray-700">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">Acesso rapido</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-200">
                  <li className="rounded-md bg-gray-50 px-2 py-1.5 dark:bg-gray-800/80">Meu perfil</li>
                  <li className="rounded-md bg-gray-50 px-2 py-1.5 dark:bg-gray-800/80">Minhas candidaturas</li>
                  <li className="rounded-md bg-gray-50 px-2 py-1.5 dark:bg-gray-800/80">Posts curtidos</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">Social score</p>
            <p className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">{Math.min(100, 60 + posts.length * 2)}%</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Seu perfil esta em destaque para recrutadores da semana.</p>
          </div>
        </aside>

        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-950 dark:text-white">Vagas no feed</h2>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-200">Empresas anunciando</span>
            </div>

            {isLoadingJobs && <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">Carregando vagas...</p>}
            {jobError && <p className="mt-4 text-sm font-medium text-red-600 dark:text-red-300">{jobError}</p>}

            <div className="mt-2">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">Persistencia: {jobPersistMode === "api" ? "API" : "Local"}</span>
            </div>

            <div className="mt-4 space-y-3">
              {!isLoadingJobs && jobs.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-300">Nenhuma vaga publicada ainda. Use o botao "Anunciar nova vaga" para criar a primeira.</p>}

              {jobs.map((job) => (
                <article key={job.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-emerald-400 dark:border-gray-700 dark:bg-gray-800/70">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-300">{job.empresa}</p>
                      <h3 className="text-base font-semibold text-blue-950 dark:text-white">{job.titulo}</h3>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-300">{job.tempo}</span>
                  </div>

                  <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">{job.descricao}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 font-medium text-blue-700 dark:bg-blue-950/70 dark:text-blue-100">{job.modelo}</span>
                    <span className="rounded-full bg-indigo-100 px-2.5 py-1 font-medium text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-100">{job.nivel}</span>
                    <span className="rounded-full bg-gray-200 px-2.5 py-1 font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-100">{job.local}</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-100">{job.salario}</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3 text-sm dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-300">{job.candidaturas} candidaturas</p>
                    <button type="button" className="rounded-lg bg-emerald-600 px-3 py-1.5 font-semibold text-white transition hover:bg-emerald-500">Candidatar-se</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <h2 className="text-lg font-semibold text-blue-950 dark:text-white">Criar publicacao</h2>
            <textarea value={newPost} onChange={(event) => setNewPost(event.target.value)} placeholder="Compartilhe uma conquista, vaga ou dica para a comunidade..." className="mt-4 min-h-28 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                Tema:
                <select value={newTag} onChange={(event) => setNewTag(event.target.value)} className="rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-white">
                  <option value="carreira">Carreira</option>
                  <option value="vagas">Vagas</option>
                  <option value="portfolio">Portfolio</option>
                  <option value="entrevista">Entrevista</option>
                </select>
              </label>

              <button type="button" onClick={handlePublish} className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={!newPost.trim()}>
                Publicar
              </button>
            </div>
          </article>

          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900/70">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-blue-950 dark:text-white">{post.autor}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-300">{post.cargo}</p>
                </div>
                <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{post.tempo}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{post.texto}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={`${post.id}-${tag}`} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950/60 dark:text-blue-100">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                <button type="button" onClick={() => handleToggleLike(post.id)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${post.curtido ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"}`}>
                  {post.curtido ? "Curtido" : "Curtir"} ({post.curtidas})
                </button>

                <button type="button" className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200">
                  Comentar ({post.comentarios})
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">Sugerir pessoas</h2>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-300">Mock</span>
            </div>

            <div className="mt-3 space-y-3">
              {suggestedPeople.map((person) => {
                const initials = person.nome
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((chunk) => chunk[0]?.toUpperCase() ?? "")
                  .join("");

                return (
                  <div key={person.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-xs font-bold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-blue-950 dark:text-white">{person.nome}</p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-300">{person.cargo}</p>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{person.conexoes} conexoes em comum</p>
                      </div>
                    </div>

                    <button type="button" className="mt-2 w-full rounded-md border border-blue-800 px-2 py-1.5 text-xs font-semibold text-blue-900 transition hover:bg-blue-50 dark:border-blue-300 dark:text-blue-200 dark:hover:bg-blue-950/40">
                      Conectar
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">Em breve: dados reais via API de sugestoes.</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">Sugerir empresas</h2>
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-300">Mock</span>
            </div>

            <div className="mt-3 space-y-3">
              {suggestedCompanies.map((company) => {
                const initials = company.nome
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((chunk) => chunk[0]?.toUpperCase() ?? "")
                  .join("");

                return (
                  <div key={company.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/70">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                        {initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-blue-950 dark:text-white">{company.nome}</p>
                        <p className="truncate text-xs text-gray-500 dark:text-gray-300">{company.segmento}</p>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{company.vagasAbertas} vagas em aberto</p>
                      </div>
                    </div>

                    <button type="button" className="mt-2 w-full rounded-md border border-emerald-700 px-2 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-300 dark:text-emerald-200 dark:hover:bg-emerald-950/40">
                      Seguir empresa
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400">Em breve: empresas cadastradas retornadas pelo backend.</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">Tendencias</h2>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
              <li>#vagas-remotas</li>
              <li>#frontend-react</li>
              <li>#entrevista-tecnica</li>
              <li>#english-for-work</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900/70">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-300">Networking rapido</h2>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-200">Comente em 2 posts por dia para aumentar sua visibilidade no funil de recrutamento.</p>
            <button type="button" className="mt-4 w-full rounded-lg border border-blue-800 px-3 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-50 dark:border-blue-300 dark:text-blue-200 dark:hover:bg-blue-950/40">
              Ver candidatos em alta
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
};
