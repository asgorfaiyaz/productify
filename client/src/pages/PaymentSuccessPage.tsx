import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function PaymentSuccessPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl">
        <CardHeader className="text-center space-y-2">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <CardTitle className="text-2xl">Payment Successful</CardTitle>
          <CardDescription>
            Thank you! Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link to="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/orders">View Order Details</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
