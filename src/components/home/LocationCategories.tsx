
import { Card, CardContent } from "@/components/ui/card";
import { Library, Utensils, Wifi, Building, Park, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  { label: "Cafes", value: "Cafe", icon: <Wifi className="w-10 h-10 text-white" /> },
  { label: "Libraries", value: "Library", icon: <Library className="w-10 h-10 text-white" /> },
  { label: "Restaurants", value: "Restaurant", icon: <Utensils className="w-10 h-10 text-white" /> },
  { label: "Malls", value: "Mall", icon: <ShoppingBag className="w-10 h-10 text-white" /> },
  { label: "Parks", value: "Park", icon: <Park className="w-10 h-10 text-white" /> },
  { label: "Community Centers", value: "Community Center", icon: <Building className="w-10 h-10 text-white" /> },
];

const LocationCategories = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Explore by Category</h2>
          <p className="text-white/80 mt-2">Find the perfect type of spot for your needs.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link to="/locations" key={category.value}>
              <Card className="group bg-white/20 border-white/20 backdrop-blur-lg text-white shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="group-hover:scale-110 transition-transform duration-300">{category.icon}</div>
                  <h3 className="font-semibold text-lg">{category.label}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationCategories;
