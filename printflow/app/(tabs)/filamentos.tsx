// TELA: Filamentos
//
// Conceitos novos nesta tela:
// - Modal: componente nativo para sobrepor conteúdo na tela (como um dialog/drawer).
//   animationType="slide" faz ele deslizar de baixo para cima.
//   transparent + fundo escuro cria o efeito de "bottom sheet".
// - useState com array: a lista de rolos agora vive no estado,
//   então ao adicionar um rolo, o componente re-renderiza automaticamente.
// - Date.now(): gera um id único baseado no timestamp atual.

import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Rolo {
  id: number;
  nome: string;
  tipo: string;
  peso: number;   // gramas restantes
  total: number;  // gramas totais do rolo
  preco: number;  // preço em R$
  cor: string;    // cor hex do filamento
}

const rolosIniciais: Rolo[] = [
  { id: 1, nome: "eSUN PLA+ Preto", tipo: "PLA+", peso: 740, total: 1000, preco: 89, cor: "#444444" },
  { id: 2, nome: "Bambu PLA Branco", tipo: "PLA", peso: 320, total: 1000, preco: 105, cor: "#E8E8E8" },
  { id: 3, nome: "eSUN PETG Azul", tipo: "PETG", peso: 890, total: 1000, preco: 98, cor: "#3B82F6" },
  { id: 4, nome: "Creality TPU", tipo: "TPU", peso: 150, total: 500, preco: 75, cor: "#A855F7" },
];

// Opções de tipo de filamento
const TIPOS = ["PLA", "PLA+", "PETG", "TPU", "ABS", "ASA"];

// Cores predefinidas para o usuário escolher
const CORES = [
  { hex: "#444444", label: "Preto" },
  { hex: "#E8E8E8", label: "Branco" },
  { hex: "#FF6B2B", label: "Laranja" },
  { hex: "#3B82F6", label: "Azul" },
  { hex: "#2ECC71", label: "Verde" },
  { hex: "#E74C3C", label: "Vermelho" },
  { hex: "#F1C40F", label: "Amarelo" },
  { hex: "#A855F7", label: "Roxo" },
  { hex: "#EC4899", label: "Rosa" },
  { hex: "#6B7280", label: "Cinza" },
];

function getStatusColor(pct: number) {
  if (pct > 40) return "#2ECC71";
  if (pct > 15) return "#F1C40F";
  return "#E74C3C";
}

function getStatusBg(pct: number) {
  if (pct > 40) return "rgba(46,204,113,0.15)";
  if (pct > 15) return "rgba(241,196,15,0.15)";
  return "rgba(231,76,60,0.15)";
}

function getStatusLabel(pct: number) {
  if (pct > 40) return "OK";
  if (pct > 15) return "Baixo";
  return "Crítico!";
}

