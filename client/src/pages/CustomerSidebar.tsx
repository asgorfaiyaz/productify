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
  useSidebar,
} from "@/components/ui/sidebar";
import { Filter, X } from "lucide-react";

import { useLocation, useNavigate } from "react-router";
import { useCustomerCategories } from "@/hooks/useCategories";
import { useFilterStore } from "@/store/filter-store";
import { useRef } from "react";
import { CustomerSidebarFooter } from "./CustomerSidebarFooter";

function CustomerSidebar() {
  const { setFilters, clearFilters, filters } = useFilterStore(); // static data for an ecommerce-like sidebar
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useCustomerCategories();
  const navigate = useNavigate();
  const location = useLocation();
  const hasScrolledRef = useRef(false);
  const { setOpenMobile, isMobile } = useSidebar();

  const tempCategories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "books", name: "Books" },
    { id: "home", name: "Home & Kitchen" },
  ];
  const priceRanges = [
    { id: "under-50", label: "Under $50", min: undefined, max: 5000 },
    { id: "50-100", label: "$50 – $100", min: 5000, max: 10000 },
    { id: "100-500", label: "$100 – $500", min: 10000, max: 50000 },
    { id: "above-500", label: "Above $500", min: 50000, max: undefined },
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
                      if (!hasScrolledRef.current) {
                        document
                          .getElementById("products")
                          ?.scrollIntoView({ behavior: "auto" });

                        hasScrolledRef.current = true;
                      }

                      setFilters({
                        categoryId: undefined,
                        search: "",
                        page: 1,
                      });
                      if (location.pathname !== "/") {
                        navigate("/");
                      }
                    }}
                    className={`w-full capitalize text-left ${
                      filters.categoryId === undefined
                        ? "font-semibold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {(isCategoriesLoading ? tempCategories : categories).map(
                (category) => {
                  const isActive = filters.categoryId === category.id;
                  return (
                    <SidebarMenuItem key={category.id}>
                      <SidebarMenuButton asChild>
                        <button
                          onClick={() => {
                            if (location.pathname !== "/") {
                              navigate("/");
                            }
                            if (!hasScrolledRef.current) {
                              document
                                .getElementById("products")
                                ?.scrollIntoView({ behavior: "auto" });

                              hasScrolledRef.current = true;
                            }
                            if (isActive) {
                              setFilters({
                                categoryId: undefined,
                                page: 1,
                                search: undefined,
                              });
                              return;
                            }
                            setFilters({
                              categoryId: category.id,
                              page: 1,
                              search: undefined,
                            });
                            if (isMobile) {
                              setOpenMobile(false);
                            }
                          }}
                          className={`w-full capitalize text-left ${
                            isActive
                              ? "font-semibold text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {category.name}
                        </button>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                },
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
              {priceRanges.map((price) => {
                const isActive =
                  filters.minPrice === price.min &&
                  filters.maxPrice === price.max;

                return (
                  <SidebarMenuItem key={price.id}>
                    <SidebarMenuButton asChild>
                      <button
                        onClick={() => {
                          if (isActive) {
                            // clicking the same range toggles it off
                            setFilters({
                              minPrice: undefined,
                              maxPrice: undefined,
                              page: 1,
                            });
                            return;
                          }
                          if (location.pathname !== "/") navigate("/");
                          setFilters({
                            minPrice: price.min,
                            maxPrice: price.max,
                            page: 1,
                          });
                          if (isMobile) setOpenMobile(false);
                        }}
                        className={`w-full text-left transition-colors ${
                          isActive
                            ? "font-semibold text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {price.label}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
      </SidebarContent>

      <CustomerSidebarFooter />
    </Sidebar>
  );
}

export default CustomerSidebar;
