// TELA: Dashboard (Início)
//
// Conceitos importantes desta tela:
// - SafeAreaView: garante que o conteúdo nao fica atrás do notch/câmera do celular
// - ScrollView: permite rolar o conteúdo, como overflow-y: auto no web
// - View: equivalente à <div> no web
// - Text: equivalente ao <p>, <span>, <h1> etc. no web. TODO texto precisa estar dentro de <Text>
// - className: usamos classes Tailwind graças ao NativeWind
// - style={{}}: para estilos dinâmicos (cores que mudam por item, por ex.)

import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dados estáticos das seções (mais tarde virão do Supabase)
const kpis = [
  { label: "Faturamento", value: "R$1.240", icon: "💰", color: "#2ECC71", delta: "+18%" },
  { label: "Lucro Líquido", value: "R$680", icon: "📈", color: "#FF6B2B", delta: "+12%" },
  { label: "Peças Feitas", value: "34", icon: "🖨️", color: "#3B82F6", delta: "este mês" },
  { label: "Filamento", value: "1.2kg", icon: "🧵", color: "#F1C40F", delta: "consumido" },
];

const topPecas = [
  { name: "Suporte Parede", lucro: "R$18,50", margem: 72, cor: "#FF6B2B" },
  { name: "Case iPhone 15", lucro: "R$14,00", margem: 58, cor: "#3B82F6" },
  { name: "Miniatura Dragon", lucro: "R$22,00", margem: 66, cor: "#A855F7" },
];

const impressoesRecentes = [
  { name: "Engrenagem v3", status: "Concluído", time: "3h 40min", statusColor: "#2ECC71", statusBg: "rgba(46,204,113,0.15)" },
  { name: "Base Robô", status: "Imprimindo", time: "2h restantes", statusColor: "#F1C40F", statusBg: "rgba(241,196,15,0.15)" },
  { name: "Tampa Eletrônica", status: "Falhou", time: "1h 10min", statusColor: "#E74C3C", statusBg: "rgba(231,76,60,0.15)" },
];

// Componente reutilizável para os badges coloridos de status.
// Separar em componente próprio evita repetição de código.
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View
      className="rounded-full px-[10px] py-[3px]"
      style={{ backgroundColor: bg }}
    >
      <Text className="text-[11px] font-bold" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

export default function Dashboard() {
  return (
    // edges={["top"]} aplica safe area só no topo.
    // A aba inferior já cuida do espaço do tab bar.
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
      {/* contentContainerStyle adiciona padding no final para o conteúdo nao sumir atrás do tab bar */}
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
            {/* {"\n"} é a forma de quebrar linha dentro de um <Text> no React Native */}
            <Text className="text-accent">de Março</Text>
          </Text>
        </View>

        {/* ── KPI CARDS (grid 2 colunas) ── */}
        {/* React Native nao tem CSS Grid. Simulamos com flex-row e agrupando em pares */}
        {[kpis.slice(0, 2), kpis.slice(2, 4)].map((row, rowIdx) => (
          <View key={rowIdx} className="flex-row gap-[10px] mb-[10px]">
            {row.map((k) => (
              <View
                key={k.label}
                className="flex-1 bg-surface rounded-2xl p-[14px] border border-separator"
              >
                {/* Ícone com fundo colorido translúcido */}
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
        <View className="mt-3 mb-7">
          <Text
            className="text-[11px] font-bold text-text-muted mb-3 uppercase"
            style={{ letterSpacing: 1.5 }}
          >
            🏆 Peças Mais Rentáveis
          </Text>
          {topPecas.map((p, i) => (
            <View key={p.name} className="bg-surface rounded-2xl p-4 border border-separator mb-[10px]">
              <View className="flex-row items-center justify-between mb-[10px]">
                <View className="flex-row items-center gap-3">
                  <Text className="text-[18px] font-extrabold text-text-muted">
                    #{i + 1}
                  </Text>
                  <View>
                    <Text className="font-bold text-[14px] text-text-main">{p.name}</Text>
                    <Text className="text-[11px] text-text-muted mt-[2px]">
                      Margem: {p.margem}%
                    </Text>
                  </View>
                </View>
                <Text className="text-[16px] font-extrabold text-success">{p.lucro}</Text>
              </View>

              {/* Barra de progresso: View externa define o trilho, View interna o preenchimento */}
              <View className="h-[6px] rounded-full bg-separator overflow-hidden">
                <View
                  style={{
                    height: 6,
                    width: `${p.margem}%`,
                    backgroundColor: p.cor,
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
          ))}
        </View>

        {/* ── IMPRESSÕES RECENTES ── */}
        <View className="mb-4">
          <Text
            className="text-[11px] font-bold text-text-muted mb-3 uppercase"
            style={{ letterSpacing: 1.5 }}
          >
            ⏱ Impressões Recentes
          </Text>
          {impressoesRecentes.map((p) => (
            <View key={p.name} className="bg-surface rounded-2xl p-4 border border-separator mb-[10px]">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="font-bold text-[14px] text-text-main">{p.name}</Text>
                  <Text className="text-[11px] text-text-muted mt-[2px]">⏱ {p.time}</Text>
                </View>
                <Badge label={p.status} color={p.statusColor} bg={p.statusBg} />
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
