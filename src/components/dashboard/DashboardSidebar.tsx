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
      className="w-[200px] sm:w-60 border-r border-white/10 bg-black/40 backdrop-blur-xl"
      collapsible="none"
    >
      <SidebarContent className="mt-16 sm:mt-20">
        {/* Close button for mobile only */}
        <div className="lg:hidden px-3 py-2 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="w-full text-white/70 hover:bg-white/10 hover:text-white flex items-center justify-start gap-2"
          >
            <X className="h-4 w-4" />
            <span className="text-sm">Close</span>
          </Button>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.end}
                      className="hover:bg-white/5 rounded-md transition-colors text-sm py-2.5" 
                      activeClassName="bg-white/10 text-primary font-medium"
                      onClick={() => {
                        // Close sidebar on mobile after navigation
                        if (window.innerWidth < 1024) {
                          setOpen(false);
                        }
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
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