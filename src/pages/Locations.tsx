
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
            <LocationsHeader locationCount={filteredLocations.length} />
            <CardContent>
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
            <LocationsList
              locations={filteredLocations}
              onLocationClick={setSelectedLocation}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          )}
        </div>

        {/* Map */}
        <div className="lg:col-span-2">
          <LocationsMainContent
            showMap={showMap}
            filteredLocations={filteredLocations}
            userLocation={location}
            onLocationSelect={setSelectedLocation}
          />
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
