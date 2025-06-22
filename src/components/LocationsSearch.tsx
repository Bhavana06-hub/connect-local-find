
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationsSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const LocationsSearch = ({ searchQuery, onSearchChange }: LocationsSearchProps) => {
  const clearSearch = () => {
    onSearchChange("");
  };

  return (
    <div className="mb-8">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
        <Input
          placeholder="Search locations, addresses, or types..."
          className="pl-12 pr-12 py-4 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-blue-600 focus:ring-0 transition-all duration-200 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg bg-white dark:bg-gray-800"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <p className="text-sm text-gray-500 mt-3 ml-1">
          Searching for "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default LocationsSearch;
