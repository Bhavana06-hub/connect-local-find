
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Wifi } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-8 h-8 text-blue-600" />,
    title: "Search & Filter",
    description: "Easily search for WiFi spots and filter by type, like cafes or libraries.",
  },
  {
    icon: <MapPin className="w-8 h-8 text-blue-600" />,
    title: "Find on Map",
    description: "View all locations on an interactive map to find one near you.",
  },
  {
    icon: <Wifi className="w-8 h-8 text-blue-600" />,
    title: "Get Connected",
    description: "Get directions, check amenities, and enjoy seamless internet access.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-12 md:py-20 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="text-gray-600 mt-2">Connecting you in three simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="bg-white border border-gray-200 text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="mx-auto bg-blue-50 rounded-full p-4 w-fit mb-4">
                  {step.icon}
                </div>
                <CardTitle className="text-gray-900">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
