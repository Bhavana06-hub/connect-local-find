
import { WiFiLocation } from "@/lib/types";
import LocationCard from "@/components/LocationCard";
import { Skeleton } from "@/components/ui/skeleton";

interface LocationsListProps {
  locations: WiFiLocation[];
  onLocationClick: (location: WiFiLocation) => void;
  isFavorite: (locationId: number) => boolean;
  onToggleFavorite: (locationId: number) => void;
  isLoading?: boolean;
}

const LocationsListSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <LocationCard key={index} location={{} as WiFiLocation} isLoading={true} />
    ))}
  </div>
);

const LocationsList = ({ 
  locations, 
  onLocationClick, 
  isFavorite, 
  onToggleFavorite,
  isLoading 
}: LocationsListProps) => {
  if (isLoading) {
    return (
      <div className="max-h-[600px] overflow-y-auto">
        <LocationsListSkeleton />
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-12">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-4xl">📍</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">No locations found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or search terms to find more WiFi locations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
      <div className="animate-fade-in-up">
        {locations.map((location, index) => (
          <div 
            key={location.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <LocationCard 
              location={location} 
              distance={location.distance}
              isFavorite={isFavorite(location.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={() => onLocationClick(location)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsList;
