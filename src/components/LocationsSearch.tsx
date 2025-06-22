
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
    <div className="relative mb-6">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Search locations, addresses, or types..."
          className="pl-12 pr-12 py-3 text-base border-2 border-gray-200 dark:border-gray-700 focus:border-primary transition-all duration-200 rounded-xl shadow-sm hover:shadow-md focus:shadow-lg"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {searchQuery && (
        <p className="text-sm text-muted-foreground mt-2 ml-1">
          Searching for "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default LocationsSearch;
