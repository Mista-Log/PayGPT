import { useEffect, useState, type FormEvent } from "react";
import { PageShell } from "@/components/page-shell";
import { Plus, Search, X, Trash2 } from "lucide-react";
import { getInvoices } from "@/api/invoices";


type Row = { id: string; client: string; amount: number; status: string; due: string };

const initialRows: Row[] = [
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

type LineItem = { description: string; quantity: number; price: number };

function InvoicesPage() {

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    document.title = "Invoices — PayGPT";

    const fetchInvoices = async () => {
      try {
        setLoading(true);

        const invoices = await getInvoices();

        const formattedRows = invoices.map((invoice: any) => ({
          id: invoice.id,
          client: invoice.customer_name,
          amount: invoice.amount,
          status: invoice.status,
          due: new Date(invoice.due_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        }));

        setRows(formattedRows);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);
  // const [rows, setRows] = useState<Row[]>(initialRows);
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <PageShell>
        <div className="p-10 text-center">
          Loading invoices...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl">Invoices</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create, send, and track every invoice.</p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
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
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No invoices found.
                  </td>
                </tr>
              ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">{r.id}</td>
                  <td className="px-4 py-3">{r.client}</td>
                  <td className="px-4 py-3 tabular-nums">${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${statusTone[r.status]}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.due}</td>
                </tr>
                  ))
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <NewInvoiceDialog
          onClose={() => setOpen(false)}
          onCreate={(row) => {
            setRows((prev) => [row, ...prev]);
            setOpen(false);
          }}
          nextId={`INV-${String(242 + (rows.length - initialRows.length)).padStart(4, "0")}`}
        />
      )}
    </PageShell>
  );
}

function NewInvoiceDialog({
  onClose,
  onCreate,
  nextId,
}: {
  onClose: () => void;
  onCreate: (row: Row) => void;
  nextId: string;
}) {




  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<"Draft" | "Sent">("Draft");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, price: 0 }]);

  const total = items.reduce((s, it) => s + it.quantity * it.price, 0);

  const updateItem = (i: number, patch: Partial<LineItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const due = dueDate
      ? new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      : "—";
    onCreate({
      id: nextId,
      client: client || "Untitled client",
      amount: Math.round(total),
      status,
      due,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-2xl">New invoice</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">{nextId}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client name">
                <input
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="Acme Inc."
                  className="input"
                />
              </Field>
              <Field label="Client email">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="billing@acme.com"
                  className="input"
                />
              </Field>
              <Field label="Due date">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="Status">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Draft" | "Sent")}
                  className="input"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                </select>
              </Field>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Line items
                </label>
                <button
                  type="button"
                  onClick={() => setItems((p) => [...p, { description: "", quantity: 1, price: 0 }])}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:opacity-80"
                >
                  <Plus className="h-3 w-3" /> Add item
                </button>
              </div>
              <div className="space-y-2">
                {items.map((it, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2">
                    <input
                      placeholder="Description"
                      value={it.description}
                      onChange={(e) => updateItem(i, { description: e.target.value })}
                      className="input col-span-6"
                    />
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })}
                      className="input col-span-2"
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={it.price}
                      onChange={(e) => updateItem(i, { price: Number(e.target.value) })}
                      placeholder="Price"
                      className="input col-span-3"
                    />
                    <button
                      type="button"
                      onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                      disabled={items.length === 1}
                      className="col-span-1 grid place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-30"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Field label="Notes">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Payment terms, thank-you note…"
                className="input resize-none"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-4">
            <div className="text-sm">
              <span className="text-muted-foreground">Total</span>{" "}
              <span className="ml-2 font-display text-2xl tabular-nums">
                ${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Create invoice
              </button>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid hsl(var(--border));
          background: hsl(var(--background));
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
        }
        .input:focus {
          border-color: hsl(var(--primary));
          box-shadow: 0 0 0 3px hsl(var(--primary) / 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "destructive" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 font-display text-3xl ${tone === "destructive" ? "text-destructive" : "text-foreground"}`}>
        {value}
      </div>
    </div>
  );
}

export default InvoicesPage;
