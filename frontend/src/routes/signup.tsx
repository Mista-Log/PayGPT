import { useEffect, useState } from "react";
import { PageShell } from "@/components/page-shell";
import { signup } from "@/api/auth";
import { Link, useNavigate } from "react-router-dom";


function SignupPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    business_name: "",
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const data = await signup(formData);

      console.log("Signup successful:", data);

      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in.",
        },
      });

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { document.title = 'Create account — PayGPT'; }, []);
  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col px-6 py-16">
        <h1 className="text-4xl">Create your account.</h1>
        <p className="mt-2 text-sm text-muted-foreground">30 days free. No card required.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-xl border border-border bg-card p-6"
        >
          <Field
            label="Full name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Ada Lovelace"
          />
          <Field
            label="Business name"
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            placeholder="Northwind Co."
          />

          <Field
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          <Field
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create account"}
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
