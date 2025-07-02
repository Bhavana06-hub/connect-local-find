
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="text-center py-20 md:py-32">
      <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight drop-shadow-md">
        Find Your Perfect WiFi Spot
      </h1>
      <p className="mt-4 text-lg md:text-xl text-white/80 max-w-3xl mx-auto drop-shadow-sm">
        Discover free and reliable WiFi hotspots in Visakhapatnam. Whether you need a quiet library, a bustling cafe, or a comfy restaurant, we've got you covered.
      </p>
      <div className="mt-8 flex justify-center">
        <Button asChild size="lg">
          <Link to="/locations">
            Explore Locations <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Hero;
