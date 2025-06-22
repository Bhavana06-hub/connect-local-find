
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
    <Card className="h-[600px] lg:h-[calc(100vh-10rem)] bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg rounded-2xl overflow-hidden">
      <CardContent className="p-0 h-full">
        {showMap ? (
          <div className="h-full relative">
            <InteractiveMap
              locations={filteredLocations}
              userLocation={userLocation}
              onLocationSelect={onLocationSelect}
            />
            <div className="absolute top-6 left-6 right-6 z-10">
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{filteredLocations.length} locations shown</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Click markers for details
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex items-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-xl mr-6">
                  <Map className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-gray-100 mb-1">Location Explorer</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click on any location card to view detailed information, or switch to map view to see all locations visually
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center text-gray-500 max-w-lg">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <Map className="w-16 h-16 text-blue-600/60" />
                </div>
                <h4 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  Ready to Explore
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Select a location from the list to view comprehensive details including amenities, reviews, and directions.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
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
