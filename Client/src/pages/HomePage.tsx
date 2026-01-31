import Hero from '@/components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import ImagesSection from '@/components/ImagesSection';
import BestSellingSection from '@/components/BestSellingSection';
import JobsSection from '@/components/JobsSection';
import JobsSponsor from '@/components/JobsSponsor';



const HomePage = () => {
  return (
    <div>
      <Hero />
      {/* <CategoriesSection /> */}
      <BestSellingSection />
      <ImagesSection />
      <JobsSponsor />
      <JobsSection />
    </div>
  );
};

export default HomePage;
