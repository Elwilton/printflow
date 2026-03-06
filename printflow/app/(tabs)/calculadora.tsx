// TELA: Calculadora de Precificação
//
// Conceitos novos nesta tela:
// - useState: hook do React para guardar valores que mudam (estado).
//   Quando o estado muda, o componente re-renderiza automaticamente.
// - TextInput: campo de texto, equivalente ao <input> no web.
//   keyboardType="decimal-pad" abre o teclado numérico com decimais no celular.
// - Cálculos em tempo real: como os valores derivados sao calculados diretamente
//   a partir do estado, eles atualizam automaticamente ao digitar.

import { useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Função de formatação de moeda — usada em vários lugares da tela
function fmt(v: number) {
  return `R$${v.toFixed(2).replace(".", ",")}`;
}

// Linha de custo individual no detalhamento
function CostRow({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-row items-center justify-between mb-[10px]">
      <Text className="text-[13px] text-text-dim">{label}</Text>
      <Text className="text-[13px] font-bold text-text-main">{fmt(value)}</Text>
    </View>
  );
}

export default function Calculadora() {
  // useState retorna [valorAtual, funcaoParaAtualizar]
  // Quando chamamos setPeso("50"), o React re-renderiza o componente com o novo valor
  const [peso, setPeso] = useState("45");
  const [preco, setPreco] = useState("89");
  const [horas, setHoras] = useState("3.5");
  const [margem, setMargem] = useState("60");

  // Cálculos derivados do estado — sao recomputados a cada renderização
  const pesoNum = parseFloat(peso) || 0;
  const precoRolo = parseFloat(preco) || 0;
  const horasNum = parseFloat(horas) || 0;
  const margemNum = parseFloat(margem) || 0;

  const custFilamento = (pesoNum / 1000) * precoRolo;
  const custEnergia = horasNum * 0.5 * 0.85;
  const custMaoObra = horasNum * 5;
  const custFalha = (custFilamento + custEnergia) * 0.08;
  const custTotal = custFilamento + custEnergia + custMaoObra + custFalha;
  // Fórmula para calcular preço de venda com margem de lucro
  const precoVenda = margemNum >= 100 ? 0 : custTotal / (1 - margemNum / 100);
  const lucro = precoVenda - custTotal;

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
        // Garante que o teclado nao esconde o campo ativo
        keyboardShouldPersistTaps="handled"
      >
        {/* Título */}
        <View className="mb-6">
          <Text
            className="text-[26px] font-extrabold text-text-main"
            style={{ letterSpacing: -0.5, lineHeight: 34 }}
          >
            Calcular{"\n"}
            <Text className="text-accent">Precificação</Text>
          </Text>
          <Text className="text-[13px] text-text-muted mt-2">
            Descubra o preço justo para sua peça
          </Text>
        </View>

        {/* ── PARÂMETROS ── */}
        <View className="bg-surface rounded-2xl p-4 border border-separator mb-4">
          <Text
            className="text-[11px] font-bold text-text-muted mb-4 uppercase"
            style={{ letterSpacing: 1.5 }}
          >
            ⚙️ Parâmetros da Peça
          </Text>

          {/* Grid 2 colunas de inputs — renderizamos em pares */}
          {[
            [
              { label: "Peso (gramas)", val: peso, set: setPeso, placeholder: "45" },
              { label: "Preço do Rolo (R$)", val: preco, set: setPreco, placeholder: "89" },
            ],
            [
              { label: "Tempo (horas)", val: horas, set: setHoras, placeholder: "3.5" },
              { label: "Margem desejada (%)", val: margem, set: setMargem, placeholder: "60" },
            ],
          ].map((row, rowIdx) => (
            <View key={rowIdx} className="flex-row gap-3 mb-3">
              {row.map((field) => (
                <View key={field.label} className="flex-1">
                  <Text className="text-[12px] font-semibold text-text-muted mb-[6px]">
                    {field.label}
                  </Text>
                  <TextInput
                    className="bg-bg border border-separator rounded-xl px-[14px] py-3 text-text-main text-[14px]"
                    keyboardType="decimal-pad"
                    value={field.val}
                    onChangeText={field.set}
                    placeholder={field.placeholder}
                    placeholderTextColor="#6B6B80"
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* ── COMPOSIÇÃO DE CUSTOS ── */}
        <View className="bg-surface rounded-2xl p-4 border border-separator mb-4">
          <Text
            className="text-[11px] font-bold text-text-muted mb-4 uppercase"
            style={{ letterSpacing: 1.5 }}
          >
            📊 Composição de Custo
          </Text>
          <CostRow label="🧵 Filamento" value={custFilamento} />
          <CostRow label="⚡ Energia" value={custEnergia} />
          <CostRow label="👐 Mão de Obra" value={custMaoObra} />
          <CostRow label="♻️ Desperdício (8%)" value={custFalha} />
          {/* Separador */}
          <View className="h-px bg-separator my-3" />
          <View className="flex-row items-center justify-between">
            <Text className="text-[13px] font-bold text-text-main">Custo Total</Text>
            <Text className="text-[15px] font-extrabold text-accent">{fmt(custTotal)}</Text>
          </View>
        </View>

        {/* ── RESULTADO ── */}
        <View
          className="rounded-2xl p-4 border"
          style={{
            backgroundColor: "rgba(255, 107, 43, 0.08)",
            borderColor: "rgba(255, 107, 43, 0.3)",
          }}
        >
          <Text
            className="text-[11px] font-bold text-text-muted mb-4 uppercase"
            style={{ letterSpacing: 1.5 }}
          >
            💎 Resultado
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Text className="text-[11px] text-text-muted font-semibold mb-1 uppercase" style={{ letterSpacing: 0.5 }}>
                Preço de Venda
              </Text>
              <Text
                className="text-[30px] font-extrabold text-accent"
                style={{ letterSpacing: -1 }}
              >
                {fmt(precoVenda)}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-[11px] text-text-muted font-semibold mb-1 uppercase" style={{ letterSpacing: 0.5 }}>
                Seu Lucro
              </Text>
              <Text
                className="text-[30px] font-extrabold text-success"
                style={{ letterSpacing: -1 }}
              >
                {fmt(lucro)}
              </Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

