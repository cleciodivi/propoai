import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@propoai/ui";
import { signIn, hashPassword } from "@/auth";
import { prisma } from "@propoai/database";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="flex-1 flex items-center justify-center p-8 hero-gradient">
        <div className="max-w-md w-full">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para home
          </Link>

          <Card className="border-0 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Criar conta no PropoAI</CardTitle>
                <CardDescription>
                  Comece a criar propostas profissionais com IA.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                action={async (formData) => {
                  "use server";
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string;
                  const password = formData.get("password") as string;

                  const existing = await prisma.user.findUnique({
                    where: { email },
                  });

                  if (existing) {
                    throw new Error("E-mail já cadastrado.");
                  }

                  await prisma.user.create({
                    data: {
                      name,
                      email,
                      password: await hashPassword(password),
                    },
                  });

                  await signIn("credentials", {
                    email,
                    password,
                    redirectTo: "/dashboard",
                  });

                  redirect("/dashboard");
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" type="text" required placeholder="Seu nome" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" required minLength={6} placeholder="Mínimo 6 caracteres" />
                </div>
                <Button type="submit" className="w-full h-11">
                  Criar conta
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Já tem conta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-gradient-to-br from-accent to-primary items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-4">Comece a vender mais</h2>
          <p className="text-xl text-white/80">
            Crie sua conta gratuita e descubra como a IA pode transformar suas
            propostas comerciais em experiências de conversão.
          </p>
        </div>
      </div>
    </div>
  );
}
