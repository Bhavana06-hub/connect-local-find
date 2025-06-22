
import { WiFiLocation } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Star, Wifi, Utensils, Library, Building2, Trees, Navigation, Locate, Heart } from "lucide-react";

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
  distance?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (locationId: number) => void;
  onClick?: () => void;
  isLoading?: boolean;
}

const LocationCardSkeleton = () => (
  <Card className="mb-4 overflow-hidden">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const LocationCard = ({ location, distance, isFavorite, onToggleFavorite, onClick, isLoading }: LocationCardProps) => {
  if (isLoading) {
    return <LocationCardSkeleton />;
  }

  const handleGetDirections = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { latitude, longitude } = location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(location.id);
    }
  };

  return (
    <Card
      className={`group mb-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer overflow-hidden border-0 shadow-sm ${
        isFavorite ? "ring-2 ring-red-100 bg-red-50/30" : "hover:shadow-xl"
      }`}
      onClick={onClick}
    >
      {/* Clean accent bar */}
      <div className={`h-1 w-full ${location.isFree ? "bg-green-500" : "bg-blue-500"}`} />
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">
              {location.name}
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="font-medium text-sm">{location.rating.toFixed(1)}</span>
              </div>
              {distance !== undefined && (
                <div className="flex items-center text-blue-600 font-medium text-sm">
                  <Locate className="w-4 h-4 mr-1" />
                  {distance} km
                </div>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            className={`h-10 w-10 transition-all duration-200 ${
              isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-400"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <MapPin className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
            {location.address}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
            <Clock className="w-4 h-4 mr-3 flex-shrink-0 text-gray-400" />
            {location.hours || "Hours not specified"}
          </p>
        </div>

        {/* Clean badges */}
        <div className="flex items-center gap-3 mb-6">
          <Badge 
            variant={location.isFree ? "default" : "secondary"} 
            className={`${
              location.isFree 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } font-medium px-3 py-1`}
          >
            <Wifi className="w-3 h-3 mr-1" />
            {location.isFree ? "Free WiFi" : "Paid WiFi"}
          </Badge>
          
          <Badge variant="outline" className="flex items-center gap-1 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
            {typeIcons[location.type] || <Wifi className="w-4 h-4" />}
            <span className="text-xs font-medium">{location.type}</span>
          </Badge>
        </div>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-md" 
          onClick={handleGetDirections}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Get Directions
        </Button>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
