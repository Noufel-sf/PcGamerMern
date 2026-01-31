import React, { useRef, useState } from 'react';
import image1 from '@/assets/image1.webp';
import image2 from '@/assets/image2.webp';
import MagicButton from './ui/MagicButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { sponsoredStores } from '@/data';
import 'swiper/css';
import 'swiper/css/navigation';

const ImagesSection = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  const imageMap = {
    '/src/assets/image1.webp': image1,
    '/src/assets/image2.webp': image2,
  };

  return (
    <section className="mx-auto container px-6 py-12">
      <div className="heading mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sponsored Stores</h1>
        <div className="flex items-center gap-3">
          <button className="sponsored-prev w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-orange-500 transition-all duration-200 cursor-pointer">
            <FaArrowLeft className="text-white" />
          </button>
          <button className="sponsored-next w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-orange-500 transition-all duration-200 cursor-pointer">
            <FaArrowRight className="text-white" />
          </button>
        </div>
      </div>

      <Swiper
        ref={swiperRef}
        onSlideChange={handleSlideChange}
        spaceBetween={30}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.sponsored-next',
          prevEl: '.sponsored-prev',
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
        }}
        className="sponsored-swiper"
      >
        {sponsoredStores.map((store) => (
          <SwiperSlide key={store.id}>
            <div
              className="relative w-full rounded-xl py-12 lg:py-0 min-h-[400px]"
              style={{ backgroundColor: store.bgColor }}
            >
              <img
                src={imageMap[store.image]}
                alt={store.title}
                className="rounded-xl object-cover w-full h-full absolute inset-0"
              />
              <div className="text text-center m-auto relative lg:absolute top-5 lg:top-14 left-0 lg:left-5 w-50 md:w-60 z-10">
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: store.textColor }}
                >
                  {store.title}
                </h2>
                <p
                  className="text-sm md:text-base my-3"
                  style={{ color: store.textColor }}
                >
                  {store.description}
                </p>
                <MagicButton title="Learn more" />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default ImagesSection;
