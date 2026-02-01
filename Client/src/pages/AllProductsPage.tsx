import { useState, useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import hero1 from "@/assets/hero1.png";
import hero2 from "@/assets/hero2.png";
import hero3 from "@/assets/hero3.png";
import hero4 from "@/assets/hero4.png";

// Mock categories data
const mockCategories = [
  { id: "1", title: "Electronics", count: 156 },
  { id: "2", title: "Clothing", count: 243 },
  { id: "3", title: "Home & Garden", count: 189 },
  { id: "4", title: "Sports & Outdoors", count: 127 },
  { id: "5", title: "Books", count: 98 },
  { id: "6", title: "Toys & Games", count: 134 },
  { id: "7", title: "Beauty & Health", count: 167 },
  { id: "8", title: "Automotive", count: 78 },
];

// Mock products data
const mockProducts = Array.from({ length: 48 }, (_, i) => ({
  id: String(i + 1),
  name: `Product ${i + 1}`,
  image: `https://images.unsplash.com/photo-${1523275335684 + i}?w=300&h=300&fit=crop`,
  price: Math.floor(Math.random() * 200) + 20,
  originalPrice: Math.floor(Math.random() * 300) + 100,
  currency: "USD",
  discountPercent: Math.floor(Math.random() * 50) + 10,
  averageRating: +(Math.random() * 2 + 3).toFixed(1),
  numOfReviews: Math.floor(Math.random() * 500) + 10,
  category:
    mockCategories[Math.floor(Math.random() * mockCategories.length)].title,
}));

const ITEMS_PER_PAGE = 8;

export default function AllProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const heroImages = [hero1, hero2, hero3, hero4];

  // Mock user and cart function
  const user = null;
  const addToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.includes(product.category),
      );
    }

    // Filter by price range
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1],
    );

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case "newest":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      default:
        // featured - keep original order
        break;
    }

    return filtered;
  }, [products, selectedCategories, priceRange, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, priceRange, searchQuery, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setSearchQuery("");
    setSortBy("featured");
  };

  const FilterSidebar = () => (
    <div className="space-y-6 px-6">
      {/* Search */}
      <div>
        <Label htmlFor="search" className="text-sm font-semibold mb-2 block">
          Search Products
        </Label>
        <Input
          id="search"
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Separator />

      {/* Categories */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Categories</h3>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCategories([])}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {mockCategories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.title)}
                onCheckedChange={() => handleCategoryToggle(category.title)}
              />
              <label
                htmlFor={`category-${category.id}`}
                className="text-sm flex-1 cursor-pointer flex items-center justify-between"
              >
                <span>{category.title}</span>
                <span className="text-xs text-muted-foreground">
                  ({category.count})
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear All Filters */}
      <Button
        variant="primary"
        size="sm"
        onClick={clearFilters}
        className="w-full"
      >
        <X className="w-4 h-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <>
      {/* Hero Ad Section */}
      <section className="px-4 sm:px-6 py-6 sm:py-12 mx-auto container flex items-stretch gap-5 min-h-[300px] sm:min-h-[500px]">
        <Swiper
          navigation={{
            prevEl: ".custom-prev-all",
            nextEl: ".custom-next-all",
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          modules={[Navigation, Autoplay]}
          className="mySwiper rounded-sm shadow-lg flex-1"
        >
          {heroImages.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Promotional banner ${index + 1}`}
                className="w-full h-full cursor-pointer object-cover"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </SwiperSlide>
          ))}

          <button
            className="custom-prev-all absolute cursor-pointer left-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
            aria-label="Previous slide"
          >
            <FaArrowLeft />
          </button>

          <button
            className="custom-next-all cursor-pointer absolute right-4 top-1/2 z-20 -translate-y-1/2 bg-white dark:bg-zinc-800 shadow-md p-2 rounded-full text-xl hover:bg-red-500 hover:text-white transition"
            aria-label="Next slide"
          >
            <FaArrowRight />
          </button>
        </Swiper>
        <div className="hidden lg:flex max-w-[20%] items-center cursor-pointer">
          <img
            src="/sp2.png"
            alt="Sponsored advertisement"
            className="w-full h-full object-cover rounded-sm shadow-lg"
            loading="lazy"
          />
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4 bg-card border rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-bold">Filters</h2>
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex  flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">
                  All Products
                </h1>
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedProducts.length} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-2 ">
                {/* Mobile Filter Button */}
                <Sheet
                  open={mobileFiltersOpen}
                  onOpenChange={setMobileFiltersOpen}
                >
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <SlidersHorizontal className="w-4 h-4 mr-2" />
                      Filters
                      {(selectedCategories.length > 0 || searchQuery) && (
                        <Badge
                          variant="destructive"
                          className="ml-2 px-1.5 py-0.5 text-xs"
                        >
                          {selectedCategories.length + (searchQuery ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                      </SheetTitle>
                      <SheetDescription>
                        Filter products by category, price, and more
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort By */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2  mb-6">
                <span className="text-sm font-medium">Active filters:</span>
                {selectedCategories.map((category) => (
                  <Badge
                    key={category}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary transition duration-300"
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                ))}
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setSearchQuery("")}
                  >
                    Search: "{searchQuery}"
                    <X className="w-3 h-3 ml-1" />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-auto p-0 text-xs"
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    user={user}
                    addToCart={addToCart}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && paginatedProducts.length > 0 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                   
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={
                            currentPage === pageNumber ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                          className="w-9 h-9"
                        >
                          {pageNumber}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
