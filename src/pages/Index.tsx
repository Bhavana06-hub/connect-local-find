
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import LocationCategories from "@/components/home/LocationCategories";
import FeaturedLocations from "@/components/home/FeaturedLocations";

const Index = () => {
  return (
    <div className="animate-fade-in-up">
      <Hero />
      <HowItWorks />
      <LocationCategories />
      <FeaturedLocations />
    </div>
  );
};

export default Index;
