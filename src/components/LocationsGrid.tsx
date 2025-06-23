
import { WiFiLocation } from "@/lib/types";
import LocationGridCard from "@/components/LocationGridCard";

interface LocationsGridProps {
  locations: WiFiLocation[];
  onLocationClick: (location: WiFiLocation) => void;
  isLoading?: boolean;
}

const LocationsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 9 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-1 bg-gray-200 mb-6 rounded"></div>
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-6"></div>
        <div className="flex gap-2 mb-6">
          <div className="h-6 w-20 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    ))}
  </div>
);

const LocationsGrid = ({ locations, onLocationClick, isLoading }: LocationsGridProps) => {
  if (isLoading) {
    return <LocationsGridSkeleton />;
  }

  if (locations.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="max-w-sm mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">📍</span>
          </div>
          <h3 className="text-2xl font-semibold mb-3 text-gray-900">No locations found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or search terms to find more WiFi locations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {locations.map((location, index) => (
        <div 
          key={location.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <LocationGridCard 
            location={location} 
            distance={location.distance}
            onClick={() => onLocationClick(location)}
          />
        </div>
      ))}
    </div>
  );
};

export default LocationsGrid;
