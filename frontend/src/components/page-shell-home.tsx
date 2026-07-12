
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header-home";
import { SiteFooter } from "./site-footer";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <SidebarInset className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
