
import { Button } from "@/components/ui/button";
import { Library, Utensils, Wifi, Locate, Loader2 } from "lucide-react";
import { UserLocation } from "@/lib/geolocation";

const filterTypes = [
  { label: "All", value: "all", icon: null },
  { label: "Free", value: "free", icon: <Wifi className="w-4 h-4 mr-2" /> },
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
  const getFilterButtonClass = (isActive: boolean) => {
    if (isActive) {
      return "bg-blue-600 text-white shadow-md hover:bg-blue-700 transform hover:scale-105";
    }
    return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transform hover:scale-105";
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Nearby Filter */}
      <div className="flex justify-center">
        <Button
          variant={showNearbyOnly ? "default" : "outline"}
          onClick={onNearbyClick}
          disabled={isLoading}
          className={`transition-all duration-200 px-6 py-3 rounded-xl font-medium ${
            showNearbyOnly 
              ? "bg-blue-600 text-white shadow-md hover:bg-blue-700" 
              : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Locate className="w-4 h-4 mr-2" />
          )}
          {!location ? "Find Nearby" : showNearbyOnly ? `Within ${distanceRange}km` : "Show All Locations"}
        </Button>
      </div>
      
      {/* Category Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {filterTypes.map(filter => (
          <Button
            key={filter.value}
            variant="outline"
            onClick={() => onFilterChange(filter.value)}
            className={`transition-all duration-200 py-3 rounded-xl font-medium ${getFilterButtonClass(activeFilter === filter.value)}`}
          >
            {filter.icon}
            <span className="truncate">{filter.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;
