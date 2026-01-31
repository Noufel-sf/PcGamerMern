import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import StarRating from "@/components/ui/StarRating";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaStar, FaShippingFast, FaShieldAlt } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { Heart, ChevronLeft, ChevronRight, MapPin, Mail, Phone, Store } from "lucide-react";
import axiosInstance from "@/lib/Api";
import { Spinner } from "./ui/Spinner";
import toast from "react-hot-toast";
import { ButtonLoading } from "./ui/ButtonLoading";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { productThumbnails, shopOwnerInfo } from "@/data";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, Zoom } from "swiper/modules";
import "swiper/css";
import { fetchSingleProduct } from "@/Services/products";
import { useQuery } from '@tanstack/react-query';

import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/zoom";




const SingleProduct = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  let navigate = useNavigate();

  const {
    data: singleProduct,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['product', id], 
    queryFn: () => id ? fetchSingleProduct(id) : Promise.reject('No ID'),
    enabled: !!id, 
  });

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(singleProduct?.id);
  };

  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axiosInstance.post("/review", {
        rating,
        comment,
        productId: id,
      });
      toast.success(response.data.message);
      setRating(0);
      setComment("");
      refetch();
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  if (isError) {
    return (
      <div className="container mx-auto text-center py-16">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          404 - Product Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the product you are looking for does not exist.
        </p>
        <Button asChild variant="default" size="default" className="">
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="container mx-auto flex justify-center items-center py-16"><Spinner size="md" show={true} className="">Loading...</Spinner></div>;
  }

  return (
    <section className="mx-auto container px-4 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/allproducts" className="hover:text-foreground transition">
          Categories
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">
          {singleProduct?.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {/* Main Swiper */}
          <div className="relative group">
            <Swiper
              spaceBetween={10}
              navigation={{
                nextEl: ".swiper-button-next-custom",
                prevEl: ".swiper-button-prev-custom",
              }}
              thumbs={{
                swiper:
                  thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
              }}
              modules={[Navigation, Thumbs, Zoom]}
              className="w-full aspect-square rounded-lg border border-border bg-background"
            >
              {productThumbnails.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <Card className=" flex items-center justify-center h-full p-8">
                    <img
                      src={img}
                      className="w-full lg:w-2/3 object-contain "
                      alt={`${singleProduct?.name}-${idx}`}
                    />
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronLeft className="w-5 h-5 cursor-pointer" />
            </button>
            <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-700">
              <ChevronRight className="w-5 h-5 cursor-pointer" />
            </button>
          </div>

          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={5}
            watchSlidesProgress={true}
            modules={[Thumbs]}
            className="w-full"
          >
            {productThumbnails.map((img, idx) => (
              <SwiperSlide key={idx}>
                <Card className="cursor-pointer h-24 flex items-center justify-center p-2 hover:border-purple-500 transition">
                  <img
                    src={img}
                    alt={`thumbnail-${idx}`}
                    className="w-full h-full object-contain"
                  />
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>

      
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              {singleProduct?.name}
            </h1>
            <p>{singleProduct?.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit Lorem ipsum dolor sit amet, consectetur adipiscing elit  Lorem ipsum dolor sit amet, consectetur adipiscing elit  Lorem ipsum dolor sit amet, consectetur adipiscing elit ."} </p>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <StarRating rating={singleProduct?.averageRating} />
                <span className="text-sm font-medium">
                  {singleProduct?.averageRating?.toFixed(1) || "0.0"}
                </span>
               
              </div>
              <Badge variant="secondary" className="text-xs">
               {singleProduct?.stock || 0} In the Stock
              </Badge>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-orange-600">
              ${singleProduct?.price}
            </span>
            {singleProduct?.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                ${singleProduct?.originalPrice}
              </span>
            )}
          </div>

          <Separator className="" />

          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <FaShippingFast className="text-green-600 text-xl flex-shrink-0" />
              <span className="font-medium">FREE Returns & Fast Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaShieldAlt className="text-blue-600 text-xl flex-shrink-0" />
              <span className="font-medium">All prices include VAT</span>
            </div>
          </div>

          <Separator className="" />

          {/* Shop Owner Information */}
          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Store className="h-5 w-5 text-purple-600" />
                <h3 className="font-bold text-lg">{shopOwnerInfo.name}</h3>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{shopOwnerInfo.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`mailto:${shopOwnerInfo.email}`} className="text-muted-foreground hover:text-purple-600 transition">
                    {shopOwnerInfo.email}
                  </a>
                </div>
                
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <a href={`tel:${shopOwnerInfo.phone}`} className="text-muted-foreground hover:text-purple-600 transition">
                    {shopOwnerInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          <Separator className="" />

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex  sm:flex-row gap-3">
              <Button
                variant="default"
                size="lg"
                className="flex-1 text-base font-semibold"
                onClick={handleAddToCart}
              >
                <IoCartOutline className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="secondary"
                className="flex-1 text-base font-semibold"
              >
                Buy Now
              </Button>
            </div>

            <div className="flex gap-3">
              <Button size="lg" variant="outline" className="flex-1">
                <Heart className="mr-2 h-5 w-5" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        <div className="space-y-8">
          {/* Write Review Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-bold">Write a Review</h3>

              {/* Rating Stars */}
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <FaStar
                      size={28}
                      className={`cursor-pointer transition-colors ${
                        star <= (hover || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                className="w-full p-3 border rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Share your thoughts about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
              />

              {loading ? (
                <ButtonLoading />
              ) : (
                <Button type="submit" variant="default" size="lg" className="w-full">
                  Submit Review
                </Button>
              )}
            </form>
          </Card>

          {/* Existing Reviews */}
          <div className="space-y-4">
            {singleProduct?.reviews?.length > 0 ? (
              singleProduct?.reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">
                        {review.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, index) => (
                        <FaStar
                          key={index}
                          size={16}
                          className={
                            index < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-base leading-relaxed">{review.comment}</p>
                </Card>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-12 text-lg">
                No reviews yet. Be the first to review this product!
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleProduct;
