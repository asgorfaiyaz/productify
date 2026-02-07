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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardProducts } from "@/hooks/useDashboards";

export function DashboardProducts() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDashboardProducts(page);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg md:text-xl">Products</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={page === data?.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : !data ? null : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Owner</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="hidden sm:table-cell">Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.products.map((product) => (
                <TableRow key={product.title}>
                  <TableCell className="flex items-center gap-3">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted" />
                    )}

                    <div className="flex flex-col">
                      <span className="font-medium">{product.title}</span>
                      <span className="text-xs text-muted-foreground md:hidden">
                        {product.owner.name ?? "Unknown"}
                      </span>
                    </div>
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

                  <TableCell className="hidden md:table-cell">
                    {product.owner.name ?? "Unknown"}
                  </TableCell>

                  <TableCell className="text-right font-medium">
                    {product.priceInCents
                      ? `$${(product.priceInCents / 100).toFixed(2)}`
                      : "—"}
                  </TableCell>

                  <TableCell className="hidden sm:table-cell">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
