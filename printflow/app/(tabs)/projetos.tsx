// TELA: Projetos & Impressões
//
// Conceitos novos nesta tela:
// - Modal com formulário: mesmo padrão do Filamentos, mas com campos diferentes.
// - useState editável: agora usamos setProjetos para adicionar à lista.
// - Seletor de status: pills interativos para escolher o status do projeto.
// - Seletor de emoji: grid de emojis para identificar visualmente o projeto.

import { useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Projeto {
  id: number;
  nome: string;
  status: "Concluído" | "Imprimindo" | "Em Fila" | "Falhou";
  filamento: string;
  tempo: string;
  custo: string;
  venda: string;
  data: string;
  emoji: string;
}

const projetosIniciais: Projeto[] = [
  { id: 1, nome: "Case iPhone 15 Pro", status: "Concluído", filamento: "PLA+ Preto", tempo: "2h 15min", custo: "R$8,40", venda: "R$25,00", data: "Hoje", emoji: "📱" },
  { id: 2, nome: "Suporte Monitor", status: "Imprimindo", filamento: "PETG Azul", tempo: "6h 30min", custo: "R$22,00", venda: "R$55,00", data: "Hoje", emoji: "🖥️" },
  { id: 3, nome: "Miniatura Dragão", status: "Em Fila", filamento: "PLA Branco", tempo: "8h 00min", custo: "R$18,00", venda: "R$60,00", data: "Amanhã", emoji: "🐉" },
  { id: 4, nome: "Tampa Caixa", status: "Falhou", filamento: "TPU Roxo", tempo: "1h 20min", custo: "R$5,50", venda: "-", data: "Ontem", emoji: "📦" },
];

const statusStyles: Record<Projeto["status"], { color: string; bg: string }> = {
  "Concluído": { color: "#2ECC71", bg: "rgba(46,204,113,0.15)" },
  "Imprimindo": { color: "#F1C40F", bg: "rgba(241,196,15,0.15)" },
  "Em Fila": { color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  "Falhou": { color: "#E74C3C", bg: "rgba(231,76,60,0.15)" },
};

const filtros = ["Todos", "Imprimindo", "Em Fila", "Concluído", "Falhou"] as const;

// Status disponíveis para novos projetos
const STATUS_OPCOES: Projeto["status"][] = ["Em Fila", "Imprimindo", "Concluído", "Falhou"];

// Emojis sugeridos para categorizar o projeto visualmente
const EMOJIS = ["📱", "🖥️", "🐉", "📦", "🔧", "🎮", "🏠", "🚗", "✈️", "🤖", "💡", "🔑"];

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>(projetosIniciais);
  const [filtroAtivo, setFiltroAtivo] = useState<string>("Todos");
  const [modalVisible, setModalVisible] = useState(false);

  // Estado do formulário
  const [nome, setNome] = useState("");
  const [filamento, setFilamento] = useState("");
  const [tempo, setTempo] = useState("");
  const [custo, setCusto] = useState("");
  const [venda, setVenda] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState<Projeto["status"]>("Em Fila");
  const [emojiSelecionado, setEmojiSelecionado] = useState("📦");

  const projetosFiltrados =
    filtroAtivo === "Todos"
      ? projetos
      : projetos.filter((p) => p.status === filtroAtivo);

  function salvar() {
    if (!nome.trim()) return;

    // Formata o custo: se o usuário digitou apenas número, adiciona o prefixo R$
    const custoFormatado = custo.trim()
      ? custo.startsWith("R$") ? custo : `R$${custo}`
      : "R$0,00";

    const vendaFormatada = venda.trim()
      ? venda.startsWith("R$") ? venda : `R$${venda}`
      : "-";

    const novoProjeto: Projeto = {
      id: Date.now(),
      nome: nome.trim(),
      status: statusSelecionado,
      filamento: filamento.trim() || "Não informado",
      tempo: tempo.trim() || "-",
      custo: custoFormatado,
      venda: vendaFormatada,
      data: "Hoje",
      emoji: emojiSelecionado,
    };

    setProjetos((prev) => [novoProjeto, ...prev]);
    fecharModal();
  }

  function fecharModal() {
    setModalVisible(false);
    setNome("");
    setFilamento("");
    setTempo("");
    setCusto("");
    setVenda("");
    setStatusSelecionado("Em Fila");
    setEmojiSelecionado("📦");
  }

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
        <View className="w-9 h-9 rounded-full items-center justify-center bg-accent">
          <Text className="text-sm font-bold text-white">M</Text>
        </View>
      </View>

      {/* Título + botão ficam fora do ScrollView principal para não sumir ao rolar */}
      <View className="flex-row items-center justify-between px-5 mb-4">
        <Text
          className="text-[26px] font-extrabold text-text-main"
          style={{ letterSpacing: -0.5, lineHeight: 34 }}
        >
          Projetos{"\n"}
          <Text className="text-accent">& Impressões</Text>
        </Text>
        <TouchableOpacity
          activeOpacity={0.75}
          className="bg-accent rounded-xl px-4 py-[10px]"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold text-[14px]">+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* ── FILTROS HORIZONTAIS ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {filtros.map((f) => {
          const ativo = filtroAtivo === f;
          return (
            <TouchableOpacity
              key={f}
              activeOpacity={0.75}
              onPress={() => setFiltroAtivo(f)}
              className="rounded-full px-[14px] py-[6px] border"
              style={{
                backgroundColor: ativo ? "#FF6B2B" : "#13131A",
                borderColor: ativo ? "#FF6B2B" : "#1E1E2E",
              }}
            >
              <Text
                className="text-[12px] font-bold"
                style={{ color: ativo ? "#fff" : "#6B6B80" }}
              >
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── LISTA DE PROJETOS ── */}
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {projetosFiltrados.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-text-muted text-[14px] font-semibold">
              Nenhum projeto encontrado
            </Text>
          </View>
        ) : (
          projetosFiltrados.map((p) => {
            const s = statusStyles[p.status];
            return (
              <View key={p.id} className="bg-surface rounded-2xl p-4 border border-separator mb-[10px]">

                {/* Linha superior: emoji + nome + status */}
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center gap-3 flex-1 mr-3">
                    <Text className="text-[28px]">{p.emoji}</Text>
                    <View className="flex-1">
                      <Text className="font-bold text-[14px] text-text-main" numberOfLines={1}>
                        {p.nome}
                      </Text>
                      <Text className="text-[11px] text-text-muted mt-[2px]">
                        🧵 {p.filamento} · ⏱ {p.tempo}
                      </Text>
                    </View>
                  </View>
                  <View
                    className="rounded-full px-[10px] py-[3px]"
                    style={{ backgroundColor: s.bg }}
                  >
                    <Text className="text-[11px] font-bold" style={{ color: s.color }}>
                      {p.status}
                    </Text>
                  </View>
                </View>

                {/* Separador */}
                <View className="h-px bg-separator mb-3" />

                {/* Linha inferior: custo / data / venda */}
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-[10px] text-text-muted font-semibold uppercase mb-1" style={{ letterSpacing: 0.5 }}>
                      Custo
                    </Text>
                    <Text className="text-[14px] font-bold text-danger">{p.custo}</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-[10px] text-text-muted font-semibold uppercase mb-1" style={{ letterSpacing: 0.5 }}>
                      Data
                    </Text>
                    <Text className="text-[14px] font-bold text-text-main">{p.data}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] text-text-muted font-semibold uppercase mb-1" style={{ letterSpacing: 0.5 }}>
                      Venda
                    </Text>
                    <Text
                      className="text-[14px] font-bold"
                      style={{ color: p.venda === "-" ? "#6B6B80" : "#2ECC71" }}
                    >
                      {p.venda}
                    </Text>
                  </View>
                </View>

              </View>
            );
          })
        )}
      </ScrollView>

      {/* ── MODAL: NOVO PROJETO ── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}>
          <ScrollView
            style={{ backgroundColor: "#13131A", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Alça visual */}
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "#1E1E2E",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            <Text
              className="text-[20px] font-extrabold text-text-main mb-6"
              style={{ letterSpacing: -0.5 }}
            >
              Novo Projeto
            </Text>

            {/* Nome */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
              Nome do projeto *
            </Text>
            <TextInput
              className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px] mb-4"
              placeholder="Ex: Suporte para parede"
              placeholderTextColor="#6B6B80"
              value={nome}
              onChangeText={setNome}
            />

            {/* Status */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[8px]">
              Status
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {STATUS_OPCOES.map((s) => {
                const ativo = statusSelecionado === s;
                const cor = statusStyles[s].color;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => setStatusSelecionado(s)}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: ativo ? cor + "22" : "#0A0A0F",
                      borderWidth: 1,
                      borderColor: ativo ? cor : "#1E1E2E",
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "bold", color: ativo ? cor : "#6B6B80" }}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Emoji */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[8px]">
              Ícone
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {EMOJIS.map((e) => {
                const ativo = emojiSelecionado === e;
                return (
                  <TouchableOpacity
                    key={e}
                    onPress={() => setEmojiSelecionado(e)}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: ativo ? "rgba(255,107,43,0.15)" : "#0A0A0F",
                      borderWidth: 1.5,
                      borderColor: ativo ? "#FF6B2B" : "#1E1E2E",
                    }}
                  >
                    <Text style={{ fontSize: 22 }}>{e}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Filamento */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
              Filamento usado
            </Text>
            <TextInput
              className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px] mb-4"
              placeholder="Ex: PLA+ Preto"
              placeholderTextColor="#6B6B80"
              value={filamento}
              onChangeText={setFilamento}
            />

            {/* Tempo + Custo lado a lado */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
                  Tempo de impressão
                </Text>
                <TextInput
                  className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px]"
                  placeholder="Ex: 3h 20min"
                  placeholderTextColor="#6B6B80"
                  value={tempo}
                  onChangeText={setTempo}
                />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
                  Custo (R$)
                </Text>
                <TextInput
                  className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px]"
                  keyboardType="decimal-pad"
                  placeholder="Ex: 12,50"
                  placeholderTextColor="#6B6B80"
                  value={custo}
                  onChangeText={setCusto}
                />
              </View>
            </View>

            {/* Preço de venda */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
              Preço de venda (R$)
            </Text>
            <TextInput
              className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px] mb-6"
              keyboardType="decimal-pad"
              placeholder="Ex: 35,00 (deixe vazio se não vendeu)"
              placeholderTextColor="#6B6B80"
              value={venda}
              onChangeText={setVenda}
            />

            {/* Botões */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={salvar}
              style={{
                backgroundColor: "#FF6B2B",
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
                Salvar projeto
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={fecharModal}
              style={{
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                backgroundColor: "#0A0A0F",
              }}
            >
              <Text style={{ color: "#6B6B80", fontWeight: "600", fontSize: 15 }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
