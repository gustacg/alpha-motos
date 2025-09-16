import { Users, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  {
    title: "Clientes",
    url: "/crm",
    icon: Users,
  }
];

export function AppSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar className="border-r border-border flex-shrink-0">
      <SidebarHeader className="px-6 py-6">
        {/* Logo */}
        <div className="flex items-start justify-start pl-3">
          <img 
            src="/logo-dark.png" 
            alt="Alpha Motos" 
            className="w-24 h-auto object-contain dark:block hidden"
          />
          <img 
            src="/logo-light.png" 
            alt="Alpha Motos" 
            className="w-24 h-auto object-contain dark:hidden block"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup className="px-6">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-6 py-4 space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 bg-gradient-brand rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 text-left">
            <span className="text-sm font-medium text-sidebar-foreground block">Alpha Motos</span>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          onClick={logout}
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair do sistema</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}