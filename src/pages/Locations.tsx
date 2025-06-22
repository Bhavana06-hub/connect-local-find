
import { useState, useMemo } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationCard from "@/components/LocationCard";
import LocationDetailsModal from "@/components/LocationDetailsModal";
import InteractiveMap from "@/components/InteractiveMap";
import AdvancedFilters from "@/components/AdvancedFilters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Library, Utensils, Wifi, Locate, Loader2, Map, List } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
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
  const [distanceRange, setDistanceRange] = useState(5);
  const [minRating, setMinRating] = useState(1);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<WiFiLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const { location, isLoading, error, requestLocation } = useGeolocation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const locationsWithDistance = useMemo(() => {
    if (!location) return allLocations;
    
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
        // Basic filters
        if (activeFilter === "free") return location.isFree;
        if (activeFilter !== "all") return location.type === activeFilter;
        return true;
      })
      .filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

    // Advanced filters
    if (showNearbyOnly && location) {
      filtered = filtered.filter(loc => loc.distance !== undefined && loc.distance <= distanceRange);
    }

    if (minRating > 1) {
      filtered = filtered.filter(loc => loc.rating >= minRating);
    }

    if (showFavoritesOnly) {
      filtered = filtered.filter(loc => favorites.includes(loc.id));
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
  }, [locationsWithDistance, searchQuery, activeFilter, showNearbyOnly, distanceRange, minRating, showFavoritesOnly, location, favorites]);

  const handleNearbyClick = () => {
    if (!location) {
      requestLocation();
    } else {
      setShowNearbyOnly(!showNearbyOnly);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold tracking-tight">WiFi Locations</CardTitle>
              <p className="text-muted-foreground">
                Found {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''}
              </p>
            </CardHeader>
            <CardContent>
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* View Toggle */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={!showMap ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMap(false)}
                  className="flex-1"
                >
                  <List className="w-4 h-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={showMap ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowMap(true)}
                  className="flex-1"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Map
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
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
                  {!location ? "Find Nearby" : showNearbyOnly ? `Within ${distanceRange}km` : "Show All"}
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

              {/* Advanced Filters Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full mb-4"
              >
                {showFilters ? 'Hide' : 'Show'} Advanced Filters
              </Button>

              {showFilters && (
                <AdvancedFilters
                  distanceRange={distanceRange}
                  onDistanceChange={setDistanceRange}
                  minRating={minRating}
                  onRatingChange={setMinRating}
                  showFavoritesOnly={showFavoritesOnly}
                  onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  hasUserLocation={!!location}
                />
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                  {error}. Please check your browser settings and try again.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location List */}
          {!showMap && (
            <div className="max-h-[600px] overflow-y-auto space-y-3">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <LocationCard 
                    key={location.id} 
                    location={location} 
                    distance={location.distance}
                    isFavorite={isFavorite(location.id)}
                    onToggleFavorite={toggleFavorite}
                    onClick={() => setSelectedLocation(location)}
                  />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  <p>No locations found.</p>
                  <p className="text-sm">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] lg:h-[calc(100vh-8rem)]">
            <CardContent className="p-0 h-full">
              {showMap ? (
                <InteractiveMap
                  locations={filteredLocations}
                  userLocation={location}
                  onLocationSelect={setSelectedLocation}
                />
              ) : (
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold">Location Details</h3>
                    <p className="text-sm text-muted-foreground">
                      Click on any location card to view details, or switch to map view
                    </p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Select a location to view details</p>
                      <p className="text-sm">or switch to map view to see all locations</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location Details Modal */}
      <LocationDetailsModal
        location={selectedLocation}
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        distance={selectedLocation?.distance}
        isFavorite={selectedLocation ? isFavorite(selectedLocation.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Locations;
