// Camada de comunicação com a API PrintFlow (.NET)
//
// Centralizar as chamadas aqui evita repetição de URL e headers em cada tela.
// Para testar no celular físico (Expo Go), substitua localhost pelo IP da sua máquina.

const BASE_URL = "http://localhost:5182";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
  if (res.status === 204) return undefined as T; // No Content (DELETE)
  return res.json();
}

// ── Tipos ──────────────────────────────────────────────────────────────────

export interface Filamento {
  id: number;
  nome: string;
  tipo: string;
  peso: number;
  total: number;
  preco: number;
  cor: string;
  criadoEm: string;
}

export interface Projeto {
  id: number;
  nome: string;
  emoji: string;
  status: string;
  tempoHoras: number;
  custo: number;
  venda: number;
  filamentoId: number | null;
  filamento: Filamento | null;
  criadoEm: string;
}

export interface DashboardData {
  faturamento: number;
  lucro: number;
  pecas: number;
  horasTotais: number;
  topPecas: {
    id: number;
    nome: string;
    emoji: string;
    venda: number;
    custo: number;
    lucro: number;
    margem: number;
  }[];
  recentes: {
    id: number;
    nome: string;
    emoji: string;
    status: string;
    custo: number;
    venda: number;
    criadoEm: string;
  }[];
}

// ── Filamentos ─────────────────────────────────────────────────────────────

export const filamentosApi = {
  getAll: () =>
    request<Filamento[]>("/api/filamentos"),

  create: (data: Omit<Filamento, "id" | "criadoEm">) =>
    request<Filamento>("/api/filamentos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<Omit<Filamento, "id" | "criadoEm">>) =>
    request<Filamento>(`/api/filamentos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/api/filamentos/${id}`, { method: "DELETE" }),
};

// ── Projetos ───────────────────────────────────────────────────────────────

export const projetosApi = {
  getAll: (status?: string) =>
    request<Projeto[]>(`/api/projetos${status ? `?status=${encodeURIComponent(status)}` : ""}`),

  create: (data: {
    nome: string;
    emoji: string;
    status: string;
    tempoHoras: number;
    custo: number;
    venda: number;
    filamentoId?: number | null;
  }) =>
    request<Projeto>("/api/projetos", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (
    id: number,
    data: Partial<{
      nome: string;
      emoji: string;
      status: string;
      tempoHoras: number;
      custo: number;
      venda: number;
      filamentoId: number | null;
    }>
  ) =>
    request<Projeto>(`/api/projetos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<void>(`/api/projetos/${id}`, { method: "DELETE" }),
};

// ── Dashboard ──────────────────────────────────────────────────────────────

export const dashboardApi = {
  get: () => request<DashboardData>("/api/dashboard"),
};

// ── Utilitários de formatação ──────────────────────────────────────────────

export function formatMoeda(valor: number): string {
  return `R$${valor.toFixed(2).replace(".", ",")}`;
}

export function formatTempo(horas: number): string {
  const h = Math.floor(horas);
  const min = Math.round((horas - h) * 60);
  if (h === 0) return `${min}min`;
  if (min === 0) return `${h}h`;
  return `${h}h ${min}min`;
}
