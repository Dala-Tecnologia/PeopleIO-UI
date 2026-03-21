export type SelectOption = { value: string; label: string };

export const sexoOptions: SelectOption[] = [
  { value: "Masculino",         label: "Masculino" },
  { value: "Feminino",          label: "Feminino" },
  { value: "Outro",             label: "Outro" },
  { value: "PrefiroNaoInformar", label: "Prefiro não informar" },
];

export const corRacaOptions: SelectOption[] = [
  { value: "Branca",       label: "Branca" },
  { value: "Preta",        label: "Preta" },
  { value: "Parda",        label: "Parda" },
  { value: "Amarela",      label: "Amarela" },
  { value: "Indigena",     label: "Indigena" },
  { value: "Outro",        label: "Outro" },
  { value: "NãoInformado", label: "Não Informado" },
];

export const escolaridadeOptions: SelectOption[] = [
  { value: "Fundamental incompleto", label: "Fundamental incompleto" },
  { value: "Fundamental completo",   label: "Fundamental completo" },
  { value: "Médio incompleto",       label: "Médio incompleto" },
  { value: "Médio completo",         label: "Médio completo" },
  { value: "Superior incompleto",    label: "Superior incompleto" },
  { value: "Superior completo",      label: "Superior completo" },
  { value: "Pós-graduação",          label: "Pós-graduação" },
  { value: "Mestrado",               label: "Mestrado" },
  { value: "Doutorado",              label: "Doutorado" },
];

export const estadoCivilOptions: SelectOption[] = [
  { value: "Solteiro(a)",    label: "Solteiro(a)" },
  { value: "Casado(a)",      label: "Casado(a)" },
  { value: "Divorciado(a)",  label: "Divorciado(a)" },
  { value: "Separado(a)",    label: "Separado(a)" },
  { value: "Viúvo(a)",       label: "Viúvo(a)" },
  { value: "União estável",  label: "União estável" },
];

export const estadosOptions: SelectOption[] = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA",
  "MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN",
  "RS","RO","RR","SC","SP","SE","TO",
].map(uf => ({ value: uf, label: uf }));

export const cnhTipo: SelectOption[] = [
  "A","B","C","D","E","A/B","ACC",
].map(t => ({ value: t, label: t }));

export const profissoesOptions: SelectOption[] = [
  "Desenvolvedor de Software","Analista de Dados","Gerente de Projetos",
  "Designer Gráfico","Engenheiro de Software","Especialista em Marketing Digital",
  "Analista Financeiro","Consultor de Recursos Humanos","Médico","Advogado",
  "Professor","Psicólogo","Arquiteto","Engenheiro Civil","Enfermeiro",
  "Farmacêutico","Jornalista","Publicitário","Cientista de Dados",
  "Analista de Suporte Técnico","Assistente Administrativo","Vendedor",
  "Atendente de Loja","Motorista","Cozinheiro","Garçom","Recepcionista",
  "Segurança","Limpeza","Outro",
].map(p => ({ value: p, label: p }));
