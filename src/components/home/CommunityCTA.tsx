
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CommunityCTA = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="bg-white/20 border-white/20 backdrop-blur-lg rounded-xl p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold text-white">Join Our Community</h2>
          <p className="text-white/80 mt-4 max-w-2xl mx-auto">
            Help fellow digital nomads and students find great places to work and study. Add a new WiFi spot you've discovered and contribute to our growing map!
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link to="/add-location">
                <PlusCircle className="mr-2 h-5 w-5" /> Add a New Spot
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityCTA;
