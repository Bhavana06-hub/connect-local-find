import React, { useState, useMemo, useCallback } from "react";
import { wifiSpots } from "@/data/wifi-spots";
import { WiFiLocation } from "@/lib/types";
import { RealWiFiHotspot } from "@/lib/wifiApi";
import LocationDetailsModal from "@/components/LocationDetailsModal";
import LocationsPageHeader from "@/components/LocationsPageHeader";
import LocationsGrid from "@/components/LocationsGrid";
import RealTimeWiFiControls from "@/components/RealTimeWiFiControls";
import RealTimeWiFiMap from "@/components/RealTimeWiFiMap";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useFavorites } from "@/hooks/useFavorites";
import { calculateDistance } from "@/lib/geolocation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List, Satellite } from "lucide-react";
import { Button } from "@/components/ui/button";

const Locations = () => {
  const [allLocations] = useState<WiFiLocation[]>(wifiSpots);
  const [realTimeHotspots, setRealTimeHotspots] = useState<RealWiFiHotspot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState<WiFiLocation | null>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<RealWiFiHotspot | null>(null);
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

  const handleRealTimeHotspotsUpdate = useCallback((hotspots: RealWiFiHotspot[]) => {
    setRealTimeHotspots(hotspots);
  }, []);

  const handleHotspotSelect = useCallback((hotspot: RealWiFiHotspot) => {
    setSelectedHotspot(hotspot);
  }, []);

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
        locationCount={activeTab === "static" ? filteredLocations.length : realTimeHotspots.length}
      />

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="static" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Curated Locations
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Satellite className="w-4 h-4" />
              Real-Time Scan
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

          <TabsContent value="realtime" className="space-y-6">
            <RealTimeWiFiControls
              userLocation={location}
              onHotspotsUpdate={handleRealTimeHotspotsUpdate}
            />
            
            {realTimeHotspots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Real-Time WiFi Hotspots</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {realTimeHotspots.map((hotspot, index) => (
                      <Card 
                        key={`${hotspot.bssid}-${index}`}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleHotspotSelect(hotspot)}
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{hotspot.ssid}</h3>
                          <p className="text-sm text-gray-600 mb-1">{hotspot.venue}</p>
                          <p className="text-xs text-gray-500 mb-2">{hotspot.address}</p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              hotspot.encryption === 'none' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {hotspot.encryption === 'none' ? 'Open' : 'Secured'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {hotspot.source === 'wigle' ? 'Wigle' : 'OSM'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="map">
            <Card className="h-[600px]">
              <CardContent className="p-0 h-full">
                <RealTimeWiFiMap
                  hotspots={realTimeHotspots}
                  userLocation={location}
                  onHotspotSelect={handleHotspotSelect}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <LocationDetailsModal
        location={selectedLocation}
        isOpen={!!selectedLocation}
        onClose={() => setSelectedLocation(null)}
        distance={selectedLocation?.distance}
        isFavorite={selectedLocation ? isFavorite(selectedLocation.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {selectedHotspot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Satellite className="w-5 h-5" />
                {selectedHotspot.ssid}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium">{selectedHotspot.venue}</p>
                <p className="text-sm text-gray-600">{selectedHotspot.address}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Security:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    selectedHotspot.encryption === 'none' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {selectedHotspot.encryption === 'none' ? 'Open Network' : 'Password Protected'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Source:</span>
                  <span className="text-sm">
                    {selectedHotspot.source === 'wigle' ? 'Wigle.net Database' : 'OpenWiFiMap'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Last Seen:</span>
                  <span className="text-sm">{new Date(selectedHotspot.lastSeen).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedHotspot.latitude},${selectedHotspot.longitude}`;
                    window.open(url, "_blank");
                  }}
                >
                  Get Directions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedHotspot(null)}
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Locations;
