
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface LocationsPageHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  locationCount: number;
}

const filterButtons = [
  { label: "All", value: "all" },
  { label: "Free Only", value: "free" },
  { label: "Libraries", value: "Library" },
  { label: "Cafes", value: "Cafe" },
  { label: "Restaurants", value: "Restaurant" },
];

const LocationsPageHeader = ({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  locationCount
}: LocationsPageHeaderProps) => {
  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All WiFi Locations</h1>
          <p className="text-gray-600 text-lg">
            Find the perfect WiFi spot for your needs - {locationCount} locations available
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search locations, addresses, or types..."
              className="pl-12 pr-12 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-0 rounded-xl"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2 bg-gray-50 p-1 rounded-xl">
            {filterButtons.map((filter) => (
              <Button
                key={filter.value}
                variant={activeFilter === filter.value ? "default" : "ghost"}
                onClick={() => onFilterChange(filter.value)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeFilter === filter.value
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white"
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationsPageHeader;
