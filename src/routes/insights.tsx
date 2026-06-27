import { useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { TrendingUp, TrendingDown } from "lucide-react";


const bars = [42, 55, 38, 67, 71, 60, 84, 78, 92, 70, 88, 96];

function InsightsPage() {
  useEffect(() => { document.title = 'Insights — PayGPT'; }, []);
  const max = Math.max(...bars);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl">Financial insights</h1>
        <p className="mt-1 text-sm text-muted-foreground">A clear picture of where your money goes.</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric label="Revenue (MTD)" value="$42,910" delta="+12.4%" up />
          <Metric label="Expenses (MTD)" value="$28,140" delta="+4.1%" />
          <Metric label="Net margin" value="34.4%" delta="+2.3%" up />
        </div>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-sm text-muted-foreground">Revenue — last 12 months</div>
              <div className="mt-1 font-display text-3xl">$418,220</div>
            </div>
            <div className="text-xs text-muted-foreground">USD</div>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2">
            {bars.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/80 transition-all hover:bg-primary"
                style={{ height: `${(v / max) * 100}%` }}
                title={`$${v}k`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m) => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Breakdown title="Top expense categories" items={[
            ["Payroll", 62], ["Software", 14], ["Marketing", 11], ["Office", 8], ["Other", 5],
          ]} />
          <Breakdown title="Revenue by client" items={[
            ["Atlas Studio", 38], ["Verge Labs", 27], ["Mercer & Bell", 18], ["Field Goods", 11], ["Other", 6],
          ]} />
        </div>
      </div>
    </PageShell>
  );
}

function Metric({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl">{value}</div>
      <div className={`mt-1 inline-flex items-center gap-1 text-xs ${up ? "text-primary" : "text-muted-foreground"}`}>
        {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />} {delta}
      </div>
    </div>
  );
}

function Breakdown({ title, items }: { title: string; items: [string, number][] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map(([k, v]) => (
          <li key={k}>
            <div className="flex justify-between text-sm">
              <span>{k}</span>
              <span className="text-muted-foreground tabular-nums">{v}%</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${v}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsightsPage;
