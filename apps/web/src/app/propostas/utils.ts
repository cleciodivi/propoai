import type { $Enums } from "@propoai/database";

export type ProposalStatus = $Enums.ProposalStatus;

export function formatCurrency(value: number | string | { toNumber(): number } | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

export function statusLabel(status: ProposalStatus): string {
  const labels: Record<ProposalStatus, string> = {
    DRAFT: "Rascunho",
    SENT: "Enviada",
    VIEWED: "Visualizada",
    APPROVED: "Aprovada",
    REJECTED: "Rejeitada",
    PAID: "Paga",
    EXPIRED: "Expirada",
  };
  return labels[status];
}

export function statusColor(status: ProposalStatus): string {
  const colors: Record<ProposalStatus, string> = {
    DRAFT: "bg-muted text-muted-foreground",
    SENT: "bg-blue-100 text-blue-700",
    VIEWED: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    PAID: "bg-purple-100 text-purple-700",
    EXPIRED: "bg-gray-100 text-gray-700",
  };
  return colors[status];
}
