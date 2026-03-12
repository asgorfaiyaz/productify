import { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useDashboardUsers,
  useDeleteDashboardUser,
} from "@/hooks/useDashboards";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Shield,
  Trash2,
  UserRound,
  Users,
  UserX,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── useDebounce ──────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    icon: Shield,
    className: "text-amber-400/90 bg-amber-500/10 border border-amber-500/65",
  },
  user: {
    label: "User",
    icon: UserRound,
    className: "text-blue-400/90 bg-blue-500/10 border border-blue-500/65",
  },
} as const;

function RoleBadge({ role }: { role: string }) {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        config.className,
      )}
    >
      <Icon className="h-2.5 w-2.5" />
      {config.label}
    </span>
  );
}

// ─── UserRowSkeleton ──────────────────────────────────────────────────────────

function UserRowSkeleton({ index }: { index: number }) {
  return (
    <TableRow
      className="border-b border-white/[0.04] hover:bg-transparent"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <TableCell className="py-3 pl-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full shrink-0 bg-white/[0.05]" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28 bg-white/[0.05]" />
            <Skeleton className="h-2.5 w-20 bg-white/[0.03]" />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3 hidden md:table-cell">
        <Skeleton className="h-3 w-36 bg-white/[0.05]" />
      </TableCell>
      <TableCell className="py-3">
        <Skeleton className="h-4 w-14 rounded-md bg-white/[0.05]" />
      </TableCell>
      <TableCell className="py-3 hidden sm:table-cell">
        <Skeleton className="h-3 w-20 bg-white/[0.05]" />
      </TableCell>
      <TableCell className="py-3 pr-5 text-right">
        <Skeleton className="h-6 w-6 ml-auto rounded bg-white/[0.05]" />
      </TableCell>
    </TableRow>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <TableRow className="border-0 hover:bg-transparent">
      <TableCell colSpan={5} className="py-0">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-white/[0.03] blur-xl scale-150" />
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
              {hasFilters ? (
                <UserX className="h-6 w-6 text-white/20" strokeWidth={1.5} />
              ) : (
                <Users className="h-6 w-6 text-white/20" strokeWidth={1.5} />
              )}
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-white/40 tracking-wide">
              {hasFilters ? "No matches" : "No users"}
            </p>
            <p className="text-xs text-white/20 max-w-[200px] leading-relaxed">
              {hasFilters
                ? "Try a different name or email"
                : "Users will appear here once added"}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── DashboardUsers ───────────────────────────────────────────────────────────

export function DashboardUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching } = useDashboardUsers({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
  });
  const {
    mutate: deleteUserMutation,
    isPending: deleteIsPending,
    error: deleteError,
  } = useDeleteDashboardUser();

  const handleDelete = (id: string) => {
    deleteUserMutation(id);
  };

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const totalPages = data?.totalPages ?? 1;
  const hasFilters = !!debouncedSearch;
  const isEmpty = !isLoading && !data?.users?.length;

  return (
    <Card className="w-full border-none bg-transparent rounded-xl overflow-hidden">
      {/* ── Header ─────────────────────────────────────────── */}
      <CardHeader className="space-y-3.5 border-b border-white/[0.05] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-white/85 tracking-tight">
              Users
            </h2>
            <span className="text-[11px] text-white/75">
              {isFetching && !isLoading ? (
                <span className="animate-pulse">Updating…</span>
              ) : data ? (
                `${data.totalUsers.toLocaleString()} total`
              ) : (
                "—"
              )}
            </span>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => p - 1)}
              className="h-7 w-7 p-0 rounded-md hover:bg-white/[0.06] text-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[11px] text-white/40 tabular-nums px-2 min-w-[52px] text-center font-medium">
              {page}
              <span className="text-white/15 mx-1">/</span>
              {totalPages}
            </span>
            <Button
              size="sm"
              variant="ghost"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => p + 1)}
              className="h-7 w-7 p-0 rounded-md hover:bg-white/[0.06] text-white/30 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/20 pointer-events-none" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs bg-white/[0.03] border-white/[0.07] text-white/75 placeholder:text-white/75 focus-visible:ring-1 focus-visible:ring-white/12 focus-visible:border-white/15 rounded-lg transition-all"
          />
        </div>
      </CardHeader>

      {/* ── Table ──────────────────────────────────────────── */}
      <CardContent className="p-0">
        {/* Delete error */}
        {deleteError && (
          <div className="px-5 pt-4">
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {(deleteError as any)?.response?.data?.error ??
                deleteError.message ??
                "Failed to delete user"}
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
              <TableHead className="pl-5 py-2.5 text-[10px] font-semibold text-white/65 uppercase tracking-widest">
                User
              </TableHead>
              <TableHead className="py-2.5 text-[10px] font-semibold text-white/65 uppercase tracking-widest hidden md:table-cell">
                Email
              </TableHead>
              <TableHead className="py-2.5 text-[10px] font-semibold text-white/65 uppercase tracking-widest">
                Role
              </TableHead>
              <TableHead className="py-2.5 text-[10px] font-semibold text-white/65 uppercase tracking-widest hidden sm:table-cell">
                Joined
              </TableHead>
              <TableHead className="pr-5 py-2.5" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <UserRowSkeleton key={i} index={i} />
              ))
            ) : isEmpty ? (
              <EmptyState hasFilters={hasFilters} />
            ) : (
              data!.users.map((user, i) => (
                <TableRow
                  key={user.id}
                  className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150 group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* User */}
                  <TableCell className="py-3 pl-5">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 ring-1 ring-white/[0.08] shrink-0">
                        <AvatarImage src={user.imageUrl ?? undefined} />
                        <AvatarFallback className="bg-white/[0.05] text-white/40 text-xs">
                          {user.name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-medium text-white/80 truncate max-w-[160px] leading-tight">
                          {user.name ?? "Unnamed"}
                        </span>
                        <span className="text-[11px] text-white/65 truncate md:hidden leading-tight mt-0.5">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="py-3 hidden md:table-cell">
                    <span className="text-xs text-white/35">{user.email}</span>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="py-3">
                    <RoleBadge role={user.role} />
                  </TableCell>

                  {/* Joined */}
                  <TableCell className="py-3 hidden sm:table-cell">
                    <span className="text-xs text-white/65 tabular-nums">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 pr-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-white/[0.08] data-[state=open]:opacity-100 data-[state=open]:bg-white/[0.08]"
                        >
                          <MoreVertical className="h-3.5 w-3.5 text-white/40" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        className="bg-zinc-950 border border-white/[0.08] text-white/65 min-w-[140px] shadow-xl shadow-black/40 rounded-lg p-1"
                      >
                        <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
                        <DropdownMenuItem
                          asChild
                          className="rounded-md text-xs px-2.5 py-1.5 text-red-400/80 focus:bg-red-500/10 focus:text-red-400 cursor-pointer gap-2.5"
                        >
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={deleteIsPending}
                            className="w-full"
                          >
                            <Trash2 className="h-3 w-3 shrink-0" />
                            Delete user
                          </button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
