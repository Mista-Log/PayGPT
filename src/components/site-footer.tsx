import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground font-display text-lg">P</span>
            <span className="font-display text-xl">PayGPT</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            AI-powered business banking. Move money, send invoices, and understand your numbers — by chat.
          </p>
        </div>
        <FooterCol title="Product" links={[["Assistant","/chat"],["Invoices","/invoices"],["Payments","/payments"],["Insights","/insights"]]} />
        <FooterCol title="Company" links={[["Pricing","/pricing"],["Documentation","/docs"],["Sign in","/login"],["Get started","/signup"]]} />
        <FooterCol title="Legal" links={[["Terms","/docs"],["Privacy","/docs"],["Security","/docs"],["Contact","/docs"]]} />
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} PayGPT. All rights reserved.</span>
          <span>Built for SMEs and individuals.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="transition-colors hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
