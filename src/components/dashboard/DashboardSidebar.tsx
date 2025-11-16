import { LayoutDashboard, Package, Briefcase, Store, Settings, HelpCircle, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "My Apps", url: "/dashboard/my-apps", icon: Package },
  { title: "Briefcase", url: "/dashboard/briefcase", icon: Briefcase },
  { title: "App Store", url: "/dashboard/app-store", icon: Store },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help & Support", url: "/dashboard/help", icon: HelpCircle },
];

export function DashboardSidebar() {
  const { state, setOpen } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string, end?: boolean) => {
    if (end) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-[280px] sm:w-60"} border-r border-white/10 bg-black/40 backdrop-blur-xl`}
      collapsible="icon"
    >
      {/* Close button for mobile - always visible at top */}
      {!collapsed && (
        <SidebarHeader className="lg:hidden p-4 flex items-center justify-between border-b border-white/10">
          <span className="text-sm font-medium text-white/70">Navigation</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-white/10 h-8 w-8"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </SidebarHeader>
      )}
      
      <SidebarContent className={collapsed ? "mt-16 sm:mt-20" : "mt-0 sm:mt-20 lg:mt-20"}>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs sm:text-sm"}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className="hover:bg-white/5 rounded-md transition-colors text-sm sm:text-base py-2" 
                      activeClassName="bg-white/10 text-primary font-medium"
                    >
                      <item.icon className={`${collapsed ? "" : "mr-2"} h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0`} />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}