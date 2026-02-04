import { useSalesDataByUser } from "@/hooks/usePurchases";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Package, CreditCard, CheckCircle2, XCircle } from "lucide-react";

function OrdersPage() {
  const { data, isLoading, isError } = useSalesDataByUser();

  if (isLoading) {
    return (
      <div className="p-6 max-w-5xl mx-auto space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-muted-foreground">
        Failed to load your orders
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center gap-2">
        <Package className="h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm text-muted-foreground">
          When you purchase something, it will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Your Orders</h1>
        <p className="text-sm text-muted-foreground">
          View your order history and payment status
        </p>
      </div>

      {data.map((order) => (
        <Card key={order.id} className="bg-base-200 rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">
                Order #{order.id.slice(0, 8)}
              </CardTitle>
              <CardDescription>
                {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {order.isPaid ? (
                <Badge className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Paid
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <XCircle className="h-3 w-3" /> Unpaid
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1">
                    <p className="font-medium">{item.product.title}</p>
                    {item.product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.product.description}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <div className="text-sm font-medium">
                    ${((item.priceInCents * item.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Stripe
              </div>
              <div className="text-lg font-semibold">
                ${(order.totalAmount / 100).toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default OrdersPage;
