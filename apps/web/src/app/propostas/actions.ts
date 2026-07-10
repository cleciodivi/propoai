"use server";

import { prisma, type $Enums } from "@propoai/database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const proposalSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  value: z.coerce.number().nonnegative().optional(),
  expiresAt: z.coerce.date().optional(),
  requiresContract: z.coerce.boolean().default(false),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;

function generateSlug(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getProposals(status?: $Enums.ProposalStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  return prisma.proposal.findMany({
    where: { userId: session.user.id, ...(status ? { status } : {}) },
    include: { customer: true, _count: { select: { sections: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProposal(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  return prisma.proposal.findFirst({
    where: { id, userId: session.user.id },
    include: { customer: true, sections: { orderBy: { order: "asc" } } },
  });
}

export async function getProposalBySlug(slug: string) {
  return prisma.proposal.findUnique({
    where: { slug },
    include: { customer: true, user: { select: { name: true, email: true } }, sections: { orderBy: { order: "asc" } } },
  });
}

export async function createProposal(data: ProposalFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const parsed = proposalSchema.parse(data);

  await prisma.proposal.create({
    data: {
      ...parsed,
      value: parsed.value ? parsed.value : null,
      userId: session.user.id,
      slug: generateSlug(),
    },
  });

  revalidatePath("/propostas");
  redirect("/propostas");
}

export async function updateProposal(id: string, data: ProposalFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const parsed = proposalSchema.parse(data);

  await prisma.proposal.updateMany({
    where: { id, userId: session.user.id },
    data: {
      ...parsed,
      value: parsed.value ? parsed.value : null,
      expiresAt: parsed.expiresAt ?? null,
    },
  });

  revalidatePath("/propostas");
  revalidatePath(`/propostas/${id}`);
  revalidatePath(`/propostas/${id}/editar`);
  redirect("/propostas");
}

export async function updateProposalContract(id: string, requiresContract: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  await prisma.proposal.updateMany({
    where: { id, userId: session.user.id },
    data: { requiresContract },
  });

  revalidatePath("/propostas");
  revalidatePath(`/propostas/${id}`);
  revalidatePath(`/propostas/${id}/editar`);
}

export async function deleteProposal(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  await prisma.proposal.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/propostas");
  redirect("/propostas");
}

export async function updateProposalStatus(id: string, status: $Enums.ProposalStatus) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const updateData: { status: $Enums.ProposalStatus; approvedAt?: Date | null; paidAt?: Date | null } = { status };

  if (status === "APPROVED") {
    updateData.approvedAt = new Date();
  } else if (status === "PAID") {
    updateData.paidAt = new Date();
  } else if (status === "DRAFT" || status === "SENT" || status === "VIEWED" || status === "REJECTED" || status === "EXPIRED") {
    updateData.approvedAt = null;
    updateData.paidAt = null;
  }

  await prisma.proposal.updateMany({
    where: { id, userId: session.user.id },
    data: updateData,
  });

  revalidatePath("/propostas");
  revalidatePath(`/propostas/${id}`);
}

export async function approveProposalBySlug(slug: string) {
  const proposal = await prisma.proposal.findUnique({ where: { slug } });
  if (!proposal) {
    throw new Error("Proposta não encontrada");
  }

  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: "APPROVED", approvedAt: new Date() },
  });

  revalidatePath(`/p/${slug}`);
}

export async function rejectProposalBySlug(slug: string) {
  const proposal = await prisma.proposal.findUnique({ where: { slug } });
  if (!proposal) {
    throw new Error("Proposta não encontrada");
  }

  await prisma.proposal.update({
    where: { id: proposal.id },
    data: { status: "REJECTED", approvedAt: null, paidAt: null },
  });

  revalidatePath(`/p/${slug}`);
}

interface GenerateProposalInput {
  customerId: string;
  serviceDescription: string;
  value?: number;
  tone?: "formal" | "friendly" | "persuasive";
  requiresContract?: boolean;
}

function getToneStyle(tone: GenerateProposalInput["tone"]): {
  greeting: string;
  closing: string;
  benefitPhrase: string;
  urgencyPhrase: string;
} {
  switch (tone) {
    case "formal":
      return {
        greeting: "Prezado(a)",
        closing: "Atenciosamente",
        benefitPhrase: "Esta solução foi estruturada para atender às necessidades apresentadas com eficiência, qualidade e conformidade com os prazos estabelecidos.",
        urgencyPhrase: "Sugerimos a análise desta proposta no prazo de validade indicado, a fim de garantir a reserva da agenda e dos recursos necessários.",
      };
    case "friendly":
      return {
        greeting: "Olá",
        closing: "Um grande abraço",
        benefitPhrase: "Nossa proposta foi pensada para simplificar o seu dia a dia e entregar resultados de forma leve e transparente.",
        urgencyPhrase: "Ficaremos felizes em seguir assim que você aprovar. Qualquer dúvida, estamos por aqui!",
      };
    case "persuasive":
    default:
      return {
        greeting: "Olá",
        closing: "Vamos juntos",
        benefitPhrase: "Com esta solução, você reduz custos, ganha tempo e aumenta seus resultados de forma mensurável.",
        urgencyPhrase: "Aproveite esta oportunidade: aprovar agora garante condições especiais e prioridade na execução.",
      };
  }
}

function generateMockProposal(
  input: GenerateProposalInput,
  customer: { name: string; company?: string | null },
  userName?: string | null,
): { title: string; description: string; sections: { title: string; content: string }[] } {
  const companyText = customer.company ? ` — ${customer.company}` : "";
  const valueText = input.value ? `R$ ${input.value.toFixed(2)}` : "Sob consulta";
  const tone = getToneStyle(input.tone);
  const serviceShort = input.serviceDescription.slice(0, 80);
  const signatureName = userName?.trim() || "PropoAI";

  return {
    title: `Proposta Comercial${companyText} — ${serviceShort}`.slice(0, 120),
    description: `Apresentamos nossa proposta de ${serviceShort.toLowerCase()}${input.value ? ` com investimento de ${valueText}` : ""}.`.slice(0, 250),
    sections: [
      {
        title: "Apresentação",
        content: `<p>${tone.greeting} ${customer.name},</p><p>Agradecemos a oportunidade de apresentar esta proposta. Após entender seus objetivos, estruturamos uma solução de <strong>${input.serviceDescription}</strong> alinhada às suas expectativas.</p><p>${tone.benefitPhrase}</p>`,
      },
      {
        title: "Objetivo",
        content: `<p>O objetivo deste projeto é entregar <strong>${input.serviceDescription}</strong> com qualidade, dentro do prazo acordado e com total transparência em cada etapa.</p><p>Trabalhamos para que o resultado gere valor imediato para o seu negócio e possa ser mensurado de forma clara.</p>`,
      },
      {
        title: "Escopo Detalhado",
        content: `<p>Nosso trabalho contempla as seguintes entregas:</p><ul><li>Levantamento de requisitos e alinhamento estratégico;</li><li>Execução de <strong>${input.serviceDescription}</strong> conforme especificações combinadas;</li><li>Revisões periódicas para garantir qualidade e alinhamento;</li><li>Entrega final com documentação e suporte na implementação.</li></ul>`,
      },
      {
        title: "Investimento",
        content: `<p>O investimento para este projeto é:</p><p class="text-2xl font-bold text-primary my-2">${valueText}</p><p>Condições de pagamento podem ser negociadas conforme a necessidade do projeto. Entre em contato para discutir a melhor forma.</p>`,
      },
      {
        title: "Prazo de Execução",
        content: `<p>Após a aprovação da proposta, iniciamos o trabalho em até <strong>3 dias úteis</strong>.</p><p>O prazo total de entrega será confirmado após o alinhamento final do escopo, considerando a complexidade e as prioridades definidas.</p>`,
      },
      {
        title: "Próximos Passos",
        content: `<p>${tone.urgencyPhrase}</p><p>Para prosseguir, basta clicar em <strong>Aprovar proposta</strong>. Entraremos em contato em seguida para formalizar o início do trabalho.</p>${input.requiresContract ? `<p><strong>ASSIM QUE A PROPOSTA FOR APROVADA DAREMOS INÍCIO AO CONTRATO.</strong></p>` : ""}<p>${tone.closing},</p><p><strong>Equipe ${signatureName}</strong></p>`,
      },
    ],
  };
}

export async function generateProposalWithAi(input: GenerateProposalInput) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const customer = await prisma.customer.findFirst({
    where: { id: input.customerId, userId: session.user.id },
  });

  if (!customer) {
    throw new Error("Cliente não encontrado");
  }

  const apiKey = process.env.OPENAI_API_KEY;

  const toneMap: Record<string, string> = {
    formal: "formal e técnico",
    friendly: "amigável e próximo",
    persuasive: "persuasivo e comercial",
  };

  let parsed: { title: string; description?: string; sections: { title: string; content: string }[] };

  const userName = session.user.name ?? session.user.email ?? "PropoAI";

  if (!apiKey) {
    // Modo de desenvolvimento: gera proposta simulada sem consumir tokens da OpenAI
    parsed = generateMockProposal(input, customer, userName);
  } else {
    const prompt = `Você é um especialista em propostas comerciais. Crie uma proposta comercial em português do Brasil para o cliente "${customer.name}"${customer.company ? ` da empresa ${customer.company}` : ""}.

Serviço descrito pelo prestador:
"""
${input.serviceDescription}
"""

Tom de voz: ${toneMap[input.tone ?? "persuasive"]}
${input.value ? `Valor total sugerido: R$ ${input.value.toFixed(2)}` : ""}
Nome do prestador/remetente da proposta: ${userName}

Responda APENAS com um JSON válido no seguinte formato, sem explicações adicionais:
{
  "title": "Título da proposta",
  "description": "Resumo curto da proposta",
  "sections": [
    { "title": "Título da seção", "content": "Conteúdo da seção em HTML simples (p, ul, li, strong)" }
  ]
}

A proposta deve ter entre 4 e 6 seções, incluindo: introdução, escopo do serviço, investimento, prazos e próximos passos.

Na última seção (Próximos Passos), finalize com uma despedida seguida da assinatura: <p><strong>Equipe ${userName}</strong></p>.`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Erro na OpenAI: ${error}`);
    }

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content ?? "";

    try {
      parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
    } catch {
      throw new Error("Resposta da IA não é um JSON válido");
    }
  }

  await prisma.proposal.create({
    data: {
      userId: session.user.id,
      customerId: input.customerId,
      title: parsed.title.slice(0, 120),
      description: (parsed.description ?? input.serviceDescription).slice(0, 250),
      value: input.value ? input.value : null,
      slug: generateSlug(),
      status: "DRAFT",
      requiresContract: input.requiresContract ?? false,
      sections: {
        create: parsed.sections.map((section, index) => ({
          title: section.title,
          content: input.requiresContract && index === parsed.sections.length - 1
            ? `${section.content}<p><strong>ASSIM QUE A PROPOSTA FOR APROVADA DAREMOS INÍCIO AO CONTRATO.</strong></p><p><strong>Equipe ${userName}</strong></p>`
            : section.content,
          order: index,
          isAiGenerated: true,
        })),
      },
    },
    include: { sections: true },
  });

  revalidatePath("/propostas");
  redirect("/propostas");
}
