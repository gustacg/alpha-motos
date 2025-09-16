import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { PageTitleProvider } from "@/contexts/PageTitleContext";

export function AppLayout() {
  return (
    <PageTitleProvider>
      <SidebarProvider style={{ '--sidebar-width': '13rem' } as React.CSSProperties}>
      <div className="min-h-screen flex w-full bg-background font-sans">
        <AppSidebar />
        
        <div className="flex-1 flex min-w-0 flex-col ml-0">
          <Header />
          
          <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
            <Outlet />
          </main>
        </div>
        </div>
      </SidebarProvider>
    </PageTitleProvider>
  );
}