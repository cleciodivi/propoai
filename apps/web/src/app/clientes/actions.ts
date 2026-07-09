"use server";

import { prisma } from "@propoai/database";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const customerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;

export async function getCustomers() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  return prisma.customer.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomer(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  return prisma.customer.findFirst({
    where: { id, userId: session.user.id },
  });
}

export async function createCustomer(data: CustomerFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const parsed = customerSchema.parse(data);

  await prisma.customer.create({
    data: {
      ...parsed,
      userId: session.user.id,
    },
  });

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateCustomer(id: string, data: CustomerFormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  const parsed = customerSchema.parse(data);

  const customer = await prisma.customer.updateMany({
    where: { id, userId: session.user.id },
    data: parsed,
  });

  if (customer.count === 0) {
    throw new Error("Cliente não encontrado");
  }

  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}/editar`);
  redirect("/clientes");
}

export async function deleteCustomer(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Não autenticado");
  }

  await prisma.customer.deleteMany({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/clientes");
}
