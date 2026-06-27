import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/page-shell";
import { Check } from "lucide-react";


const plans = [
  {
    name: "Personal",
    price: "$0",
    sub: "Free forever",
    features: ["Up to 5 invoices/mo", "1 connected account", "Basic insights", "Email support"],
    cta: "Get started",
  },
  {
    name: "Business",
    price: "$29",
    sub: "per user / month",
    featured: true,
    features: ["Unlimited invoices", "Multiple accounts", "Scheduled payments", "Priority support", "Insights & exports"],
    cta: "Start 30-day trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    sub: "Tailored to your team",
    features: ["SSO & audit logs", "Custom workflows", "Dedicated success manager", "SLA & compliance review"],
    cta: "Contact sales",
  },
];

function PricingPage() {
  useEffect(() => { document.title = 'Pricing — PayGPT'; }, []);
  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h1 className="text-5xl">Simple pricing.</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Start free. Upgrade when you're ready. Cancel any time.
        </p>

        <div className="mt-12 grid gap-6 text-left md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-7 ${p.featured ? "border-primary bg-card ring-1 ring-primary" : "border-border bg-card"}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl">{p.name}</h3>
                {p.featured && <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Popular</span>}
              </div>
              <div className="mt-6">
                <span className="font-display text-5xl">{p.price}</span>
                <div className="mt-1 text-sm text-muted-foreground">{p.sub}</div>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`mt-8 inline-flex w-full justify-center rounded-md px-4 py-2.5 text-sm font-medium ${
                  p.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

export default PricingPage;
