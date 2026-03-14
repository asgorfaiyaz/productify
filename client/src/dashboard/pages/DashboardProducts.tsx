import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Edit3,
  ExternalLink,
  Search,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  MoreVertical,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Trash2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router";
import { AxiosError } from "axios";
import { fetchDashboardProducts } from "@/api/dashboards";
import { useDashboardCategories } from "@/hooks/useDashboards";
import { useDeleteProduct } from "@/hooks/useProducts";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortField = "title" | "priceInCents" | "createdAt" | "status";
export type SortOrder = "asc" | "desc";

type Product = {
  id: string;
  imageUrl: string | null;
  createdAt: Date;
  description: string | null;
  title: string;
  status: "public" | "private";
  priceInCents: number | null;
  owner: { name: string | null };
};

type ApiError = { error: string; details?: unknown };

// ─── Constants ────────────────────────────────────────────────────────────────

const LIMIT = 10;

// ─── useDebounce ──────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── PriceDisplay ─────────────────────────────────────────────────────────────

function PriceDisplay({ cents }: { cents: number | null }) {
  if (cents == null) return <span className="text-white/15 text-xs">—</span>;
  const dollars = (cents / 100).toFixed(2);
  const [whole, dec] = dollars.split(".");
  return (
    <span className="tabular-nums text-white/70 text-sm font-medium">
      <span className="text-white/30 text-xs mr-px">$</span>
      {whole}
      <span className="text-white/35 text-xs">.{dec}</span>
    </span>
  );
}

// ─── SortableHead ─────────────────────────────────────────────────────────────

function SortableHead({
  field,
  label,
  sortField,
  sortOrder,
  onSort,
  className,
}: {
  field: SortField;
  label: string;
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  className?: string;
}) {
  const isActive = sortField === field;

  return (
    <TableHead
      onClick={() => onSort(field)}
      className={cn(
        "py-2.5 text-[10px] font-semibold uppercase tracking-widest cursor-pointer select-none transition-colors duration-150",
        isActive ? "text-white/60" : "text-white/20 hover:text-white/35",
        className,
      )}
    >
      <div className="flex items-center gap-1">
        {label}
        {isActive ? (
          sortOrder === "asc" ? (
            <ChevronUp className="h-3 w-3 shrink-0" />
          ) : (
            <ChevronDown className="h-3 w-3 shrink-0" />
          )
        ) : (
          <ChevronsUpDown className="h-3 w-3 shrink-0 text-white/15" />
        )}
      </div>
    </TableHead>
  );
}

// ─── ProductRowSkeleton ───────────────────────────────────────────────────────

