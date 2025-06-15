
import { WiFiLocation } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Wifi, Utensils, Library, Building2, Trees } from "lucide-react";

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
  onClick?: () => void;
}

const LocationCard = ({ location, onClick }: LocationCardProps) => {
  return (
    <Card
      className={`mb-3 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-l-4 ${
        location.isFree ? "border-green-500" : "border-yellow-500"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h3 className="font-bold text-lg">{location.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-2" />
              {location.address}
            </p>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Clock className="w-4 h-4 mr-2" />
              {location.hours || "Not specified"}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1" />
              <span className="font-bold">{location.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant={location.isFree ? "default" : "secondary"} className={location.isFree ? "bg-green-600" : "bg-yellow-500 text-black"}>
            {location.isFree ? "Free" : "Paid"}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            {typeIcons[location.type] || <Wifi className="w-4 h-4" />}
            {location.type}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
