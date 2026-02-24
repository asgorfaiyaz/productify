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
import { ChevronsUpDown, LogIn, LogOut, UserRound } from "lucide-react";
import { Link } from "react-router";
import { SignInButton, useClerk, useUser } from "@clerk/clerk-react";

export function CustomerSidebarFooter() {
  const { user, isLoaded } = useUser();
  const { signOut, isSignedIn } = useClerk();

  if (!isLoaded) return null;

  // ── Not signed in ──
  if (!isSignedIn) {
    return (
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <SignInButton mode="modal">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                    <LogIn className="h-4 w-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Sign in</span>
                    <span className="truncate text-xs text-muted-foreground">
                      to access your account
                    </span>
                  </div>
                </div>
              </SignInButton>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    );
  }

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
                <Avatar className="h-8 w-8 rounded-full">
                  <AvatarImage src={imageUrl} alt={fullName} />
                  <AvatarFallback className="rounded-full">
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
              side="top"
              align="center"
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
                <Link to="/profile">
                  <UserRound className="mr-2 size-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              {isSignedIn && user?.publicMetadata.role !== "user" && (
                <DropdownMenuItem asChild className="lg:hidden">
                  <a href="/dashboard">
                    <UserRound className="mr-2 size-4" />
                    Dashboard
                  </a>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link to="/orders">
                  <UserRound className="mr-2 size-4" />
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
