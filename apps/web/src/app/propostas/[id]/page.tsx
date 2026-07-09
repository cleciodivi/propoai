import { prisma } from "@propoai/database";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@propoai/ui";
import { getProposal, updateProposalStatus } from "../actions";
import { getCustomers } from "@/app/clientes/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate, statusLabel, statusColor } from "../utils";

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const [proposal, customers] = await Promise.all([getProposal(id), getCustomers()]);

  if (!proposal) {
    notFound();
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/p/${proposal.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">PropoAI</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/propostas" className="text-muted-foreground hover:text-foreground">Propostas</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground truncate max-w-[200px]">{proposal.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/propostas/${proposal.id}/editar`}>Editar</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/p/${proposal.slug}`} target="_blank">Abrir pública</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{proposal.title}</CardTitle>
                    <CardDescription>
                      Para: {proposal.customer.name} • {proposal.customer.email}
                    </CardDescription>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(proposal.status)}`}>
                    {statusLabel(proposal.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {proposal.description && (
                  <p className="text-muted-foreground">{proposal.description}</p>
                )}

                {proposal.sections.length === 0 ? (
                  <p className="text-muted-foreground">Nenhuma seção adicionada.</p>
                ) : (
                  <div className="space-y-6">
                    {proposal.sections.map((section) => (
                      <div key={section.id}>
                        <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                        <div
                          className="prose prose-sm max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="font-medium">{formatCurrency(proposal.value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expira em:</span>
                  <span className="font-medium">{formatDate(proposal.expiresAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Criada em:</span>
                  <span className="font-medium">{formatDate(proposal.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contrato:</span>
                  <span className="font-medium">{proposal.requiresContract ? "Sim" : "Não"}</span>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Link público:</p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={publicUrl}
                      className="flex-1 text-xs rounded-md border border-input bg-muted px-2 py-1"
                    />
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`mailto:?subject=${encodeURIComponent(proposal.title)}&body=${encodeURIComponent(publicUrl)}`}>
                        E-mail
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(["DRAFT", "SENT", "VIEWED", "APPROVED", "REJECTED", "PAID", "EXPIRED"] as const).map((status) => (
                  <form
                    key={status}
                    action={async () => {
                      "use server";
                      await updateProposalStatus(proposal.id, status);
                    }}
                  >
                    <Button
                      variant={proposal.status === status ? "default" : "outline"}
                      size="sm"
                      type="submit"
                      className="w-full justify-start"
                    >
                      {statusLabel(status)}
                    </Button>
                  </form>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
