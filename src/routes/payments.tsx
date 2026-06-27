import { useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { ArrowDownLeft, ArrowUpRight, Plus } from "lucide-react";


const tx = [
  { id: 1, name: "Payroll — June", date: "Jun 25", amount: -18_400, kind: "out" },
  { id: 2, name: "Mercer & Bell", date: "Jun 24", amount: 2500, kind: "in" },
  { id: 3, name: "AWS", date: "Jun 22", amount: -842.31, kind: "out" },
  { id: 4, name: "Atlas Studio", date: "Jun 21", amount: 4250, kind: "in" },
  { id: 5, name: "Office rent", date: "Jun 01", amount: -3200, kind: "out" },
];

function PaymentsPage() {
  useEffect(() => { document.title = 'Payments — PayGPT'; }, []);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl">Payments</h1>
            <p className="mt-1 text-sm text-muted-foreground">Move money in and out of your accounts.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            <Plus className="h-4 w-4" /> New transfer
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Account name="Operating" number="•••• 4521" balance="$182,430.18" />
          <Account name="Savings" number="•••• 7790" balance="$54,000.00" />
          <Account name="Tax reserve" number="•••• 0021" balance="$26,140.55" />
        </div>

        <div className="mt-10">
          <h2 className="text-2xl">Recent activity</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
            <ul className="divide-y divide-border">
              {tx.map((t) => (
                <li key={t.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 place-items-center rounded-full ${t.kind === "in" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {t.kind === "in" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.date}</div>
                    </div>
                  </div>
                  <div className={`tabular-nums text-sm font-medium ${t.amount > 0 ? "text-primary" : "text-foreground"}`}>
                    {t.amount > 0 ? "+" : ""}${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function Account({ name, number, balance }: { name: string; number: string; balance: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{number}</div>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Active</span>
      </div>
      <div className="mt-4 font-display text-3xl tabular-nums">{balance}</div>
    </div>
  );
}

export default PaymentsPage;
