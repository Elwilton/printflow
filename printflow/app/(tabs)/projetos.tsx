// TELA: Projetos & Impressões
//
// Conceitos novos nesta tela:
// - useEffect para carregar dados da API ao montar a tela.
// - Os campos custo/venda/tempo agora são numéricos (alinhados com a API).
// - formatMoeda e formatTempo: funções utilitárias do services/api.ts.

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  projetosApi,
  type Projeto,
  formatMoeda,
  formatTempo,
} from "../../services/api";

const statusStyles: Record<string, { color: string; bg: string }> = {
  "Concluído": { color: "#2ECC71", bg: "rgba(46,204,113,0.15)" },
  "Imprimindo": { color: "#F1C40F", bg: "rgba(241,196,15,0.15)" },
  "Em Fila":   { color: "#3B82F6", bg: "rgba(59,130,246,0.15)" },
  "Falhou":    { color: "#E74C3C", bg: "rgba(231,76,60,0.15)" },
};

const filtros = ["Todos", "Imprimindo", "Em Fila", "Concluído", "Falhou"] as const;
const STATUS_OPCOES = ["Em Fila", "Imprimindo", "Concluído", "Falhou"];
const EMOJIS = ["📱", "🖥️", "🐉", "📦", "🔧", "🎮", "🏠", "🚗", "✈️", "🤖", "💡", "🔑"];

function formatData(iso: string): string {
  const data = new Date(iso);
  const hoje = new Date();
  const diff = Math.floor((hoje.getTime() - data.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Ontem";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroAtivo, setFiltroAtivo] = useState<string>("Todos");
  const [modalVisible, setModalVisible] = useState(false);

  // Estado do formulário
  const [nome, setNome] = useState("");
  const [tempo, setTempo] = useState("");
  const [custo, setCusto] = useState("");
  const [venda, setVenda] = useState("");
  const [statusSelecionado, setStatusSelecionado] = useState("Em Fila");
  const [emojiSelecionado, setEmojiSelecionado] = useState("📦");

  const projetosFiltrados =
    filtroAtivo === "Todos"
      ? projetos
      : projetos.filter((p) => p.status === filtroAtivo);

  useEffect(() => {
    carregarProjetos();
  }, []);

  async function carregarProjetos() {
    try {
      setLoading(true);
      const dados = await projetosApi.getAll();
      setProjetos(dados);
    } catch (err) {
      console.error("Erro ao carregar projetos:", err);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    if (!nome.trim()) return;

    const tempoNum = parseFloat(tempo.replace(",", ".")) || 0;
    const custoNum = parseFloat(custo.replace(",", ".")) || 0;
    const vendaNum = parseFloat(venda.replace(",", ".")) || 0;

    try {
      const novoProjeto = await projetosApi.create({
        nome: nome.trim(),
        emoji: emojiSelecionado,
        status: statusSelecionado,
        tempoHoras: tempoNum,
        custo: custoNum,
        venda: vendaNum,
        filamentoId: null,
      });

      setProjetos((prev) => [novoProjeto, ...prev]);
      fecharModal();
    } catch (err) {
      console.error("Erro ao salvar projeto:", err);
    }
  }

  function fecharModal() {
    setModalVisible(false);
    setNome("");
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

      {/* Título + botão */}
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
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator color="#FF6B2B" size="large" />
            <Text className="text-text-muted text-[13px] mt-3">
              Carregando projetos...
            </Text>
          </View>
        ) : projetosFiltrados.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-4xl mb-3">🔍</Text>
            <Text className="text-text-muted text-[14px] font-semibold">
              Nenhum projeto encontrado
            </Text>
          </View>
        ) : (
          projetosFiltrados.map((p) => {
            const s = statusStyles[p.status] ?? { color: "#6B6B80", bg: "rgba(107,107,128,0.15)" };
            const tempoLabel = p.tempoHoras > 0 ? formatTempo(p.tempoHoras) : "-";
            const vendaLabel = p.venda > 0 ? formatMoeda(p.venda) : "-";

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
                        ⏱ {tempoLabel}
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
                    <Text className="text-[14px] font-bold text-danger">
                      {formatMoeda(p.custo)}
                    </Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-[10px] text-text-muted font-semibold uppercase mb-1" style={{ letterSpacing: 0.5 }}>
                      Data
                    </Text>
                    <Text className="text-[14px] font-bold text-text-main">
                      {formatData(p.criadoEm)}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-[10px] text-text-muted font-semibold uppercase mb-1" style={{ letterSpacing: 0.5 }}>
                      Venda
                    </Text>
                    <Text
                      className="text-[14px] font-bold"
                      style={{ color: p.venda > 0 ? "#2ECC71" : "#6B6B80" }}
                    >
                      {vendaLabel}
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
                const cor = statusStyles[s]?.color ?? "#6B6B80";
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

            {/* Tempo + Custo lado a lado */}
            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
                  Tempo (horas)
                </Text>
                <TextInput
                  className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px]"
                  keyboardType="decimal-pad"
                  placeholder="Ex: 2.5"
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
                  placeholder="Ex: 12.50"
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
              placeholder="Ex: 35.00 (deixe vazio se não vendeu)"
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
