
import React, { useState, useMemo, useCallback } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationDetailsModal from "@/components/LocationDetailsModal";
import LocationsPageHeader from "@/components/LocationsPageHeader";
import LocationsGrid from "@/components/LocationsGrid";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { calculateDistance } from "@/lib/geolocation";

const Locations = () => {
  const [allLocations] = useState<WiFiLocation[]>(wifiSpots);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<WiFiLocation | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  
  const { location, requestLocation } = useGeolocation();
  const { toggleFavorite, isFavorite } = useFavorites();

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
    
    setTimeout(() => setIsLoadingLocations(false), 300);
    
    let filtered = locationsWithDistance
      .filter((location) => {
        if (activeFilter === "free") return location.isFree;
        if (activeFilter !== "all") return location.type === activeFilter;
        return true;
      })
      .filter((location) =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (location) {
      filtered.sort((a, b) => {
        if (a.distance === undefined) return 1;
        if (b.distance === undefined) return -1;
        return a.distance - b.distance;
      });
    }

    return filtered;
  }, [locationsWithDistance, searchQuery, activeFilter, location]);

  // Request location on component mount if not available
  React.useEffect(() => {
    if (!location) {
      requestLocation();
    }
  }, [location, requestLocation]);

  return (
    <div className="min-h-screen bg-gray-50">
      <LocationsPageHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        locationCount={filteredLocations.length}
      />

      <div className="container mx-auto px-6 py-8">
        <LocationsGrid
          locations={filteredLocations}
          onLocationClick={setSelectedLocation}
          isLoading={isLoadingLocations}
        />
      </div>

      {/* Modal */}
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
