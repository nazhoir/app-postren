import { FinanceSidebar } from "@/components/sidebar/finance";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/login");
  return (
    <SidebarProvider>
      <FinanceSidebar user={session.user} />

      <SidebarInset className="overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
