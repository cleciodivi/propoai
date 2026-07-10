import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@propoai/ui";
import { signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import { AuthError } from "next-auth";

function getErrorMessage(error: string | undefined) {
  if (!error) return null;
  switch (error) {
    case "CredentialsSignin":
      return "E-mail ou senha inválidos.";
    case "OAuthAccountNotLinked":
      return "Esta conta do Google não está vinculada a um usuário.";
    case "OAuthSignin":
    case "OAuthCallback":
      return "Erro ao autenticar com Google. Tente novamente.";
    default:
      return "Ocorreu um erro ao fazer login. Tente novamente.";
  }
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }> | { error?: string };
}) {
  const params = searchParams instanceof Promise ? null : searchParams;
  const errorMessage = getErrorMessage(params?.error);

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
                <CardTitle className="text-2xl">Entrar no PropoAI</CardTitle>
                <CardDescription>
                  Faça login para gerenciar suas propostas e landing pages.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
                  {errorMessage}
                </div>
              )}
              <form
                action={async (formData) => {
                  "use server";
                  try {
                    await signIn("credentials", {
                      email: formData.get("email") as string,
                      password: formData.get("password") as string,
                      redirectTo: "/dashboard",
                    });
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`/login?error=${error.type}`);
                    }
                    throw error;
                  }
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" name="email" type="email" required placeholder="seu@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input id="password" name="password" type="password" required placeholder="••••••" />
                </div>
                <Button type="submit" className="w-full h-11">
                  Entrar com e-mail
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <form
                action={async () => {
                  "use server";
                  try {
                    await signIn("google", { redirectTo: "/dashboard" });
                  } catch (error) {
                    if (error instanceof AuthError) {
                      return redirect(`/login?error=${error.type}`);
                    }
                    throw error;
                  }
                }}
              >
                <Button variant="outline" type="submit" className="w-full h-11">
                  Entrar com Google
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Ainda não tem conta?{" "}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Criar conta
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-gradient-to-br from-primary to-accent items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-4">
            Bem-vindo de volta
          </h2>
          <p className="text-xl text-white/80">
            Continue criando propostas incríveis e convertendo mais clientes com
            o poder da IA.
          </p>
        </div>
      </div>
    </div>
  );
}
