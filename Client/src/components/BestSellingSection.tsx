import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import { Button } from "./ui/button";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { PiStarFourFill } from "react-icons/pi";
import { IoIosCart } from "react-icons/io";
import StarRating from "./ui/StarRating";
import { Link, useNavigate } from "react-router";
import Api from "@/lib/Api";
import { SkeletonCard } from "./SkeletonCard";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "./ProductCard";

const BestSellingSection = () => {
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  let navigate = useNavigate();
  const { addToCart } = useCart();
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setTimeout(() => {
        swiperRef.current.swiper.update();
      }, 100);
    }
  }, []);

  const fetchBestSellingProducts = async () => {
    try {
      const { data } = await Api.get("/product/bestSelling");
      setBestSellingProducts(data?.products);
      console.log(
        "Best selling products fetched successfully:",
        data?.products,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section className="mx-auto container px-6 py-12 ">
      <div className="heading mb-6 flex items-center justify-between">
        <h1 className="capitalize text-2xl font-bold">best selling</h1>
        <div className="flex items-center gap-3">
          <button className="best-selling-prev w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-orange-500 transition-all duration-200 cursor-pointer">
            <FaArrowLeft className="text-white" />
          </button>
          <button className="best-selling-next w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-orange-500 transition-all duration-200 cursor-pointer">
            <FaArrowRight className="text-white" />
          </button>
        </div>
      </div>
      <Swiper
        ref={swiperRef}
        onSlideChange={handleSlideChange}
        spaceBetween={30}
        modules={[Pagination, Navigation, Autoplay]}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".best-selling-next",
          prevEl: ".best-selling-prev",
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 5,
          },
        }}
        className="testimonial-swiper"
      >

        {loading
          ? [...Array(5)].map((_, i) => (
              <SwiperSlide key={i}>
                <SkeletonCard />
              </SwiperSlide>
            ))
          : bestSellingProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard
                  product={product}
                  user={user}
                  addToCart={addToCart}
                />
              </SwiperSlide>
            ))}
      </Swiper>
      <div className="">
        <Link to="/products/best-selling">  
          <Button
           size="lg"
           className="mt-8 mx-auto bg-primary hover:bg-primary/20 flex items-center gap-2">
            View All Best Selling Products
            <IoIosCart className="h-5 w-5" />
          </Button>
        </Link>
      </div>

    
    </section>
  );
};

export default BestSellingSection;
