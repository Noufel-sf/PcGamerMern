import Hero from '@/components/Hero';
import CategoriesSection from '@/components/CategoriesSection';
import BestSellingSection from '@/components/BestSellingSection';
import JobsSection from '@/components/JobsSection';
import SponsoredSection from '@/components/SponsoredSection';
import JobsSponsor from '@/components/JobsSponsor';



const HomePage = () => {
  return (
    <div>
      <Hero />
      <BestSellingSection />
      <SponsoredSection />
      <JobsSponsor />
      <JobsSection />
    </div>
  );
};

export default HomePage;
