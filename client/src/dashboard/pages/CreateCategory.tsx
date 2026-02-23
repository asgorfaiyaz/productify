import { Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Type,
  AlertCircle,
  Loader2,
  FolderPlus,
  Tag,
  Globe,
  Lock,
} from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDashboardCategory } from "@/hooks/useDashboards";

type CategoryFormState = {
  name: string;
  status: "public" | "private";
};

export function DashboardCreateCategoryPage() {
  const navigate = useNavigate();
  const createCategoryMutation = useCreateDashboardCategory();

  const [formData, setFormData] = useState<CategoryFormState>({
    name: "",
    status: "public",
  });

  const isFormValid = formData.name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    createCategoryMutation.mutate(formData, {
      onSuccess: () => navigate("/dashboard/categories"),
    });
  };

  return (
    <div className="min-h-screen lg:p-8 lg:pt-0 pt-0">
      <div className="mx-auto">
        {/* Back link */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 gap-1.5 text-muted-foreground"
          asChild
        >
          <Link to="/dashboard/categories">
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
              <Sparkles className="h-3 w-3" />
              Category Management
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create new category
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Fill in the details below to add a new product category.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* — Core details card — */}
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Category details
              </CardTitle>
              <CardDescription className="text-xs">
                Basic information about the category.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Name
                </Label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                  <Input
                    id="name"
                    placeholder="e.g. Electronics, Fashion, Books…"
                    className="h-9 pl-9 text-sm"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="space-y-2">
                <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Visibility
                </Label>
                <Select
                  value={formData.status}
                  disabled={createCategoryMutation.isPending}
                  onValueChange={(val) =>
                    setFormData({
                      ...formData,
                      status: val as CategoryFormState["status"],
                    })
                  }
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">
                      <span className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" />
                        Public
                      </span>
                    </SelectItem>
                    <SelectItem value="private">
                      <span className="flex items-center gap-2">
                        <Lock className="h-3.5 w-3.5" />
                        Private
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {createCategoryMutation.isError && (
            <Alert variant="destructive" className="py-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Failed to create category. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit row */}
          <div className="flex items-center justify-between gap-3 pb-8">
            <p className="text-xs text-muted-foreground">
              Category will be visible to customers if set to public.
            </p>
            <Button
              type="submit"
              disabled={!isFormValid || createCategoryMutation.isPending}
              className="min-w-38 gap-2"
            >
              {createCategoryMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <FolderPlus className="h-3.5 w-3.5" />
                  Create category
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
