
import { Button } from "@/components/ui/button";
import { Library, Utensils, Wifi, Locate, Loader2 } from "lucide-react";
import { UserLocation } from "@/lib/geolocation";

const filterTypes = [
  { label: "All", value: "all", icon: null, color: "default" },
  { label: "Free Only", value: "free", icon: null, color: "green" },
  { label: "Libraries", value: "Library", icon: <Library className="w-4 h-4 mr-2" />, color: "blue" },
  { label: "Cafes", value: "Cafe", icon: <Wifi className="w-4 h-4 mr-2" />, color: "purple" },
  { label: "Restaurants", value: "Restaurant", icon: <Utensils className="w-4 h-4 mr-2" />, color: "orange" },
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
  const getFilterButtonClass = (isActive: boolean, color: string) => {
    if (isActive) {
      const colorClasses = {
        default: "bg-primary text-primary-foreground shadow-lg",
        green: "bg-green-500 text-white shadow-lg shadow-green-200",
        blue: "bg-blue-500 text-white shadow-lg shadow-blue-200",
        purple: "bg-purple-500 text-white shadow-lg shadow-purple-200",
        orange: "bg-orange-500 text-white shadow-lg shadow-orange-200"
      };
      return `${colorClasses[color]} transform hover:scale-105`;
    }
    return "bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-105 transform";
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Nearby Filter */}
      <div className="flex justify-center">
        <Button
          variant={showNearbyOnly ? "default" : "outline"}
          size="sm"
          onClick={onNearbyClick}
          disabled={isLoading}
          className={`transition-all duration-200 ${
            showNearbyOnly 
              ? "bg-primary shadow-lg hover:shadow-xl transform hover:scale-105" 
              : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:scale-105 transform"
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {filterTypes.map(filter => (
          <Button
            key={filter.value}
            variant="outline"
            size="sm"
            onClick={() => onFilterChange(filter.value)}
            className={`transition-all duration-200 ${getFilterButtonClass(activeFilter === filter.value, filter.color)} font-medium`}
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
