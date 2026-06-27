import { useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { Plus, Search } from "lucide-react";


const rows = [
  { id: "INV-0241", client: "Atlas Studio", amount: 4250, status: "Sent", due: "Jul 11" },
  { id: "INV-0240", client: "Mercer & Bell", amount: 2500, status: "Paid", due: "Jun 28" },
  { id: "INV-0239", client: "Field Goods", amount: 980, status: "Overdue", due: "Jun 14" },
  { id: "INV-0238", client: "Verge Labs", amount: 12_400, status: "Draft", due: "—" },
  { id: "INV-0237", client: "Lumen Press", amount: 760, status: "Paid", due: "Jun 02" },
];

const statusTone: Record<string, string> = {
  Paid: "bg-primary/10 text-primary",
  Sent: "bg-accent text-accent-foreground",
  Overdue: "bg-destructive/10 text-destructive",
  Draft: "bg-muted text-muted-foreground",
};

function InvoicesPage() {
  useEffect(() => { document.title = 'Invoices — PayGPT'; }, []);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl">Invoices</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create, send, and track every invoice.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New invoice
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Outstanding" value="$18,640" />
          <Stat label="Paid this month" value="$32,910" />
          <Stat label="Overdue" value="$980" tone="destructive" />
        </div>

        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search invoices, clients…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Invoice</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{r.id}</td>
                  <td className="px-4 py-3">{r.client}</td>
                  <td className="px-4 py-3 tabular-nums">${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusTone[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "destructive" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-3xl ${tone === "destructive" ? "text-destructive" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

export default InvoicesPage;
