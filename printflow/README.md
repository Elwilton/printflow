# PrintFlow 🖨️

> App de gestão completa para makers de impressão 3D — controle seus filamentos, projetos e calcule o preço justo para cada peça.

---

## Sobre o Projeto

O **PrintFlow** nasceu da necessidade real de quem trabalha com impressão 3D e precisa controlar custos, estoque de filamentos e projetos de forma profissional.

A maioria dos makers controla tudo em planilhas ou no "feeling" — o PrintFlow resolve isso com uma interface moderna, rápida e pensada para o celular.

### Problema que resolve

- Quanto custa realmente imprimir essa peça?
- Quanto de filamento ainda me restou no rolo?
- Qual foi o lucro das minhas impressões esse mês?
- Quais projetos estão na fila, imprimindo ou concluídos?

---

## Telas

### Dashboard — Visão Geral
A tela inicial mostra os KPIs mais importantes do mês: faturamento, lucro líquido, peças produzidas e filamento consumido. Também exibe o ranking das peças mais rentáveis e as impressões mais recentes.

<!-- screenshot: app/(tabs)/index.tsx -->
> 📸 *Dashboard com KPIs, Top Peças e Impressões Recentes*

---

### Calculadora de Precificação
Preencha o peso da peça, o preço do rolo, o tempo de impressão e a margem desejada — o app calcula automaticamente todos os custos (filamento, energia, mão de obra, desperdício) e o preço de venda ideal.

<!-- screenshot: app/(tabs)/calculadora.tsx -->
> 📸 *Calculadora com detalhamento de custos e resultado em tempo real*

**Fórmula de precificação:**
```
Custo Total = Filamento + Energia + Mão de Obra + Desperdício (8%)
Preço de Venda = Custo Total / (1 - Margem%)
Lucro = Preço de Venda - Custo Total
```

---

### Filamentos — Controle de Estoque
Visualize todos os seus rolos com barra de progresso do quanto resta, custo por grama e status (OK / Baixo / Crítico). Adicione novos rolos com tipo, cor e peso pelo botão `+ Novo`.

<!-- screenshot: app/(tabs)/filamentos.tsx -->
> 📸 *Lista de filamentos com barras de progresso e modal de cadastro*

---

### Projetos & Impressões
Gerencie todos os seus projetos com filtros por status (Imprimindo, Em Fila, Concluído, Falhou). Cadastre novos projetos informando emoji, filamento usado, tempo, custo e preço de venda.

<!-- screenshot: app/(tabs)/projetos.tsx -->
> 📸 *Lista de projetos com filtros horizontais e modal de cadastro*

---

## Stack Técnica

| Tecnologia | Versão | Uso |
|---|---|---|
| [React Native](https://reactnative.dev/) | 0.83.2 | Framework mobile |
| [Expo](https://expo.dev/) | SDK 55 | Plataforma e tooling |
| [Expo Router](https://expo.github.io/router/) | v5 | Navegação baseada em arquivos |
| [NativeWind](https://www.nativewind.dev/) | v4 | Tailwind CSS para React Native |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Tipagem estática |
| [Supabase](https://supabase.com/) | — | Backend (próxima fase) |

---

## Estrutura do Projeto

```
printflow/
├── app/
│   ├── _layout.tsx              # Layout raiz (SafeAreaProvider + Stack)
│   └── (tabs)/
│       ├── _layout.tsx          # Tab bar com 4 abas
│       ├── index.tsx            # Dashboard
│       ├── calculadora.tsx      # Calculadora de precificação
│       ├── filamentos.tsx       # Estoque de filamentos
│       └── projetos.tsx         # Projetos e impressões
├── global.css                   # Estilos base do Tailwind/NativeWind
├── tailwind.config.js           # Paleta de cores customizada
├── babel.config.js              # Config do Babel com NativeWind
└── metro.config.js              # Config do Metro bundler
```

---

## Paleta de Cores

O app usa um tema escuro com cores personalizadas:

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0A0A0F` | Fundo principal |
| `surface` | `#13131A` | Cards e superfícies |
| `separator` | `#1E1E2E` | Bordas e divisores |
| `accent` | `#FF6B2B` | Cor principal (laranja) |
| `success` | `#2ECC71` | Lucros e status OK |
| `danger` | `#E74C3C` | Custos e erros |
| `warning` | `#F1C40F` | Alertas e status baixo |
| `text-main` | `#F0F0F5` | Texto principal |
| `text-muted` | `#6B6B80` | Texto secundário |

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Elwilton/printflow.git
cd printflow

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npx expo start --web
```

Acesse `http://localhost:8081` no navegador, ou use o app **Expo Go** no celular escaneando o QR code.

---

## Roadmap

### Fase 1 — Interface (concluída ✅)
- [x] Dashboard com KPIs
- [x] Calculadora de precificação em tempo real
- [x] Inventário de filamentos com barras de progresso
- [x] Gestão de projetos com filtros por status
- [x] Modais de cadastro para filamentos e projetos

### Fase 2 — Backend com Supabase (em breve)
- [ ] Autenticação de usuário
- [ ] Persistência de dados em nuvem
- [ ] Sincronização entre dispositivos
- [ ] Histórico de impressões

### Fase 3 — Funcionalidades avançadas
- [ ] Relatórios mensais e gráficos
- [ ] Alertas de estoque baixo
- [ ] Integração com slicers (Bambu Studio, OrcaSlicer)
- [ ] Exportar relatório em PDF

---

## Conceitos de React Native Aplicados

Este projeto foi construído com foco em aprendizado. Cada tela apresenta conceitos novos:

- **`View` / `Text`** — equivalentes ao `div` e `span` do web
- **`ScrollView`** — substitui o `overflow-y: auto` do CSS
- **`SafeAreaView`** — evita que o conteúdo fique atrás do notch
- **`TextInput`** — campo de input com `keyboardType="decimal-pad"`
- **`TouchableOpacity`** — botão com efeito de opacidade ao toque
- **`Modal`** — overlay para formulários (bottom sheet pattern)
- **`useState`** — estado local para inputs e listas
- **NativeWind** — classes Tailwind funcionando no React Native
- **Expo Router** — navegação por sistema de arquivos (como Next.js)

---

## Licença

MIT — use à vontade para aprender, modificar e distribuir.

---

Feito com 🧡 por [Elwilton](https://github.com/Elwilton)
