import { prisma } from "@propoai/database";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@propoai/ui";
import { getProposal, updateProposal } from "../../actions";
import { getCustomers } from "@/app/clientes/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProposalPage({ params }: EditProposalPageProps) {
  const { id } = await params;
  const [proposal, customers]: [Awaited<ReturnType<typeof getProposal>>, Awaited<ReturnType<typeof prisma.customer.findMany>>] = await Promise.all([getProposal(id), getCustomers()]);

  if (!proposal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">PropoAI</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/propostas" className="text-muted-foreground hover:text-foreground">Propostas</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Editar</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Editar proposta</CardTitle>
            <CardDescription>Atualize os dados da proposta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData) => {
                "use server";
                await updateProposal(id, {
                  customerId: formData.get("customerId") as string,
                  title: formData.get("title") as string,
                  description: (formData.get("description") as string) || undefined,
                  value: Number(formData.get("value")) || undefined,
                  expiresAt: (formData.get("expiresAt") as string) || undefined,
                  requiresContract: formData.get("requiresContract") === "true",
                } as unknown as Parameters<typeof updateProposal>[1]);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="customerId">Cliente *</Label>
                <select
                  id="customerId"
                  name="customerId"
                  required
                  defaultValue={proposal.customerId}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} {customer.company && `(${customer.company})`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input id="title" name="title" type="text" required minLength={3} defaultValue={proposal.title} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição/resumo</Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={proposal.description ?? ""}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor (R$)</Label>
                <Input
                  id="value"
                  name="value"
                  type="number"
                  min={0}
                  step={0.01}
                  defaultValue={proposal.value ? Number(proposal.value) : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Data de expiração</Label>
                <Input
                  id="expiresAt"
                  name="expiresAt"
                  type="date"
                  defaultValue={proposal.expiresAt ? new Date(proposal.expiresAt).toISOString().split("T")[0] : ""}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="requiresContract"
                  name="requiresContract"
                  type="checkbox"
                  value="true"
                  defaultChecked={proposal.requiresContract}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                />
                <Label htmlFor="requiresContract" className="font-normal cursor-pointer">
                  Precisa de contrato
                </Label>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">Salvar alterações</Button>
                <Button variant="outline" asChild>
                  <Link href={`/propostas/${proposal.id}`}>Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
