import { useEffect } from "react";
import { PageShell } from "@/components/page-shell";
import { useState } from "react";


const sections = [
  {
    id: "intro",
    title: "Introduction",
    body: (
      <>
        <p>
          PayGPT is an AI-powered banking assistant that helps small businesses and individuals manage
          payments, invoices, and financial insights through natural-language conversations.
        </p>
        <p>
          This documentation covers everything you need to use PayGPT — from your first message to
          building automated workflows.
        </p>
      </>
    ),
  },
  {
    id: "getting-started",
    title: "Getting started",
    body: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>Create an account at <code>/signup</code>.</li>
        <li>Verify your email and complete the business profile.</li>
        <li>Connect at least one bank account or card.</li>
        <li>Open the Assistant and try: <em>"Show my balance"</em>.</li>
      </ol>
    ),
  },
  {
    id: "chat",
    title: "Using the assistant",
    body: (
      <>
        <p>The assistant understands plain English. Examples:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li><em>"Send $500 to John for design work."</em></li>
          <li><em>"Draft an invoice to Atlas Studio for 10 hours at $120/hr."</em></li>
          <li><em>"How much did we spend on software last month?"</em></li>
        </ul>
        <p>
          Every action that moves money requires explicit confirmation. PayGPT shows a preview before
          executing.
        </p>
      </>
    ),
  },
  {
    id: "invoices",
    title: "Invoices",
    body: (
      <>
        <p>
          Create, send, and track invoices from the <code>/invoices</code> page or directly through chat.
          Invoices support recurring schedules, multi-currency, and automatic reminders.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    body: (
      <>
        <p>
          Move money between connected accounts, pay vendors, or schedule recurring payments. PayGPT
          shows live balances and a full audit log of every transaction.
        </p>
      </>
    ),
  },
  {
    id: "api",
    title: "API & integrations",
    body: (
      <>
        <p>The PayGPT REST API lets you embed banking actions into your own product.</p>
        <pre className="overflow-x-auto rounded-lg bg-foreground/95 p-4 text-xs text-background">
{`POST /v1/payments
Authorization: Bearer <token>

{
  "to": "acct_123",
  "amount": 5000,
  "currency": "USD",
  "memo": "June rent"
}`}
        </pre>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: (
      <p>
        PayGPT uses end-to-end encryption, OAuth-based bank connections via regulated providers, and a
        confirm-before-send model on every monetary action. We are SOC 2 Type II in progress.
      </p>
    ),
  },
  {
    id: "support",
    title: "Support",
    body: (
      <p>
        Reach our team at <a className="text-primary underline" href="mailto:hello@paygpt.app">hello@paygpt.app</a>.
        Business and Enterprise plans get priority response within 4 business hours.
      </p>
    ),
  },
];

function DocsPage() {
  useEffect(() => { document.title = 'Documentation — PayGPT'; }, []);
  const [active, setActive] = useState(sections[0].id);
  const current = sections.find((s) => s.id === active) ?? sections[0];

  return (
    <PageShell>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-20 md:self-start">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">Documentation</h2>
          <nav className="mt-4 flex flex-col gap-1 text-sm">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`rounded-md px-3 py-1.5 text-left transition-colors ${
                  active === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        <article className="prose prose-neutral max-w-none">
          <h1 className="text-4xl">{current.title}</h1>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-foreground/90">
            {current.body}
          </div>
        </article>
      </div>
    </PageShell>
  );
}

export default DocsPage;
