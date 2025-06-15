
import { wifiSpots } from "@/data/wifi-spots";
import LocationCard from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedLocations = () => {
  // Get first 3 locations as "featured"
  const featured = wifiSpots.slice(0, 3);

  return (
    <section className="py-12 md:py-20 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Featured WiFi Spots</h2>
          <p className="text-white/80 mt-2">Some of our community's favorite places to connect.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((location) => (
            <LocationCard key={location.id} location={location} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
            <Link to="/locations">
              View All Locations <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLocations;
