import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageShell } from "@/components/page-shell";


function SignupPage() {
  useEffect(() => { document.title = 'Create account — PayGPT'; }, []);
  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="text-4xl">Create your account.</h1>
        <p className="mt-2 text-sm text-muted-foreground">30 days free. No card required.</p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6">
          <Field label="Full name" placeholder="Ada Lovelace" />
          <Field label="Business name (optional)" placeholder="Northwind Co." />
          <Field label="Work email" type="email" placeholder="you@company.com" />
          <Field label="Password" type="password" placeholder="At least 8 characters" />
          <button className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            Create account
          </button>
          <p className="text-xs text-muted-foreground">
            By continuing you agree to PayGPT's Terms and acknowledge our Privacy Policy.
          </p>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </PageShell>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-sm text-foreground">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
      />
    </label>
  );
}

export default SignupPage;
