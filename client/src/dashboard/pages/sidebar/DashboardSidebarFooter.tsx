import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronsUpDown, LogOut, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router";
import { useClerk, useUser } from "@clerk/clerk-react";

export function DashboardSidebarFooter() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  // Don't render until Clerk has loaded
  if (!isLoaded) return null;

  const fullName = user?.fullName ?? "Guest User";
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  const imageUrl = user?.imageUrl ?? "";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            {/* ── Trigger ── */}
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={imageUrl} alt={fullName} />
                  <AvatarFallback className="rounded-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{fullName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-4 shrink-0" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            {/* ── Dropdown ── */}
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={8}
              className="w-56 rounded-lg"
            >
              {/* User info header */}
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={imageUrl} alt={fullName} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{fullName}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Navigation links */}
              <DropdownMenuItem asChild>
                <Link to="/account">
                  <UserRound className="mr-2 size-4" />
                  Account
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/orders">
                  <ShoppingBag className="mr-2 size-4" />
                  Orders
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {/* Logout */}
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={() => signOut({ redirectUrl: "/" })}
              >
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}
