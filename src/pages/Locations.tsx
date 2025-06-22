
import { useState, useMemo } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationDetailsModal from "@/components/LocationDetailsModal";
import AdvancedFilters from "@/components/AdvancedFilters";
import LocationsHeader from "@/components/LocationsHeader";
import LocationsSearch from "@/components/LocationsSearch";
import ViewToggle from "@/components/ViewToggle";
import QuickFilters from "@/components/QuickFilters";
import LocationsList from "@/components/LocationsList";
import LocationsMainContent from "@/components/LocationsMainContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { calculateDistance } from "@/lib/geolocation";

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
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  
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
    setIsLoadingLocations(true);
    
    // Simulate loading delay for better UX
    setTimeout(() => setIsLoadingLocations(false), 300);
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <LocationsHeader locationCount={filteredLocations.length} />
              <CardContent className="space-y-6">
                <LocationsSearch 
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                <ViewToggle 
                  showMap={showMap}
                  onToggleView={setShowMap}
                />

                <QuickFilters
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  showNearbyOnly={showNearbyOnly}
                  onNearbyClick={handleNearbyClick}
                  distanceRange={distanceRange}
                  location={location}
                  isLoading={isLoading}
                />

                {/* Enhanced Advanced Filters Toggle */}
                <Button
                  variant={showFilters ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-full transition-all duration-200 ${
                    showFilters 
                      ? "bg-primary shadow-lg hover:shadow-xl transform hover:scale-105" 
                      : "border-2 hover:border-primary hover:scale-105 transform"
                  }`}
                >
                  <Settings2 className="w-4 h-4 mr-2" />
                  {showFilters ? 'Hide' : 'Show'} Advanced Filters
                </Button>

                {showFilters && (
                  <div className="animate-fade-in-up">
                    <AdvancedFilters
                      distanceRange={distanceRange}
                      onDistanceChange={setDistanceRange}
                      minRating={minRating}
                      onRatingChange={setMinRating}
                      showFavoritesOnly={showFavoritesOnly}
                      onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      hasUserLocation={!!location}
                    />
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 animate-fade-in-up">
                    <strong>Location Error:</strong> {error}. Please check your browser settings and try again.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Enhanced Location List */}
            {!showMap && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-4">
                  <LocationsList
                    locations={filteredLocations}
                    onLocationClick={setSelectedLocation}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    isLoading={isLoadingLocations}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Map/Content Area */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <LocationsMainContent
                showMap={showMap}
                filteredLocations={filteredLocations}
                userLocation={location}
                onLocationSelect={setSelectedLocation}
              />
            </div>
          </div>
        </div>

        {/* Enhanced Location Details Modal */}
        <LocationDetailsModal
          location={selectedLocation}
          isOpen={!!selectedLocation}
          onClose={() => setSelectedLocation(null)}
          distance={selectedLocation?.distance}
          isFavorite={selectedLocation ? isFavorite(selectedLocation.id) : false}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
};

export default Locations;
