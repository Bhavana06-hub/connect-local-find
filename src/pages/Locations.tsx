
import { useState, useMemo } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationCard from "@/components/LocationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Library, Utensils, Wifi, Locate, Loader2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { calculateDistance } from "@/lib/geolocation";

const filterTypes = [
  { label: "All", value: "all", icon: null },
  { label: "Free Only", value: "free", icon: null },
  { label: "Libraries", value: "Library", icon: <Library className="w-4 h-4 mr-2" /> },
  { label: "Cafes", value: "Cafe", icon: <Wifi className="w-4 h-4 mr-2" /> },
  { label: "Restaurants", value: "Restaurant", icon: <Utensils className="w-4 h-4 mr-2" /> },
];

const Locations = () => {
  const [allLocations] = useState<WiFiLocation[]>(wifiSpots);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const { location, isLoading, error, requestLocation } = useGeolocation();

  const locationsWithDistance = useMemo(() => {
    if (!location) return allLocations.map(loc => ({ ...loc, distance: undefined }));
    
    return allLocations.map(loc => ({
      ...loc,
      distance: calculateDistance(
        location.latitude,
        location.longitude,
        loc.latitude,
        loc.longitude
      )
    }));
  }, [allLocations, location]);

  const filteredLocations = useMemo(() => {
    let filtered = locationsWithDistance
      .filter((location) => {
        if (activeFilter === "all") return true;
        if (activeFilter === "free") return location.isFree;
        return location.type === activeFilter;
      })
      .filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (showNearbyOnly) {
      filtered = filtered.filter(loc => loc.distance !== undefined && loc.distance <= 5);
    }

    // Sort by distance if location is available
    if (location) {
      filtered.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return filtered;
  }, [locationsWithDistance, searchQuery, activeFilter, showNearbyOnly, location]);

  const handleNearbyClick = () => {
    if (!location) {
      requestLocation();
    } else {
      setShowNearbyOnly(!showNearbyOnly);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">All WiFi Locations</CardTitle>
          <p className="text-muted-foreground">Search and filter through all available spots.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={showNearbyOnly ? "default" : "outline"}
                size="sm"
                onClick={handleNearbyClick}
                disabled={isLoading}
                className="flex items-center"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Locate className="w-4 h-4 mr-2" />
                )}
                {!location ? "Find Nearby" : showNearbyOnly ? "Nearby (5km)" : "Show All"}
              </Button>
              {filterTypes.map(filter => (
                 <Button
                    key={filter.value}
                    variant={activeFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.value)}
                    className="flex items-center"
                  >
                   {filter.icon} {filter.label}
                  </Button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}. Please check your browser settings and try again.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <LocationCard 
                  key={location.id} 
                  location={location} 
                  distance={location.distance}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground py-10">
                <p>No locations found.</p>
                <p className="text-sm">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Locations;
