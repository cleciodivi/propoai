import { prisma } from "@propoai/database";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@propoai/ui";
import { getCustomers } from "@/app/clientes/actions";
import { createProposal, generateProposalWithAi } from "../actions";
import Link from "next/link";

export default async function NewProposalPage() {
  const customers: Awaited<ReturnType<typeof prisma.customer.findMany>> = await getCustomers();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">PropoAI</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/propostas" className="text-muted-foreground hover:text-foreground">Propostas</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Nova</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Criar com IA ✨</CardTitle>
              <CardDescription>
                Descreva o serviço e deixe a IA gerar uma proposta profissional.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData) => {
                  "use server";
                  await generateProposalWithAi({
                    customerId: formData.get("customerId") as string,
                    serviceDescription: formData.get("serviceDescription") as string,
                    value: Number(formData.get("value")) || undefined,
                    tone: (formData.get("tone") as "formal" | "friendly" | "persuasive") || "persuasive",
                    requiresContract: formData.get("requiresContract") === "true",
                  });
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="aiCustomerId">Cliente *</Label>
                  <select
                    id="aiCustomerId"
                    name="customerId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.company && `(${customer.company})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceDescription">Descrição do serviço *</Label>
                  <textarea
                    id="serviceDescription"
                    name="serviceDescription"
                    rows={6}
                    required
                    placeholder="Ex: Criação de identidade visual completa, incluindo logo, paleta de cores, tipografia e aplicações em redes sociais."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aiValue">Valor sugerido (R$)</Label>
                  <Input id="aiValue" name="value" type="number" min={0} step={0.01} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Tom de voz</Label>
                  <select
                    id="tone"
                    name="tone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="persuasive">Persuasivo</option>
                    <option value="formal">Formal</option>
                    <option value="friendly">Amigável</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="aiRequiresContract"
                    name="requiresContract"
                    type="checkbox"
                    value="true"
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  />
                  <Label htmlFor="aiRequiresContract" className="font-normal cursor-pointer">
                    Precisa de contrato
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit">Gerar com IA</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Criar manualmente</CardTitle>
              <CardDescription>
                Monte a proposta do seu jeito.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                action={async (formData) => {
                  "use server";
                  await createProposal({
                    customerId: formData.get("customerId") as string,
                    title: formData.get("title") as string,
                    description: (formData.get("description") as string) || undefined,
                    value: Number(formData.get("value")) || undefined,
                    expiresAt: (formData.get("expiresAt") as string) || undefined,
                  } as unknown as Parameters<typeof createProposal>[0]);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="manualCustomerId">Cliente *</Label>
                  <select
                    id="manualCustomerId"
                    name="customerId"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.company && `(${customer.company})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" name="title" type="text" required minLength={3} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição/resumo</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Valor (R$)</Label>
                  <Input id="value" name="value" type="number" min={0} step={0.01} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiresAt">Data de expiração</Label>
                  <Input id="expiresAt" name="expiresAt" type="date" />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="manualRequiresContract"
                    name="requiresContract"
                    type="checkbox"
                    value="true"
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
                  />
                  <Label htmlFor="manualRequiresContract" className="font-normal cursor-pointer">
                    Precisa de contrato
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit">Criar proposta</Button>
                  <Button variant="outline" asChild>
                    <Link href="/propostas">Cancelar</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
