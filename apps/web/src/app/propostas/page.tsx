import { prisma, type $Enums } from "@propoai/database";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@propoai/ui";
import { getProposals, deleteProposal } from "./actions";
import Link from "next/link";
import { formatCurrency, formatDate, statusLabel, statusColor } from "./utils";

interface ProposalsPageProps {
  searchParams: Promise<{ status?: string }>;
}

const validStatuses: $Enums.ProposalStatus[] = ["DRAFT", "SENT", "VIEWED", "APPROVED", "REJECTED", "PAID", "EXPIRED"];

export default async function ProposalsPage({ searchParams }: ProposalsPageProps) {
  const { status } = await searchParams;
  const filteredStatus = validStatuses.find((s) => s === status);
  const proposals: Awaited<ReturnType<typeof prisma.proposal.findMany<{ include: { customer: true } }>>> = await getProposals(filteredStatus);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">PropoAI</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Propostas</span>
          </div>
          <Button asChild>
            <Link href="/propostas/nova">Nova proposta</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold">{filteredStatus ? statusLabel(filteredStatus) : "Todas as propostas"}</h2>
              <p className="text-muted-foreground">Crie, envie e acompanhe suas propostas comerciais.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={filteredStatus ? "outline" : "default"} size="sm" asChild>
                <Link href="/propostas">Todas</Link>
              </Button>
              {validStatuses.map((s) => (
                <Button key={s} variant={filteredStatus === s ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/propostas?status=${s}`}>{statusLabel(s)}</Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {proposals.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhuma proposta criada</CardTitle>
              <CardDescription>
                Crie sua primeira proposta manualmente ou com ajuda da IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button asChild>
                <Link href="/propostas/nova">Criar proposta</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {proposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{proposal.title}</CardTitle>
                      <CardDescription>
                        {proposal.customer.name} • {proposal.customer.email}
                        {proposal.value !== null && ` • ${formatCurrency(proposal.value)}`}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(proposal.status)}`}>
                      {statusLabel(proposal.status)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/propostas/${proposal.id}`}>Visualizar</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/propostas/${proposal.id}/editar`}>Editar</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/p/${proposal.slug}`} target="_blank">Link público</Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await deleteProposal(proposal.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      Excluir
                    </Button>
                  </form>
                  {proposal.expiresAt && (
                    <span className="text-sm text-muted-foreground ml-auto">
                      Expira em {formatDate(proposal.expiresAt)}
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