export default function Filamentos() {
  // Agora rolos é um estado mutável — podemos adicionar itens
  const [rolos, setRolos] = useState<Rolo[]>(rolosIniciais);
  const [modalVisible, setModalVisible] = useState(false);

  // Estado do formulário de novo rolo
  const [nome, setNome] = useState("");
  const [tipoSelecionado, setTipoSelecionado] = useState("PLA");
  const [pesoTotal, setPesoTotal] = useState("1000");
  const [preco, setPreco] = useState("");
  const [corSelecionada, setCorSelecionada] = useState("#444444");

  function salvar() {
    // Validação simples: nome e preço são obrigatórios
    if (!nome.trim() || !preco.trim()) return;

    const pesoNum = parseFloat(pesoTotal) || 1000;
    const precoNum = parseFloat(preco.replace(",", ".")) || 0;

    const novoRolo: Rolo = {
      id: Date.now(), // timestamp como id único temporário
      nome: nome.trim(),
      tipo: tipoSelecionado,
      peso: pesoNum,
      total: pesoNum,
      preco: precoNum,
      cor: corSelecionada,
    };

    // Adiciona no início da lista
    setRolos((prev) => [novoRolo, ...prev]);
    fecharModal();
  }

  function fecharModal() {
    setModalVisible(false);
    // Reseta o formulário ao fechar
    setNome("");
    setTipoSelecionado("PLA");
    setPesoTotal("1000");
    setPreco("");
    setCorSelecionada("#444444");
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

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Título + botão */}
        <View className="flex-row items-center justify-between mb-6">
          <Text
            className="text-[26px] font-extrabold text-text-main"
            style={{ letterSpacing: -0.5, lineHeight: 34 }}
          >
            Meus{"\n"}
            <Text className="text-accent">Filamentos</Text>
          </Text>

          <TouchableOpacity
            activeOpacity={0.75}
            className="bg-accent rounded-xl px-4 py-[10px]"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white font-bold text-[14px]">+ Novo</Text>
          </TouchableOpacity>
        </View>

        {/* ── LISTA DE ROLOS ── */}
        {rolos.map((r) => {
          const pct = Math.round((r.peso / r.total) * 100);
          const sc = getStatusColor(pct);
          const sb = getStatusBg(pct);
          const custGrama = (r.preco / r.total).toFixed(3);

          return (
            <View key={r.id} className="bg-surface rounded-2xl p-4 border border-separator mb-[10px]">

              {/* Linha superior: cor + nome + status */}
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor: r.cor,
                    borderWidth: 1.5,
                    borderColor: "rgba(255,255,255,0.2)",
                  }}
                />
                <View className="flex-1">
                  <Text className="font-bold text-[14px] text-text-main">{r.nome}</Text>
                  <Text className="text-[11px] text-text-muted mt-[1px]">
                    R${custGrama}/g · {r.tipo}
                  </Text>
                </View>
                <View
                  className="rounded-full px-[10px] py-[3px]"
                  style={{ backgroundColor: sb }}
                >
                  <Text className="text-[11px] font-bold" style={{ color: sc }}>
                    {getStatusLabel(pct)}
                  </Text>
                </View>
              </View>

              {/* Peso restante */}
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-[12px] text-text-muted">Restante</Text>
                <Text className="text-[13px] font-bold text-text-main">
                  {r.peso}g{" "}
                  <Text className="font-normal text-text-muted">/ {r.total}g</Text>
                </Text>
              </View>

              {/* Barra de progresso */}
              <View className="h-2 rounded-full bg-separator overflow-hidden">
                <View
                  style={{
                    height: 8,
                    width: `${pct}%`,
                    backgroundColor: sc,
                    borderRadius: 4,
                  }}
                />
              </View>

              <Text
                className="text-[11px] font-bold mt-[6px] text-right"
                style={{ color: sc }}
              >
                {pct}% restante
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* ── MODAL: NOVO FILAMENTO ── */}
      {/* transparent={true} + fundo escuro = efeito de overlay */}
      {/* animationType="slide" = entra deslizando de baixo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <View
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" }}
        >
          {/* O "drawer" em si — sobe do fundo */}
          <View
            style={{
              backgroundColor: "#13131A",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 40,
            }}
          >
            {/* Alça visual do drawer */}
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
              Novo Filamento
            </Text>

            {/* Campo: Nome */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
              Nome do rolo
            </Text>
            <TextInput
              className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px] mb-4"
              placeholder="Ex: eSUN PLA+ Preto"
              placeholderTextColor="#6B6B80"
              value={nome}
              onChangeText={setNome}
            />

            {/* Campo: Tipo — pills selecionáveis */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[8px]">
              Tipo de filamento
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
              contentContainerStyle={{ gap: 8 }}
            >
              {TIPOS.map((t) => {
                const ativo = tipoSelecionado === t;
                return (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setTipoSelecionado(t)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: ativo ? "#FF6B2B" : "#0A0A0F",
                      borderWidth: 1,
                      borderColor: ativo ? "#FF6B2B" : "#1E1E2E",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        color: ativo ? "#fff" : "#6B6B80",
                      }}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Campo: Cor — bolinhas coloridas */}
            <Text className="text-[12px] font-semibold text-text-muted mb-[8px]">
              Cor
            </Text>
            <View className="flex-row flex-wrap gap-3 mb-4">
              {CORES.map((c) => {
                const ativo = corSelecionada === c.hex;
                return (
                  <TouchableOpacity
                    key={c.hex}
                    onPress={() => setCorSelecionada(c.hex)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: c.hex,
                      borderWidth: ativo ? 2.5 : 1.5,
                      borderColor: ativo ? "#FF6B2B" : "rgba(255,255,255,0.15)",
                    }}
                  />
                );
              })}
            </View>

            {/* Campos numéricos lado a lado */}
            <View className="flex-row gap-3 mb-6">
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
                  Peso total (g)
                </Text>
                <TextInput
                  className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px]"
                  keyboardType="decimal-pad"
                  placeholder="1000"
                  placeholderTextColor="#6B6B80"
                  value={pesoTotal}
                  onChangeText={setPesoTotal}
                />
              </View>
              <View className="flex-1">
                <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
                  Preço (R$)
                </Text>
                <TextInput
                  className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px]"
                  keyboardType="decimal-pad"
                  placeholder="89"
                  placeholderTextColor="#6B6B80"
                  value={preco}
                  onChangeText={setPreco}
                />
              </View>
            </View>

            {/* Botões de ação */}
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
                Salvar filamento
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
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}
