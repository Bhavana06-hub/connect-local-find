
import { Card, CardContent } from "@/components/ui/card";
import { Map, MapPin, Sparkles } from "lucide-react";
import InteractiveMap from "@/components/InteractiveMap";
import { WiFiLocation } from "@/lib/types";
import { UserLocation } from "@/lib/geolocation";

interface LocationsMainContentProps {
  showMap: boolean;
  filteredLocations: WiFiLocation[];
  userLocation: UserLocation | null;
  onLocationSelect: (location: WiFiLocation) => void;
}

const LocationsMainContent = ({
  showMap,
  filteredLocations,
  userLocation,
  onLocationSelect
}: LocationsMainContentProps) => {
  return (
    <Card className="h-[600px] lg:h-[calc(100vh-8rem)] bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl overflow-hidden">
      <CardContent className="p-0 h-full">
        {showMap ? (
          <div className="h-full relative">
            <InteractiveMap
              locations={filteredLocations}
              userLocation={userLocation}
              onLocationSelect={onLocationSelect}
            />
            {/* Map overlay info */}
            <div className="absolute top-4 left-4 right-4 z-10">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-3 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span>{filteredLocations.length} locations shown</span>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Click markers for details
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-blue-500/5">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-xl mr-4">
                  <Map className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Location Explorer</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any location card to view detailed information, or switch to map view to see all locations visually
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-muted-foreground max-w-md">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full flex items-center justify-center">
                  <Map className="w-12 h-12 text-primary/60" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Ready to Explore
                </h4>
                <p className="text-muted-foreground mb-4">
                  Select a location from the list to view comprehensive details including amenities, reviews, and directions.
                </p>
                <p className="text-sm text-muted-foreground">
                  Or switch to map view to see all WiFi locations plotted geographically with interactive markers.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationsMainContent;
