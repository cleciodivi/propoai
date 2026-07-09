# PropoAI

SaaS híbrido de **gestão de propostas comerciais com IA** + **gerador de landing pages de conversão**.

## Visão

PropoAI ajuda prestadores de serviço, agências e freelancers a criar propostas profissionais em minutos, gerar landing pages personalizadas para cada proposta e acompanhar aprovações e pagamentos em um só lugar.

## Funcionalidades do MVP

1. Autenticação (e-mail/senha + Google OAuth)
2. Dashboard do usuário
3. Cadastro de clientes
4. Criação de propostas com IA
5. Templates de proposta
6. Geração de landing page para cada proposta
7. Envio de proposta por link/e-mail
8. Aprovação/rejeição pelo cliente
9. Pagamento opcional via Stripe
10. Histórico e status de propostas
11. Notificações por e-mail

## Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend:** Next.js API Routes + tRPC
- **Banco de dados:** PostgreSQL
- **Cache/Fila:** Redis + BullMQ
- **Autenticação:** NextAuth.js
- **E-mail:** Resend
- **IA:** OpenAI API
- **Pagamentos:** Stripe
- **Containerização:** Docker + Docker Compose

## Estrutura

```
propoai/
├── apps/
│   └── web/                    # Next.js 15
├── packages/
│   ├── database/               # Prisma schema + migrations
│   ├── ui/                     # Componentes compartilhados
│   └── config/                 # Configurações compartilhadas
├── docker-compose.yml
├── README.md
└── agent_memory.md
```

## Requisitos

- Node.js 20+
- Docker + Docker Compose
- pnpm 9+

## Como executar

```bash
# 1. Subir banco de dados e Redis
docker compose up -d

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp apps/web/.env.example apps/web/.env.local
# Editar apps/web/.env.local com suas credenciais

# 4. Executar migrations
pnpm db:migrate

# 5. Semear dados iniciais (opcional)
pnpm db:seed

# 6. Iniciar aplicação
pnpm dev
```

Acesse: http://localhost:3000

## Variáveis de ambiente

Veja `apps/web/.env.example`.

## Licença

Proprietária — PropoAI.
