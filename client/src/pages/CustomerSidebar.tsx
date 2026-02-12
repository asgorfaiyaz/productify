import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ChevronDown, User, Package, Filter, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Link, useLocation, useNavigate } from "react-router";
import { useCustomerCategories } from "@/hooks/useCategories";
import { useFilterStore } from "@/store/filter-store";
import { useAuth } from "@clerk/clerk-react";

function CustomerSidebar() {
  const { setFilters, clearFilters } = useFilterStore();
  // static data for an ecommerce-like sidebar
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCustomerCategories();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const tempCategories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "books", name: "Books" },
    { id: "home", name: "Home & Kitchen" },
  ];
  const priceRanges = [
    { id: "under-50", label: "Under $50" },
    { id: "50-100", label: "$50 – $100" },
    { id: "100-500", label: "$100 – $500" },
    { id: "above-500", label: "Above $500" },
  ];

  return (
    <Sidebar className="overflow-x-hidden">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Filter className="h-5 w-5" />
          <span className="text-base font-semibold">Filters</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        {/* Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => {
                      setFilters({
                        categoryId: undefined,
                        search: "",
                        page: 1,
                      });
                      if (location.pathname !== "/") {
                        navigate("/");
                      }
                    }}
                    className="w-full text-left font-medium"
                  >
                    All
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {(isCategoriesLoading ? tempCategories : categories).map(
                (category) => (
                  <SidebarMenuItem key={category.id}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => {
                          setFilters({
                            categoryId: category.id,
                            page: 1,
                            search: undefined,
                          });
                          if (location.pathname !== "/") {
                            navigate("/");
                          }
                        }}
                        className="w-full capitalize text-left"
                      >
                        {category.name}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Price filter */}
        <SidebarGroup>
          <SidebarGroupLabel>Price</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {priceRanges.map((price) => (
                <SidebarMenuItem key={price.id}>
                  <SidebarMenuButton asChild>
                    <button className="w-full text-left">{price.label}</button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Clear filters */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => {
                      clearFilters();
                      if (location.pathname !== "/") {
                        navigate("/");
                      }
                    }}
                    className="flex w-full items-center gap-2 text-sm text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                    Clear all filters
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Account & Orders (collapsible) */}
        {isSignedIn && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <Collapsible defaultOpen>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        <div className="flex w-full items-center justify-between">
                          <span>Manage your account & orders</span>
                          <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                        </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>

                  <CollapsibleContent>
                    <div className="ml-4 mt-1 space-y-1 overflow-x-hidden">
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 text-sm"
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link
                            to="/orders"
                            className="flex items-center gap-2 text-sm"
                          >
                            <Package className="h-4 w-4" />
                            Orders
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </div>
                  </CollapsibleContent>
                </SidebarMenu>
              </Collapsible>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

export default CustomerSidebar;
