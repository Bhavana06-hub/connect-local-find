
import { WiFiLocation } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Wifi, Utensils, Library, Building2, Trees, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const typeIcons = {
    Cafe: <Wifi className="w-4 h-4" />,
    Restaurant: <Utensils className="w-4 h-4" />,
    Library: <Library className="w-4 h-4" />,
    Mall: <Building2 className="w-4 h-4" />,
    Park: <Trees className="w-4 h-4" />,
    Other: <Wifi className="w-4 h-4" />,
    'Community Center': <Library className="w-4 h-4" />,
};

interface LocationCardProps {
  location: WiFiLocation;
}

const LocationCard = ({ location }: LocationCardProps) => {
  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <Card
      className={`mb-3 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 border-l-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-card-foreground ${
        location.isFree ? "border-green-400" : "border-amber-400"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{location.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
              {location.address}
            </p>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
              {location.hours || "Not specified"}
            </p>
          </div>
          <div className="flex flex-col items-end ml-4">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 mr-1" />
              <span className="font-bold">{location.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Badge variant={location.isFree ? "default" : "secondary"} className={location.isFree ? "bg-green-500/80 border-green-600 text-white" : "bg-amber-400/80 border-amber-500 text-amber-900"}>
            {location.isFree ? "Free" : "Paid"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {typeIcons[location.type] || <Wifi className="w-4 h-4" />}
            {location.type}
          </Badge>
        </div>
        <Button className="w-full mt-4 bg-primary/80 hover:bg-primary" size="sm" onClick={handleGetDirections}>
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
