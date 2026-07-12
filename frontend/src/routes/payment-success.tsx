import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/page-shell";
import { CheckCircle2, Download, Copy, ArrowRight, Check } from "lucide-react";
const details = {
  invoice: "Website Development",
  customer: "Dangote Ventures",
  amount: "₦250,000",
  reference: "payAbPTX6l4TUbn",
  status: "Paid",
  paidOn: "12 Jul 2026",
};
function PaymentSuccessPage() {
  useEffect(() => {
    document.title = "Payment Successful — PayGPT";
  }, []);
  const [copied, setCopied] = useState(false);
  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(details.reference);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };
  const downloadInvoice = () => {
    const body = `PayGPT — Payment Receipt
Invoice:    ${details.invoice}
Customer:   ${details.customer}
Amount:     ${details.amount}
Reference:  ${details.reference}
Status:     ${details.status}
Paid On:    ${details.paidOn}
`;
    const blob = new Blob([body], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${details.reference}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <PageShell>
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-16">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-center text-4xl">Payment Successful</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Your transaction has been confirmed. A receipt has been sent to your email.
        </p>
        <div className="mt-8 w-full overflow-hidden rounded-xl border border-border bg-card">
          <dl className="divide-y divide-border">
            <Row label="Invoice" value={details.invoice} />
            <Row label="Customer" value={details.customer} />
            <Row label="Amount" value={details.amount} strong />
            <Row label="Reference" value={details.reference} mono />
            <Row
              label="Status"
              value={
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {details.status}
                </span>
              }
            />
            <Row label="Paid On" value={details.paidOn} />
          </dl>
        </div>
        <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row">
          <button
            onClick={downloadInvoice}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4" /> Download Invoice
          </button>
          <button
            onClick={copyReference}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
          >
            {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Receipt Reference"}
          </button>
        </div>
        <Link
          to="/invoices"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-80"
        >
          Go to Dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </PageShell>
  );
}
function Row({
  label,
  value,
  strong,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd
        className={`text-right text-sm ${strong ? "font-display text-xl" : ""} ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
export default PaymentSuccessPage;