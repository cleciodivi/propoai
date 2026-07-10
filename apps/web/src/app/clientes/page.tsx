import { prisma } from "@propoai/database";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@propoai/ui";
import { getCustomers, deleteCustomer } from "./actions";
import Link from "next/link";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-xl font-bold">PropoAI</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-muted-foreground">Clientes</span>
          </div>
          <Button asChild>
            <Link href="/clientes/novo">Novo cliente</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Clientes</h2>
          <p className="text-muted-foreground">Gerencie seus clientes e use-os nas propostas.</p>
        </div>

        {customers.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Nenhum cliente cadastrado</CardTitle>
              <CardDescription>
                Comece cadastrando seu primeiro cliente para criar propostas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/clientes/novo">Cadastrar cliente</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle>{customer.name}</CardTitle>
                  <CardDescription>
                    {customer.email}
                    {customer.company && ` • ${customer.company}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/clientes/${customer.id}/editar`}>Editar</Link>
                  </Button>
                  <form
                    action={async () => {
                      "use server";
                      await deleteCustomer(customer.id);
                    }}
                  >
                    <Button variant="destructive" size="sm" type="submit">
                      Excluir
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
