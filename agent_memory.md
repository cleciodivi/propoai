# Agent Memory

Base de conhecimento persistente do projeto PropoAI.

Sempre que descobrir algo novo sobre o projeto ou receber uma decisão importante do usuário, registre neste arquivo.

---

# Projeto

## 2026-07-01

Projeto PropoAI — SaaS híbrido de gestão de propostas comerciais com IA + gerador de landing pages de conversão.

---

# Backend

## 2026-07-01

Stack inicial: Next.js 15 API Routes + tRPC + Prisma + PostgreSQL + Redis + BullMQ.

---

# Frontend

## 2026-07-01

Stack inicial: Next.js 15 App Router + TypeScript + TailwindCSS + shadcn/ui + lucide-react.

## 2026-07-01

Layout moderno aplicado: gradientes em roxo/azul-claro, glassmorphism, cards com ícones, hero com efeitos visuais e identidade visual PropoAI.

---

# Banco de Dados

## 2026-07-01

MySQL do Laragon (adaptado do PostgreSQL porque Docker Desktop não estava em execução). Redis 7 para cache e filas em fase posterior.

---

# DevOps

## 2026-07-01

Docker Compose local para desenvolvimento. Deploy em nuvem em fase posterior.

---

# Arquitetura

## 2026-07-01

Monorepo com pnpm workspaces:

- apps/web (Next.js)
- packages/database (Prisma)
- packages/ui (componentes compartilhados)
- packages/config (configurações compartilhadas)

---

# Segurança

## 2026-07-01

Autenticação via NextAuth.js (Credentials + Google OAuth). Senhas com bcrypt. Variáveis sensíveis em .env.local.

---

# Convenções

## 2026-07-01

- TypeScript em todo o projeto.
- Componentes com shadcn/ui.
- Commits em português do Brasil.
- Código e documentação em português do Brasil.

---

# Decisões Importantes

## 2026-07-01

- Nome do produto: PropoAI.
- Idioma da aplicação: português do Brasil.
- Fluxo de pagamento: aprovação primeiro, pagamento opcional depois.
- Assinatura digital no MVP: aprovação por botão + confirmação por e-mail. ClickSign/DocuSign em fase posterior.
- Notificações: e-mail no MVP; WhatsApp em fase posterior.
- Hospedagem: Docker local primeiro, nuvem depois.

---

# Ajustes e Melhorias

## 2026-07-09

- Geração de proposta com IA possui fallback para modo de desenvolvimento: quando `OPENAI_API_KEY` não está configurada, o sistema gera uma proposta simulada localmente sem consumir tokens.

## 2026-07-09

- Dashboard: cards de estatísticas (Propostas, Clientes, Aprovadas, Enviadas) são clicáveis e levam às respectivas páginas (`/propostas`, `/clientes`, `/propostas?status=APPROVED`, `/propostas?status=SENT`).

## 2026-07-09

- Dashboard: cards de ação (Propostas, Clientes, Configurações) padronizados com altura igual, alinhamento vertical e botões outline com borda.

## 2026-07-09

- Proposta simulada de desenvolvimento reformulada para ser mais profissional: título com nome da empresa e serviço, seções de Apresentação, Objetivo, Escopo Detalhado, Investimento, Prazo de Execução e Próximos Passos. O tom de voz (formal, friendly, persuasive) influencia saudação, fechamento e frases de benefício/urgência, sem aparecer explicitamente no corpo da proposta.

## 2026-07-09

- Após criar ou editar cliente, o sistema redireciona automaticamente para `/clientes`.
- Após criar ou editar proposta, o sistema redireciona automaticamente para `/propostas`.

## 2026-07-09

- Título e descrição da proposta simulada limitados a 120 e 250 caracteres respectivamente para evitar erro de coluna muito longa no MySQL (`title` mapeado como `varchar(191)` por padrão).

## 2026-07-09

- Adicionado campo `requiresContract` (boolean) ao modelo `Proposal` no Prisma, com migration `20260709174039_add_requires_contract`.
- Formulários de criação (IA e manual) e edição de proposta possuem checkbox "Precisa de contrato".
- Quando marcado, a frase "ASSIM QUE A PROPOSTA FOR APROVADA DAREMOS INÍCIO AO CONTRATO." é incluída no final da proposta (seção Próximos Passos na IA, ou na landing page pública quando aprovada).
- Página de detalhe da proposta exibe "Contrato: Sim/Não" no resumo.

## 2026-07-09

- Página `/propostas` agora aceita filtro por status via query string (`?status=APPROVED`, `?status=SENT`, etc.) e exibe botões de filtro rápido (Todas, Rascunho, Enviada, Visualizada, Aprovada, Rejeitada, Paga, Expirada).
- Cards do dashboard que levam a status específicos agora funcionam corretamente.

## 2026-07-09

- Logo "PropoAI" no header do dashboard agora leva para `/dashboard` em vez de `/`, evitando redirecionamento para fora do sistema/logout acidental.

## 2026-07-09

- Projeto preparado para deploy gratuito na Vercel + Neon:
  - Schema Prisma migrado de MySQL para PostgreSQL.
  - `.env.example` atualizado com URL PostgreSQL.
  - `next.config.ts` configurado com `output: "standalone"` e `images.unoptimized: true`.
  - Criado `vercel.json` com build e root directory.
  - Adicionado `postinstall` em `apps/web/package.json` para gerar Prisma Client no deploy.
  - `packages/database/package.json` ajustado para gerar Prisma Client antes do build.
  - Criado `turbo.json` para orquestrar builds no monorepo.

## 2026-07-09

- Código subido para o repositório GitHub: https://github.com/cleciodivi/propoai.git
- Próximo passo: criar banco PostgreSQL no Neon e fazer deploy na Vercel.

---

# Instruções do Usuário

## 2026-07-09

- Sempre que o agente descobrir ou decidir algo novo sobre o projeto, em qualquer aspecto, deve atualizar o `agent_memory.md` automaticamente sem perguntar ao usuário.

---
