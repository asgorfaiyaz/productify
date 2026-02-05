import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router";

function DashboardSidebarHeader() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link className="flex gap-4  items-center py-4" to={"/dashboard"}>
              <ShoppingBag className="w-5 h-5 text-primary shrink-0" />
              <span className="text-base sm:text-md font-bold font-mono uppercase tracking-wider">
                Faiyaz Dev
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

export default DashboardSidebarHeader;
