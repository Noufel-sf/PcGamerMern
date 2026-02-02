import { useRef, memo } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import image1 from '@/assets/image1.webp';
import image2 from '@/assets/image2.webp';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { sponsoredStores } from '@/data';
import 'swiper/css';
import 'swiper/css/navigation';

const imageMap: Record<string, string> = {
  '/src/assets/image1.webp': image1,
  '/src/assets/image2.webp': image2,
};

const SponsoredSection = () => {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="mx-auto container px-6 py-12" aria-labelledby="sponsored-heading">
      <div className="heading mb-6 flex items-center justify-between">
        <h2 id="sponsored-heading" className="text-2xl font-bold">
          Sponsored Stores
        </h2>
        <div className="flex items-center gap-3" role="group" aria-label="Carousel navigation">
          <button 
            className="sponsored-prev w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/20 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Previous sponsored store"
            type="button"
          >
            <FaArrowLeft className="text-white" aria-hidden="true" />
          </button>
          <button 
            className="sponsored-next w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-primary hover:bg-primary/20 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Next sponsored store"
            type="button"
          >
            <FaArrowRight className="text-white" aria-hidden="true" />
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={30}
        modules={[Navigation, Autoplay]}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop={true}
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
        a11y={{
          enabled: true,
          prevSlideMessage: 'Previous sponsored store',
          nextSlideMessage: 'Next sponsored store',
        }}
      >
        {sponsoredStores.map((store, index) => (
          <SwiperSlide key={store.id}>
            <article
              className="relative w-full rounded-xl py-12 lg:py-0 min-h-[400px] overflow-hidden"
              style={{ backgroundColor: store.bgColor }}
              aria-labelledby={`store-title-${store.id}`}
            >
              <img
                src={imageMap[store.image] || store.image}
                alt={`${store.title} - ${store.description}`}
                loading={index < 2 ? 'eager' : 'lazy'}
                className="rounded-xl object-cover w-full h-full absolute inset-0"
                width="600"
                height="400"
              />
              <div className="text text-center m-auto relative lg:absolute top-5 lg:top-14 left-0 lg:left-5 w-50 md:w-60 z-10">
                <h3
                  id={`store-title-${store.id}`}
                  className="text-xl font-bold mb-2"
                  style={{ color: store.textColor }}
                >
                  {store.title}
                </h3>
                <p
                  className="text-sm md:text-base my-3"
                  style={{ color: store.textColor }}
                >
                  {store.description}
                </p>
               
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default memo(SponsoredSection);
