import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label } from "@propoai/ui";
import { getCustomer, updateCustomer } from "../../actions";
import Link from "next/link";
import { notFound } from "next/navigation";

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCustomerPage({ params }: EditCustomerPageProps) {
  const { id } = await params;
  const customer = await getCustomer(id);

  if (!customer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">PropoAI</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/clientes" className="text-muted-foreground hover:text-foreground">Clientes</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Editar</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Editar cliente</CardTitle>
            <CardDescription>Atualize os dados do cliente.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={async (formData) => {
                "use server";
                await updateCustomer(id, {
                  name: formData.get("name") as string,
                  email: formData.get("email") as string,
                  phone: (formData.get("phone") as string) || undefined,
                  company: (formData.get("company") as string) || undefined,
                  notes: (formData.get("notes") as string) || undefined,
                });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  defaultValue={customer.name}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={customer.email}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={customer.phone ?? ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" name="company" type="text" defaultValue={customer.company ?? ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  defaultValue={customer.notes ?? ""}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit">Atualizar cliente</Button>
                <Button variant="outline" asChild>
                  <Link href="/clientes">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
