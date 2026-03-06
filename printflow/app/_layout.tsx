// O _layout.tsx raiz é o ponto de entrada de toda a navegacao do app.
// Aqui importamos o CSS global do NativeWind e configuramos o Stack (pilha de telas).
// O Stack é o sistema de navegacao padrao — pensa nele como um "histórico de telas".

import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  console.log("RootLayout renderizando...");
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
