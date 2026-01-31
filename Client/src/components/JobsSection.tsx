import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, DollarSign, Clock, Eye } from 'lucide-react';
import JobCard from './JobCard';
import { jobsOfTheDay } from '@/data';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const JobsSection = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setTimeout(() => {
        swiperRef.current.swiper.update();
      }, 100);
    }
  }, []);

  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="max-w-4xl">
            <h2 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-6">
              Featured Opportunities
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
              Discover top tech jobs in Algeria. Apply now and take your career to
              the next level.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="jobs-prev w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-orange-500 transition-all duration-200 cursor-pointer">
              <FaArrowLeft className="text-white" />
            </button>
            <button className="jobs-next w-8 h-8 px-2 rounded-lg flex items-center justify-center bg-orange-500 transition-all duration-200 cursor-pointer">
              <FaArrowRight className="text-white" />
            </button>
          </div>
        </div>

        {/* Jobs Swiper */}
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
            nextEl: '.jobs-next',
            prevEl: '.jobs-prev',
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
              slidesPerView: 4,
            },
          }}
          className="mb-12"
        >
          {jobsOfTheDay.map((job) => (
            <SwiperSlide key={job.id}>
              <JobCard job={job} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="primary">
            Browse All Jobs
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default JobsSection;
