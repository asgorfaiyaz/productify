import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar";
import DashboardSidebarContent from "./DashboardSidebarContent";
import DashboardSidebarHeader from "./DashboardSidebarHeader";
import DashboardSidebarFooter from "./DashboardSidebarFooter";

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon">
      <DashboardSidebarHeader />
      <SidebarSeparator />
      <DashboardSidebarContent />
      <DashboardSidebarFooter />
    </Sidebar>
  );
}
