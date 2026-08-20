import { SiteHeader } from "@/components/shared/SiteHeader";
import { SiteFooter } from "@/components/home/SiteFooter";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
