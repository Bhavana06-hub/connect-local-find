
import { WiFiLocation } from "@/lib/types";
import LocationCard from "@/components/LocationCard";

interface LocationsListProps {
  locations: WiFiLocation[];
  onLocationClick: (location: WiFiLocation) => void;
  isFavorite: (locationId: number) => boolean;
  onToggleFavorite: (locationId: number) => void;
}

const LocationsList = ({ 
  locations, 
  onLocationClick, 
  isFavorite, 
  onToggleFavorite 
}: LocationsListProps) => {
  if (locations.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>No locations found.</p>
        <p className="text-sm">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[600px] overflow-y-auto space-y-3">
      {locations.map((location) => (
        <LocationCard 
          key={location.id} 
          location={location} 
          distance={location.distance}
          isFavorite={isFavorite(location.id)}
          onToggleFavorite={onToggleFavorite}
          onClick={() => onLocationClick(location)}
        />
      ))}
    </div>
  );
};

export default LocationsList;
