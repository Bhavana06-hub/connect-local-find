
import { Card, CardContent } from "@/components/ui/card";
import { Map } from "lucide-react";
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
    <Card className="h-[600px] lg:h-[calc(100vh-8rem)]">
      <CardContent className="p-0 h-full">
        {showMap ? (
          <InteractiveMap
            locations={filteredLocations}
            userLocation={userLocation}
            onLocationSelect={onLocationSelect}
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
  );
};

export default LocationsMainContent;
