
import { WiFiLocation } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star, Navigation } from "lucide-react";

interface LocationGridCardProps {
  location: WiFiLocation;
  distance?: number;
  onClick?: () => void;
}

const LocationGridCard = ({ location, distance, onClick }: LocationGridCardProps) => {
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden border-0 shadow-sm bg-white"
      onClick={onClick}
    >
      {/* Colored border */}
      <div className={`h-1 w-full ${location.isFree ? "bg-green-500" : "bg-orange-500"}`} />
      
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {location.name}
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="font-medium text-sm">{location.rating.toFixed(1)}</span>
            </div>
            {distance !== undefined && (
              <span className="text-blue-600 font-medium text-sm">{distance} km</span>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600 flex items-start">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
            {location.address}
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0 text-gray-400" />
            {location.hours || "Hours not specified"}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <Badge 
            variant="outline" 
            className={`${
              location.isFree 
                ? "border-green-500 text-green-700 bg-green-50" 
                : "border-orange-500 text-orange-700 bg-orange-50"
            }`}
          >
            {location.isFree ? "Free WiFi" : "Paid WiFi"}
          </Badge>
          
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            {location.type}
          </Badge>
        </div>

        <Button 
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all duration-200" 
          onClick={handleGetDirections}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationGridCard;
