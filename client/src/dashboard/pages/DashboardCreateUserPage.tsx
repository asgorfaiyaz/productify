import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useCreateDashboardUser } from "@/hooks/useDashboards";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router";

function DashboardCreateUserPage() {
  const { mutateAsync, isPending, error } = useCreateDashboardUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    await mutateAsync({ firstName, lastName, email });

    setFirstName("");
    setLastName("");
    setEmail("");
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  const isFormFilled = firstName.trim() && lastName.trim() && email.trim();

  return (
    <div className="min-h-screen w-full lg:p-8 lg:pt-0">
      <div className="mx-auto">
        {/* Back link */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 gap-1.5 text-muted-foreground"
          asChild
        >
          <Link to="/dashboard/users">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </Button>
        {/* Page header */}
        <div className="mb-8">
          <div className="mb-3">
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium tracking-wide"
            >
              <UserPlus className="h-3 w-3" />
              User Management
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create new user
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Add a new member to your dashboard workspace.
          </p>
        </div>

        {/* Card */}
        <Card className="shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">
              User details
            </CardTitle>
            <CardDescription className="text-xs">
              Fill in the information below. The user will receive an invite
              email.
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name row — side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="h-9 text-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="h-9 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="h-9 text-sm"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {(error as any).response?.data?.message ??
                      "Failed to create user. Please try again."}
                  </AlertDescription>
                </Alert>
              )}

              {/* Success */}
              {success && (
                <Alert className="border-emerald-500/30 bg-emerald-500/10 py-3 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    User created successfully.
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              {/* Footer row */}
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  An invite will be sent on creation.
                </p>
                <Button
                  type="submit"
                  disabled={isPending || !isFormFilled}
                  className="min-w-32 gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Creating…
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      Create user
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default DashboardCreateUserPage;
