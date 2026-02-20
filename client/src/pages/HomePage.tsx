import { PackageIcon, SparklesIcon } from "lucide-react";
import { Link } from "react-router";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import ProductPagination from "@/components/ProductPagination";
import { useFilterStore } from "@/store/filter-store";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ProductSkeleton from "@/components/ProuductSkeleton";
function HomePage() {
  const { filters, setFilters } = useFilterStore();
  const { data, isLoading } = useProducts();
  const totalPages = data?.totalPages ?? 1;

  return (
    // Changed mb-5 to pb-10 to ensure space at the very bottom of the page
    <div className=" lg:pb-10">
      {/* HERO SECTION */}
      <div className="w-full hero bg-linear-to-br from-base-300 via-base-200 to-base-300 rounded-box overflow-hidden mb-10">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          slidesPerView={1}
          // pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="w-full h-full mySwiper"
        >
          {/* Slide 1: General Welcome/New Arrivals */}
          <SwiperSlide>
            <div className="hero-content flex-col lg:flex-row-reverse gap-10 lg:gap-20 py-12 px-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110" />
                <img
                  src="/first.svg" // Look for "Online shopping" or "Shopping bag" SVG
                  alt="New Arrivals"
                  className="relative h-64 lg:h-80 w-auto"
                />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-mono font-extrabold leading-tight">
                  Upgrade Your <span className="text-primary">Lifestyle</span>
                </h1>
                <p className="py-6 text-base-content/70 text-lg max-w-md">
                  Explore our curated collection of premium products delivered
                  straight to your door. Quality meets convenience.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link to="#products" className="btn btn-primary btn-lg">
                    <PackageIcon className="size-5" />
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>

          {/* Slide 2: Deals/Flash Sale */}
          <SwiperSlide>
            <div className="hero-content flex-col lg:flex-row-reverse gap-10 lg:gap-20 py-12 px-8">
              <div className="relative">
                <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full scale-110" />
                <img
                  src="/second.svg" // Look for "Sale" or "Discount" SVG
                  alt="Flash Sale"
                  className="relative h-64 lg:h-80 w-auto"
                />
              </div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-6xl font-mono font-extrabold leading-tight">
                  Exclusive <span className="text-primary">Flash Sale</span>
                </h1>
                <p className="py-6 text-base-content/70 text-lg max-w-md">
                  Get up to 50% off on top-rated tech, fashion, and home
                  essentials. Limited time offer!
                </p>
                <button className="btn btn-secondary btn-lg">
                  <SparklesIcon className="size-5" />
                  View Deals
                </button>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* PRODUCTS SECTION - Added mt-10 for separation from Hero */}
      <div className="mt-3">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <PackageIcon className="size-5 text-primary" />
          All Products
        </h2>

        {/* PAGINATION CONTROLS */}
        {!isLoading && (
          <ProductPagination
            currentPage={filters.page}
            setCurrentPage={setFilters}
            totalPages={totalPages}
          />
        )}

        {/* The Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Show a nice batch of 8 skeletons to fill the screen
            Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          ) : data?.products?.length === 0 ? (
            // Empty State
            <div className="col-span-full flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-muted/50">
              <PackageIcon className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding a new item to the store.
              </p>
              <Link to="/create" className="btn btn-primary">
                Create Product
              </Link>
            </div>
          ) : (
            // Success State
            data?.products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
