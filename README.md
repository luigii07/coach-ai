# 🏋️‍♂️ Coach AI (Fit AI)

> Plataforma full-stack de treinos inteligentes com chatbot integrado para geração de planos de treino personalizados e acompanhamento de progresso.

O **Coach AI** é um sistema moderno projetado para entusiastas do fitness e profissionais de educação física. Ele combina o poder da Inteligência Artificial (Google Gemini) com uma interface ágil e dinâmica em Next.js para criar, gerenciar e otimizar rotinas de treino personalizadas.

---

## 🎥 Demonstração do Projeto

Assista abaixo à demonstração completa das principais funcionalidades da plataforma:

<!-- ADICIONE O VÍDEO AQUI -->

### [▶️ Assistir ao Vídeo de Demonstração](https://res.cloudinary.com/dq3gneixn/video/upload/v1786497595/download_wgzxli.mp4)

---

## 🚀 Principais Funcionalidades

- **💬 Chatbot Inteligente**: Interação contínua para esclarecer dúvidas, receber feedbacks e ajustar seus treinos.
- **📋 Geração de Treinos Personalizados**: Treinos sob medida criados dinamicamente com base nas suas metas e limitações através do Google Generative AI (Gemini).
- **🔒 Autenticação Robusta**: Fluxo seguro de autenticação (incluindo OAuth via Google) implementado com Better Auth.
- **📚 Documentação Interativa**: API documentada com Scalar (Fastify API Reference) para fácil exploração dos endpoints.

---

## 🛠️ Tecnologias Utilizadas

### Backend (API)

- **Runtime**: [Node.js (v22+)](https://nodejs.org/) com [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Fastify](https://fastify.dev/) (Rápido, leve e de baixo overhead)
- **Banco de Dados & ORM**: [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/)
- **Validação de Tipos**: [Zod](https://zod.dev/) & [Fastify Type Provider Zod](https://github.com/turkerdev/fastify-type-provider-zod)
- **Inteligência Artificial**: [@ai-sdk/google](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) (Google Gemini API)
- **Autenticação**: [Better Auth](https://www.better-auth.com/)

### Frontend (Web)

- **Framework**: [Next.js v16](https://nextjs.org/) (App Router) & [React v19](https://react.dev/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Componentes**: [Radix UI](https://www.radix-ui.com/) & [lucide-react](https://lucide.react.dev/)
- **Gerenciamento de Formulários**: [React Hook Form](https://react-hook-form.com/) integrado com Zod
- **Gerenciamento de Estado de URL**: [nuqs](https://nuqs.47ng.com/)
- **Geração de Clientes de API**: [Orval](https://orval.dev/)

---

## 📦 Estrutura do Repositório

O projeto adota o modelo de Monorepo utilizando workspaces do `pnpm`:

```bash
coach-ai/
├── api/          # Servidor Backend em Fastify
└── web/          # Aplicação Frontend em Next.js
```

---

## ⚙️ Como Configurar e Executar Localmente

### Pré-requisitos

- **Node.js** (v22 ou superior recomendado)
- **pnpm** (gerenciador de pacotes padrão)
- **PostgreSQL** rodando localmente ou via Docker

---

### Passo 1: Instalação das Dependências

Na raiz do projeto, instale as dependências de todo o workspace:

```bash
pnpm install
```

---

### Passo 2: Configurando o Backend (`api/`)

1. Navegue até o diretório da API:
   ```bash
   cd api
   ```
2. Crie o arquivo `.env` com base no exemplo:
   ```bash
   cp .env.example .env
   ```
3. Preencha as variáveis de ambiente necessárias em `api/.env`:
   - `DATABASE_URL`: URL de conexão com o banco PostgreSQL.
   - `GOOGLE_GENERATIVE_AI_API_KEY`: Sua chave de API do Gemini da Google AI Studio.
   - `BETTER_AUTH_SECRET`: Uma chave secreta para a segurança da autenticação.
   - Configurações do OAuth do Google (`GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`).

4. Execute as migrations do Prisma para estruturar o banco de dados:

   ```bash
   npx prisma migrate dev
   ```

5. Inicie o servidor de desenvolvimento do backend:
   ```bash
   pnpm dev
   ```
   A API estará ativa em: `http://localhost:3333`
   A documentação do Scalar estará acessível em: `http://localhost:3333/docs`

---

### Passo 3: Configurando o Frontend (`web/`)

1. Em um terminal separado, navegue até a pasta do frontend:
   ```bash
   cd web
   ```
2. Crie ou verifique o arquivo `.env` garantindo que possui os seguintes endereços locais:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3333"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
3. Inicie o servidor Next.js:
   ```bash
   pnpm dev
   ```
   O frontend estará disponível em: `http://localhost:3000`

---

## 🤝 Autor

Desenvolvido por **Luigi Oliveira**.
