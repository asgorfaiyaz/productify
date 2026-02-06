"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardProducts } from "@/hooks/useDashboards";

export function DashboardProducts() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDashboardProducts(page);

  if (isLoading) {
    return <Skeleton className="h-75 w-full" />;
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.products.map((product, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-md bg-muted" />
                )}
                <span>{product.title}</span>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    product.status === "public" ? "default" : "secondary"
                  }
                >
                  {product.status}
                </Badge>
              </TableCell>

              <TableCell>{product.owner.name ?? "Unknown"}</TableCell>

              <TableCell>
                {product.priceInCents
                  ? `$${(product.priceInCents / 100).toFixed(2)}`
                  : "—"}
              </TableCell>

              <TableCell>
                {new Date(product.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === data.totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
