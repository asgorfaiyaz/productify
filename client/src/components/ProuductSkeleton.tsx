import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default function ProductSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardHeader className="p-4 space-y-2">
        {/* Title Placeholder */}
        <Skeleton className="h-5 w-2/3" />
        {/* Subtitle/Category Placeholder */}
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>

      <CardContent className="p-4 pt-0 grow">
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        {/* Price Placeholder */}
        <Skeleton className="h-6 w-16" />
        {/* Button Placeholder */}
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}
