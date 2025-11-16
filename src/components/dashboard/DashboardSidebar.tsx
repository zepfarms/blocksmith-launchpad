import { LayoutDashboard, Store, Briefcase, Settings, HelpCircle } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "My Apps", url: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "Briefcase", url: "/dashboard/briefcase", icon: Briefcase },
  { title: "App Store", url: "/dashboard/app-store", icon: Store },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help", url: "/dashboard/help", icon: HelpCircle },
];

export function DashboardSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (url: string, end?: boolean) => {
    if (end) return currentPath === url;
    return currentPath.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent className="gap-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = isActive(item.url, item.end);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end={item.end}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted/50"
                        activeClassName="bg-muted text-acari-green font-medium"
                      >
                        <item.icon className={`h-5 w-5 ${active ? "text-acari-green" : "text-muted-foreground"}`} />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
