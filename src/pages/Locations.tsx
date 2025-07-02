
import React, { useState, useMemo, useCallback } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import LocationDetailsModal from "@/components/LocationDetailsModal";
import LocationsPageHeader from "@/components/LocationsPageHeader";
import LocationsGrid from "@/components/LocationsGrid";
import InteractiveMap from "@/components/InteractiveMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { calculateDistance } from "@/lib/geolocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List } from "lucide-react";

const Locations = () => {
  const [allLocations] = useState<WiFiLocation[]>(wifiSpots);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<WiFiLocation | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [activeTab, setActiveTab] = useState("static");
  
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="static" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Curated Locations
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Live Map
            </TabsTrigger>
          </TabsList>

          <TabsContent value="static">
            <LocationsGrid
              locations={filteredLocations}
              onLocationClick={setSelectedLocation}
              isLoading={isLoadingLocations}
            />
          </TabsContent>

          <TabsContent value="map">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <InteractiveMap
                  locations={filteredLocations}
                  userLocation={location}
                  onLocationSelect={setSelectedLocation}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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
