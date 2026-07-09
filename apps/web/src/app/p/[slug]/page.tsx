import { prisma } from "@propoai/database";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@propoai/ui";
import { getProposalBySlug, approveProposalBySlug, rejectProposalBySlug } from "@/app/propostas/actions";
import { formatCurrency, formatDate, statusLabel, statusColor } from "@/app/propostas/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, CheckCircle, XCircle, Mail } from "lucide-react";

interface PublicProposalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicProposalPage({ params }: PublicProposalPageProps) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);

  if (!proposal) {
    notFound();
  }

  const isActionable = proposal.status === "DRAFT" || proposal.status === "SENT" || proposal.status === "VIEWED";
  const isExpired = proposal.expiresAt && new Date(proposal.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">PropoAI</span>
          </div>
          <span className="text-sm text-muted-foreground">Proposta comercial</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-accent" />
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Enviada por {proposal.user.name ?? proposal.user.email ?? "PropoAI"}
                  </p>
                  <CardTitle className="text-3xl">{proposal.title}</CardTitle>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium self-start ${statusColor(proposal.status)}`}>
                  {statusLabel(proposal.status)}
                </span>
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {proposal.description && (
                <p className="text-lg text-muted-foreground">{proposal.description}</p>
              )}

              <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{proposal.customer.name}</p>
                  {proposal.customer.company && <p className="text-sm text-muted-foreground">{proposal.customer.company}</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Investimento</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(proposal.value)}</p>
                </div>
                {proposal.expiresAt && (
                  <div className="sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Válida até {formatDate(proposal.expiresAt)}
                      {isExpired && <span className="text-destructive ml-2">(Expirada)</span>}
                    </p>
                  </div>
                )}
              </div>

              {proposal.sections.length > 0 && (
                <div className="space-y-8">
                  {proposal.sections.map((section) => (
                    <div key={section.id}>
                      <h3 className="text-xl font-semibold mb-3">{section.title}</h3>
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {isActionable && !isExpired && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <form
                    action={async () => {
                      "use server";
                      await approveProposalBySlug(slug);
                    }}
                    className="flex-1"
                  >
                    <Button type="submit" size="lg" className="w-full gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Aprovar proposta
                    </Button>
                  </form>
                  <form
                    action={async () => {
                      "use server";
                      await rejectProposalBySlug(slug);
                    }}
                    className="flex-1"
                  >
                    <Button type="submit" variant="outline" size="lg" className="w-full gap-2">
                      <XCircle className="w-5 h-5" />
                      Rejeitar proposta
                    </Button>
                  </form>
                </div>
              )}

              {proposal.status === "APPROVED" && (
                <div className="p-6 rounded-xl bg-green-50 text-center">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-green-800">Proposta aprovada!</h3>
                  <p className="text-green-700">
                    Aprovada em {formatDate(proposal.approvedAt)}. Entraremos em contato para os próximos passos.
                  </p>
                  {proposal.requiresContract && (
                    <p className="text-green-800 font-semibold mt-2">
                      ASSIM QUE A PROPOSTA FOR APROVADA DAREMOS INÍCIO AO CONTRATO.
                    </p>
                  )}
                </div>
              )}

              {proposal.status === "REJECTED" && (
                <div className="p-6 rounded-xl bg-red-50 text-center">
                  <XCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-red-800">Proposta rejeitada</h3>
                  <p className="text-red-700">Agradecemos seu retorno. Entre em contato caso queira revisar a proposta.</p>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button variant="ghost" size="sm" asChild className="gap-2">
                  <Link href={`mailto:${proposal.user.email ?? ""}`}>
                    <Mail className="w-4 h-4" />
                    Falar com {proposal.user.name ?? "o remetente"}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            © 2026 PropoAI. Proposta gerada digitalmente.
          </p>
        </div>
      </main>
    </div>
  );
}
