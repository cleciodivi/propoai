import Link from "next/link";
import { Button } from "@propoai/ui";
import { Sparkles, FileText, Zap, TrendingUp, Mail, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text">PropoAI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild className="shadow-lg shadow-primary/25">
              <Link href="/register">Criar conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="relative overflow-hidden py-20 md:py-32 hero-gradient">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Propostas comerciais impulsionadas por IA
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Crie propostas que
              <br />
              <span className="gradient-text">convertem em minutos</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
              Gere propostas profissionais com IA, crie landing pages
              personalizadas para cada cliente e acompanhe aprovações e
              pagamentos em um só lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-primary/25" asChild>
                <Link href="/register">Começar grátis</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg" asChild>
                <Link href="/login">Entrar na plataforma</Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: FileText, label: "Propostas IA" },
                { icon: Zap, label: "Landing Pages" },
                { icon: Mail, label: "Envio por E-mail" },
                { icon: TrendingUp, label: "Analytics" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" />
        </section>

        <section className="py-20 gradient-bg">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">
                Como funciona
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Três passos simples para fechar mais negócios
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  step: "01",
                  title: "Descreva o serviço",
                  description:
                    "Conte para a IA o que você vai fazer. Ela cria uma proposta completa e profissional em segundos.",
                },
                {
                  step: "02",
                  title: "Personalize e envie",
                  description:
                    "Ajuste valores, prazos e seções. Envie por e-mail uma landing page exclusiva para seu cliente.",
                },
                {
                  step: "03",
                  title: "Acompanhe e converta",
                  description:
                    "Receba notificações quando o cliente visualizar, aprovar e pagar. Tudo em tempo real.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative p-8 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="text-5xl font-bold text-primary/20 absolute top-6 right-6">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary to-accent p-1">
              <div className="rounded-[calc(1.5rem-1px)] bg-card p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pronto para vender mais?
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Junte-se a profissionais que transformam propostas em
                  experiências de conversão.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="h-14 px-8 text-lg" asChild>
                    <Link href="/register">Criar conta grátis</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg"
                    asChild
                  >
                    <Link href="/login">Já tenho conta</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2026 PropoAI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
