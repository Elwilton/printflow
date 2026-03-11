// TELA: Dashboard (Início)
//
// Conceitos importantes desta tela:
// - useEffect + useState: carrega os dados do dashboard da API ao montar.
// - DashboardData: tipo importado do services/api.ts.
// - Dados reais substituem os estáticos anteriores.

import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { dashboardApi, type DashboardData, formatMoeda, formatTempo } from "../../services/api";

// Cores para o top de peças (atribuídas por índice)
const TOP_CORES = ["#FF6B2B", "#3B82F6", "#A855F7", "#2ECC71", "#F1C40F"];

const statusColors: Record<string, { color: string; bg: string }> = {
  "Concluído": { color: "#2ECC71", bg: "rgba(46,204,113,0.15)" },
  "Imprimindo": { color: "#F1C40F", bg: "rgba(241,196,15,0.15)" },
  "Em Fila":   { color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  "Falhou":    { color: "#E74C3C", bg: "rgba(231,76,60,0.15)" },
};

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View className="rounded-full px-[10px] py-[3px]" style={{ backgroundColor: bg }}>
      <Text className="text-[11px] font-bold" style={{ color }}>{label}</Text>
    </View>
  );
}

export default function Dashboard() {
  const [dados, setDados] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const mesAtual = MESES[new Date().getMonth()];

  useEffect(() => {
    carregarDashboard();
  }, []);

  async function carregarDashboard() {
    try {
      setLoading(true);
      const resultado = await dashboardApi.get();
      setDados(resultado);
    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  const kpis = dados
    ? [
        { label: "Faturamento", value: formatMoeda(dados.faturamento), icon: "💰", color: "#2ECC71", delta: "este mês" },
        { label: "Lucro Líquido", value: formatMoeda(dados.lucro), icon: "📈", color: "#FF6B2B", delta: "este mês" },
        { label: "Peças Feitas", value: String(dados.pecas), icon: "🖨️", color: "#3B82F6", delta: "concluídas" },
        { label: "Horas Impressas", value: formatTempo(dados.horasTotais), icon: "⏱️", color: "#F1C40F", delta: "total" },
      ]
    : [];

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>

      {/* ── HEADER ── */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-3">
        <Text
          className="text-[22px] font-extrabold text-text-main"
          style={{ letterSpacing: -0.5 }}
        >
          Print<Text className="text-accent">Flow</Text>
        </Text>
        <View className="flex-row items-center gap-3">
          <Text className="text-xl" style={{ opacity: 0.5 }}>🔔</Text>
          <View className="w-9 h-9 rounded-full items-center justify-center bg-accent">
            <Text className="text-sm font-bold text-white">M</Text>
          </View>
        </View>
      </View>

      {/* ── CONTEÚDO ROLÁVEL ── */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Saudação */}
        <View className="mb-6">
          <Text className="text-[13px] text-text-muted mb-1">Olá, Maker 👋</Text>
          <Text
            className="text-[26px] font-extrabold text-text-main"
            style={{ letterSpacing: -0.5, lineHeight: 34 }}
          >
            Visão Geral{"\n"}
            <Text className="text-accent">de {mesAtual}</Text>
          </Text>
        </View>

        {/* ── LOADING ── */}
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator color="#FF6B2B" size="large" />
            <Text className="text-text-muted text-[13px] mt-3">Carregando dashboard...</Text>
          </View>
        ) : (
          <>
            {/* ── KPI CARDS (grid 2 colunas) ── */}
            {[kpis.slice(0, 2), kpis.slice(2, 4)].map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row gap-[10px] mb-[10px]">
                {row.map((k) => (
                  <View
                    key={k.label}
                    className="flex-1 bg-surface rounded-2xl p-[14px] border border-separator"
                  >
                    <View
                      className="w-[42px] h-[42px] rounded-xl items-center justify-center mb-[10px]"
                      style={{ backgroundColor: k.color + "22" }}
                    >
                      <Text className="text-xl">{k.icon}</Text>
                    </View>
                    <Text
                      className="text-[22px] font-extrabold"
                      style={{ color: k.color, letterSpacing: -0.5 }}
                    >
                      {k.value}
                    </Text>
                    <Text className="text-[11px] text-text-muted font-semibold mt-[2px]">
                      {k.label}
                    </Text>
                    <Text className="text-[10px] font-bold mt-1" style={{ color: k.color }}>
                      {k.delta}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

            {/* ── TOP PEÇAS ── */}
            {dados && dados.topPecas.length > 0 && (
              <View className="mt-3 mb-7">
                <Text
                  className="text-[11px] font-bold text-text-muted mb-3 uppercase"
                  style={{ letterSpacing: 1.5 }}
                >
                  🏆 Peças Mais Rentáveis
                </Text>
                {dados.topPecas.map((p, i) => (
                  <View key={p.id} className="bg-surface rounded-2xl p-4 border border-separator mb-[10px]">
                    <View className="flex-row items-center justify-between mb-[10px]">
                      <View className="flex-row items-center gap-3">
                        <Text className="text-[18px] font-extrabold text-text-muted">
                          #{i + 1}
                        </Text>
                        <View>
                          <Text className="font-bold text-[14px] text-text-main">{p.nome}</Text>
                          <Text className="text-[11px] text-text-muted mt-[2px]">
                            Margem: {p.margem.toFixed(0)}%
                          </Text>
                        </View>
                      </View>
                      <Text className="text-[16px] font-extrabold text-success">
                        {formatMoeda(p.lucro)}
                      </Text>
                    </View>
                    <View className="h-[6px] rounded-full bg-separator overflow-hidden">
                      <View
                        style={{
                          height: 6,
                          width: `${Math.min(p.margem, 100)}%`,
                          backgroundColor: TOP_CORES[i % TOP_CORES.length],
                          borderRadius: 3,
                        }}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* ── IMPRESSÕES RECENTES ── */}
            {dados && dados.recentes.length > 0 && (
              <View className="mb-4">
                <Text
                  className="text-[11px] font-bold text-text-muted mb-3 uppercase"
                  style={{ letterSpacing: 1.5 }}
                >
                  ⏱ Impressões Recentes
                </Text>
                {dados.recentes.map((p) => {
                  const sc = statusColors[p.status] ?? { color: "#6B6B80", bg: "rgba(107,107,128,0.15)" };
                  return (
                    <View key={p.id} className="bg-surface rounded-2xl p-4 border border-separator mb-[10px]">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3 flex-1 mr-3">
                          <Text className="text-[22px]">{p.emoji}</Text>
                          <View className="flex-1">
                            <Text className="font-bold text-[14px] text-text-main" numberOfLines={1}>
                              {p.nome}
                            </Text>
                            <Text className="text-[11px] text-text-muted mt-[2px]">
                              💰 {formatMoeda(p.custo)}
                            </Text>
                          </View>
                        </View>
                        <Badge label={p.status} color={sc.color} bg={sc.bg} />
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Estado vazio */}
            {dados && dados.recentes.length === 0 && (
              <View className="items-center py-12">
                <Text className="text-4xl mb-3">🖨️</Text>
                <Text className="text-text-muted text-[14px] font-semibold">
                  Nenhum projeto ainda
                </Text>
                <Text className="text-text-muted text-[12px] mt-1">
                  Crie seu primeiro projeto na aba Projetos
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