export function ProductRowSkeleton({ index }: { index: number }) {
  return (
    <TableRow
      className="border-b w-full border-white/[0.04] hover:bg-transparent"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <TableCell className="py-3 pl-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-md shrink-0 bg-white/[0.05]" />
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-28 bg-white/[0.05]" />
            <Skeleton className="h-2.5 w-20 bg-white/[0.03]" />
          </div>
        </div>
      </TableCell>
      <TableCell className="py-3 hidden sm:table-cell">
        <Skeleton className="h-4 w-12 rounded-sm bg-white/[0.05]" />
      </TableCell>
      <TableCell className="py-3 hidden sm:table-cell">
        <Skeleton className="h-3 w-14 bg-white/[0.05]" />
      </TableCell>
      <TableCell className="py-3 hidden md:table-cell">
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
              <PackageOpen
                className="h-6 w-6 text-white/20"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-white/40 tracking-wide">
              {hasFilters ? "No matches" : "No products"}
            </p>
            <p className="text-xs text-white/20 max-w-[200px] leading-relaxed">
              {hasFilters
                ? "Try a different search term or category"
                : "Products will appear here once added"}
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── ProductRow ───────────────────────────────────────────────────────────────

function ProductRow({
  product,
  index,
  deleteProduct,
  deleteIsPending,
}: {
  product: Product;
  index: number;
  deleteProduct: (id: string) => void;
  deleteIsPending: boolean;
}) {
  const isPublic = product.status === "public";

  return (
    <TableRow
      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150 group"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Product — always visible */}
      <TableCell className="py-3 pl-5">
        <div className="flex items-center gap-3">
          {product.imageUrl ? (
            <div className="relative shrink-0">
              <img
                src={product.imageUrl}
                alt={product.title}
                width={36}
                height={36}
                className="h-9 w-9 rounded-md object-cover ring-1 ring-white/[0.08]"
              />
              {isPublic && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-zinc-950" />
              )}
            </div>
          ) : (
            <div className="h-9 w-9 rounded-md bg-white/[0.04] ring-1 ring-white/[0.07] shrink-0 flex items-center justify-center">
              <PackageOpen className="h-3.5 w-3.5 text-white/15" />
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-white/80 truncate max-w-[160px] sm:max-w-[200px] leading-tight">
              {product.title}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] text-white/25 truncate leading-tight">
                {product.owner.name ?? "Unknown"}
              </span>
              {/* Mobile-only: status dot + price */}
              <span className="sm:hidden flex items-center gap-1.5 shrink-0">
                <span className="text-white/15">·</span>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPublic ? "bg-emerald-400" : "bg-white/20"
                  }`}
                />
                {product.priceInCents != null && (
                  <>
                    <span className="text-white/15">·</span>
                    <span className="text-[11px] text-white/40 tabular-nums">
                      ${(product.priceInCents / 100).toFixed(2)}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      {/* Status — hidden on mobile */}
      <TableCell className="py-3 hidden sm:table-cell">
        <div className="flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full shrink-0 ${
              isPublic ? "bg-emerald-400" : "bg-white/20"
            }`}
          />
          <span
            className={`text-[11px] font-medium tracking-wide uppercase ${
              isPublic ? "text-emerald-400/80" : "text-white/25"
            }`}
          >
            {product.status}
          </span>
        </div>
      </TableCell>

      {/* Price — hidden on mobile */}
      <TableCell className="py-3 hidden sm:table-cell">
        <PriceDisplay cents={product.priceInCents} />
      </TableCell>

      {/* Created — hidden below md */}
      <TableCell className="py-3 hidden md:table-cell">
        <span className="text-xs text-white/35 tabular-nums">
          {new Date(product.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </TableCell>

      {/* Actions — always visible */}
      <TableCell className="py-3 pr-5 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded opacity-60 sm:opacity-0 group-hover:opacity-100 transition-all duration-150 hover:bg-white/8 data-[state=open]:opacity-100 data-[state=open]:bg-white/8"
            >
              <MoreVertical className="h-3.5 w-3.5 text-white/40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={6}
            className="bg-zinc-950 border border-white/[0.08] text-white/65 min-w-[140px] shadow-xl shadow-black/40 rounded-lg p-1"
          >
            <DropdownMenuItem
              asChild
              className="rounded-md text-xs px-2.5 py-1.5 focus:bg-white/[0.06] focus:text-white/90 cursor-pointer gap-2.5"
            >
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to={`/dashboard/products/${product.id}/edit`}
              >
                <Edit3 className="h-3 w-3 shrink-0" />
                Edit product
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="rounded-md text-xs px-2.5 py-1.5 focus:bg-white/[0.06] focus:text-white/90 cursor-pointer gap-2.5"
            >
              <Link
                target="_blank"
                rel="noopener noreferrer"
                to={`/product/${product.id}`}
              >
                <ExternalLink className="h-3 w-3 shrink-0" />
                View live
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
            <DropdownMenuItem
              asChild
              className="rounded-md text-xs px-2.5 py-1.5 text-red-400/80 focus:bg-red-500/10 focus:text-red-400 cursor-pointer gap-2.5"
            >
              <button
                onClick={() => deleteProduct(product.id)}
                disabled={deleteIsPending}
              >
                {deleteIsPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <Trash2Icon className="size-4" />
                )}
                Delete
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

// ─── DashboardProducts ────────────────────────────────────────────────────────

export function DashboardProducts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const navigate = useNavigate();
  const {
    mutate: deleteProductMutation,
    isPending: deleteIsPending,
    error: deleteError,
  } = useDeleteProduct();

  const handleDelete = (id: string) => {
    deleteProductMutation(id, {
      onSuccess: () => {
        navigate("/dashboard/products");
      },
    });
  };
  const debouncedSearch = useDebounce(search, 400);
  const { data: categoriesData } = useDashboardCategories(1);

  const filters = {
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    categoryId: category !== "all" ? category : undefined,
    sortField,
    sortOrder,
  };

  const { data, isLoading, isFetching } = useQuery<
    { products: Product[]; totalProducts: number; totalPages: number },
    AxiosError<ApiError>
  >({
    queryKey: ["dashboard-products", filters],
    queryFn: () => fetchDashboardProducts(filters),
    placeholderData: (prev) => prev,
  });

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleCategoryChange = useCallback((val: string) => {
    setCategory(val);
    setPage(1);
  }, []);

  // Same column → flip order. New column → default desc, reset page
  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("desc");
      }
      setPage(1);
    },
    [sortField],
  );

  const totalPages = data?.totalPages ?? 1;
  const hasFilters = !!debouncedSearch || category !== "all";
  const isEmpty = !isLoading && !data?.products?.length;

  // Shared props to avoid repeating sortField/sortOrder/onSort everywhere
  const sortProps = { sortField, sortOrder, onSort: handleSort };

  return (
    <Card className="w-full border-none bg-transparent rounded-xl overflow-hidden">
      {/* ── Header ─────────────────────────────────────────── */}
      <CardHeader className="space-y-3.5 border-b border-white/[0.05] px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-0.5">
            <h2 className="text-sm font-semibold text-white/85 tracking-tight">
              Products
            </h2>
            <span className="text-[11px] text-white/25">
              {isFetching && !isLoading ? (
                <span className="animate-pulse">Updating…</span>
              ) : data ? (
                `${data.totalProducts.toLocaleString()} total`
              ) : (
                "—"
              )}
            </span>
          </div>

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
            <span className="text-[11px] text-white/30 tabular-nums px-2 min-w-[52px] text-center font-medium">
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/20 pointer-events-none" />
            <Input
              placeholder="Search products…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-8 h-8 text-xs bg-white/[0.03] border-white/[0.07] text-white/75 placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-white/12 focus-visible:border-white/15 rounded-lg transition-all"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-white/20 pointer-events-none z-10" />
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="pl-8 w-full sm:w-44 h-8 text-xs bg-white/[0.03] border-white/[0.07] text-white/55 focus:ring-1 focus:ring-white/12 rounded-lg transition-all">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-white/[0.08] shadow-xl shadow-black/40 rounded-lg">
                <SelectItem
                  value="all"
                  className="text-xs text-white/60 focus:bg-white/[0.05] focus:text-white/85 rounded-md"
                >
                  All categories
                </SelectItem>
                {categoriesData?.categories.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                    className="text-xs text-white/60 focus:bg-white/[0.05] focus:text-white/85 rounded-md"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* ── Table ──────────────────────────────────────────── */}
      <CardContent className="p-0">
        {deleteError && (
          <div className="px-5 pt-4">
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {deleteError.message || "Failed to delete product"}
            </div>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/[0.04] hover:bg-transparent">
              {/* Product — not sortable (no single sort value) */}
              <TableHead className="pl-5 py-2.5 text-[10px] font-semibold text-white/20 uppercase tracking-widest">
                Product
              </TableHead>

              {/* Sortable — hidden on mobile */}
              <SortableHead
                field="status"
                label="Status"
                className="hidden sm:table-cell"
                {...sortProps}
              />
              <SortableHead
                field="priceInCents"
                label="Price"
                className="hidden sm:table-cell"
                {...sortProps}
              />

              {/* Sortable — hidden below md */}
              <SortableHead
                field="createdAt"
                label="Created"
                className="hidden md:table-cell"
                {...sortProps}
              />

              {/* Actions — not sortable */}
              <TableHead className="pr-5 py-2.5" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: LIMIT }).map((_, i) => (
                <ProductRowSkeleton key={i} index={i} />
              ))
            ) : isEmpty ? (
              <EmptyState hasFilters={hasFilters} />
            ) : (
              data!.products.map((product, i) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  index={i}
                  deleteProduct={handleDelete}
                  deleteIsPending={deleteIsPending}
                />
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
