import { Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  ArrowLeft,
  FileText,
  ImageIcon,
  Sparkles,
  Type,
  DollarSign,
  AlertCircle,
  Loader2,
  PackagePlus,
  Tag,
} from "lucide-react";
import { useCreateProduct } from "../hooks/useProducts";
import { useDashboardCategories } from "@/hooks/useDashboards";

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
import { Textarea } from "@/components/ui/textarea";
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

type ProductFormState = {
  title: string;
  description: string;
  imageUrl: string;
  price: number | "";
  status: "public" | "private";
};

function DashboardCreateProductPage() {
  const navigate = useNavigate();
  const createProductMutation = useCreateProduct();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data, isLoading } = useDashboardCategories(1);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const [formData, setFormData] = useState<ProductFormState>({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
    status: "public",
  });

  const isFormValid =
    formData.title.trim() && formData.price !== "" && formData.price > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    createProductMutation.mutate(
      {
        ...formData,
        price: Number(formData.price),
        categoryIds: selectedCategories,
      },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  return (
    <div className="min-h-screen lg:p-8 lg:pt-0">
      <div className="mx-auto">
        {/* Back link */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 -ml-2 gap-1.5 text-muted-foreground"
          asChild
        >
          <Link to="/dashboard/products">
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
              Product Management
            </Badge>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Create new product
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Fill in the details below to publish a new product.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* — Core details card — */}
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">
                Core details
              </CardTitle>
              <CardDescription className="text-xs">
                Basic information about the product.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Title
                </Label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                  <Input
                    id="title"
                    placeholder="e.g. Wireless Noise-Cancelling Headphones"
                    className="h-9 pl-9 text-sm"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Price + Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="price"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Price
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="19.99"
                      className="h-9 pl-9 text-sm"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price:
                            e.target.value === "" ? "" : Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Visibility
                  </Label>
                  <Select
                    value={formData.status}
                    disabled={createProductMutation.isPending}
                    onValueChange={(val) =>
                      setFormData({
                        ...formData,
                        status: val as ProductFormState["status"],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* — Categories card — */}
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                Categories
              </CardTitle>
              <CardDescription className="text-xs">
                Select all categories that apply.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-5">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading categories…
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {data?.categories?.map((category) => {
                    const isSelected = selectedCategories.includes(category.id);
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => toggleCategory(category.id)}
                        className={`
                          inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium
                          capitalize transition-all duration-150 cursor-pointer
                          ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }
                        `}
                      >
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              )}
              {selectedCategories.length > 0 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  {selectedCategories.length} categor
                  {selectedCategories.length === 1 ? "y" : "ies"} selected
                </p>
              )}
            </CardContent>
          </Card>

          {/* — Media & description card — */}
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">
                Media & description
              </CardTitle>
              <CardDescription className="text-xs">
                Add a cover image and describe the product.
              </CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6 space-y-5">
              {/* Image URL */}
              <div className="space-y-2">
                <Label
                  htmlFor="imageUrl"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Image URL
                </Label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    className="h-9 pl-9 text-sm"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Image preview */}
              {formData.imageUrl && (
                <div className="overflow-hidden rounded-lg border border-border">
                  <img
                    src={formData.imageUrl}
                    alt="Product preview"
                    className="h-44 w-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Description
                </Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground/50" />
                  <Textarea
                    id="description"
                    placeholder="Describe the product in detail…"
                    className="min-h-28 pl-9 text-sm resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          {createProductMutation.isError && (
            <Alert variant="destructive" className="py-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Failed to create product. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit row */}
          <div className="flex items-center justify-between gap-3 pb-8">
            <p className="text-xs text-muted-foreground">
              Product will be visible immediately if set to public.
            </p>
            <Button
              type="submit"
              disabled={!isFormValid || createProductMutation.isPending}
              className="min-w-36 gap-2"
            >
              {createProductMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Creating…
                </>
              ) : (
                <>
                  <PackagePlus className="h-3.5 w-3.5" />
                  Create product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DashboardCreateProductPage;
