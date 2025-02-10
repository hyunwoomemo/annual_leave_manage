import KBar from "@/components/kbar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "연차 관리",
  description: "연차 관리",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/annualLeave/getTaskCount`);
  const { count } = await res.json();

  return (
    <KBar>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar count={count} />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
