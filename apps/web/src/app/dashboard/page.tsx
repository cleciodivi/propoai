import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@propoai/ui";
import { auth, signOut } from "@/auth";
import { prisma } from "@propoai/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  Users,
  FileText,
  Settings,
  LogOut,
  Mail,
  CheckCircle,
} from "lucide-react";

async function getDashboardStats(userId: string) {
  const [proposals, customers, approved, sent] = await Promise.all([
    prisma.proposal.count({ where: { userId } }),
    prisma.customer.count({ where: { userId } }),
    prisma.proposal.count({ where: { userId, status: "APPROVED" } }),
    prisma.proposal.count({ where: { userId, status: { in: ["SENT", "VIEWED"] } } }),
  ]);

  return { proposals, customers, approved, sent };
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const stats = await getDashboardStats(session.user.id);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text truncate">PropoAI</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="text-sm text-muted-foreground hidden sm:inline truncate max-w-[150px]">
              {session.user.name ?? session.user.email}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <Button variant="ghost" size="sm" type="submit" className="gap-2 px-2 sm:px-4">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui você gerencia suas propostas e clientes.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { label: "Propostas", value: stats.proposals, icon: FileText, href: "/propostas" },
            { label: "Clientes", value: stats.customers, icon: Users, href: "/clientes" },
            { label: "Aprovadas", value: stats.approved, icon: CheckCircle, href: "/propostas?status=APPROVED" },
            { label: "Enviadas", value: stats.sent, icon: Mail, href: "/propostas?status=SENT" },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {[
            {
              title: "Propostas",
              description: "Crie e envie propostas com IA.",
              href: "/propostas/nova",
              label: "Nova proposta",
              icon: FileText,
              iconClass: "bg-primary/10 text-primary",
            },
            {
              title: "Clientes",
              description: "Gerencie seus clientes.",
              href: "/clientes",
              label: "Ver clientes",
              icon: Users,
              iconClass: "bg-accent/10 text-accent",
            },
            {
              title: "Configurações",
              description: "Ajuste sua conta e integrações.",
              href: "/configuracoes",
              label: "Configurar",
              icon: Settings,
              iconClass: "bg-secondary text-secondary-foreground",
            },
          ].map((item) => (
            <Card key={item.title} className="group hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader className="flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconClass}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button variant="outline" asChild className="w-full">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
