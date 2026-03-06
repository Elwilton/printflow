// O _layout.tsx dentro de (tabs) configura a barra de navegacao inferior.
// A pasta (tabs) usa parenteses porque é um "grupo de rotas" no expo-router —
// o nome do grupo nao aparece na URL, ele só serve para organizar.
// Cada arquivo dentro de (tabs) vira automaticamente uma aba.

import { Tabs } from "expo-router";
import { Text, View } from "react-native";

// Componente do ícone de cada aba.
// "focused" é true quando essa aba está ativa — usamos isso para mudar a cor.
function TabIcon({
  emoji,
  label,
  focused,
}: {
  emoji: string;
  label: string;
  focused: boolean;
}) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
        // Fundo laranja translúcido só quando ativo
        backgroundColor: focused ? "rgba(255, 107, 43, 0.15)" : "transparent",
      }}
    >
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 10,
          fontWeight: "700",
          color: focused ? "#FF6B2B" : "#6B6B80",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#13131A",
          borderTopColor: "#1E1E2E",
          borderTopWidth: 1,
          height: 70,
        },
        // tabBarShowLabel: false porque estamos desenhando nosso próprio label
        tabBarShowLabel: false,
      }}
    >
      {/* Cada Tabs.Screen corresponde a um arquivo dentro de (tabs) */}
      <Tabs.Screen
        name="index" // → app/(tabs)/index.tsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📊" label="Início" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calculadora" // → app/(tabs)/calculadora.tsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧮" label="Calcular" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="filamentos" // → app/(tabs)/filamentos.tsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🧵" label="Filamentos" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="projetos" // → app/(tabs)/projetos.tsx
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📁" label="Projetos" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
