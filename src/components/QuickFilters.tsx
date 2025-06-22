
import { Button } from "@/components/ui/button";
import { Library, Utensils, Wifi, Locate, Loader2 } from "lucide-react";
import { UserLocation } from "@/lib/geolocation";

const filterTypes = [
  { label: "All", value: "all", icon: null },
  { label: "Free Only", value: "free", icon: null },
  { label: "Libraries", value: "Library", icon: <Library className="w-4 h-4 mr-2" /> },
  { label: "Cafes", value: "Cafe", icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: "Restaurants", value: "Restaurant", icon: <Utensils className="w-4 h-4 mr-2" /> },
];

interface QuickFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  showNearbyOnly: boolean;
  onNearbyClick: () => void;
  distanceRange: number;
  location: UserLocation | null;
  isLoading: boolean;
}

const QuickFilters = ({
  activeFilter,
  onFilterChange,
  showNearbyOnly,
  onNearbyClick,
  distanceRange,
  location,
  isLoading
}: QuickFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant={showNearbyOnly ? "default" : "outline"}
        size="sm"
        onClick={onNearbyClick}
        disabled={isLoading}
        className="flex items-center"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Locate className="w-4 h-4 mr-2" />
        )}
        {!location ? "Find Nearby" : showNearbyOnly ? `Within ${distanceRange}km` : "Show All"}
      </Button>
      
      {filterTypes.map(filter => (
        <Button
          key={filter.value}
          variant={activeFilter === filter.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(filter.value)}
          className="flex items-center"
        >
          {filter.icon} {filter.label}
        </Button>
      ))}
    </div>
  );
};

export default QuickFilters;
