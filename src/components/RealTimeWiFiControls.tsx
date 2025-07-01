
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wifi, MapPin, Loader2, Satellite, Clock, AlertCircle, Shield } from "lucide-react";
import { useRealTimeWiFi } from "@/hooks/useRealTimeWiFi";
import { UserLocation } from "@/lib/geolocation";

interface RealTimeWiFiControlsProps {
  userLocation: UserLocation | null;
  onHotspotsUpdate: (hotspots: any[]) => void;
}

const RealTimeWiFiControls = ({ userLocation, onHotspotsUpdate }: RealTimeWiFiControlsProps) => {
  const { 
    hotspots, 
    isLoading, 
    error, 
    lastUpdated,
    fetchNearbyHotspots,
    hasWigleApiKey 
  } = useRealTimeWiFi();

  const handleFetchHotspots = async () => {
    if (!userLocation) {
      return;
    }
    
    await fetchNearbyHotspots(userLocation.latitude, userLocation.longitude);
  };

  // Update parent component when hotspots change
  React.useEffect(() => {
    onHotspotsUpdate(hotspots);
  }, [hotspots, onHotspotsUpdate]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="w-5 h-5" />
          Real-Time WiFi Hotspots
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-4">
          <Badge variant="default" className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            Secure Backend API
          </Badge>
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        <Separator />

        {/* Info box */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">How it works:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• <strong>Secure API:</strong> WiGLE API calls are made through our secure backend</li>
                <li>• <strong>Real Data:</strong> Gets live crowdsourced WiFi hotspot data from WiGLE.net</li>
                <li>• <strong>OpenWiFiMap:</strong> Also includes public WiFi spots from OpenStreetMap</li>
                <li>• <strong>Privacy:</strong> Your API credentials are safely stored server-side</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Fetch Button */}
        <Button 
          onClick={handleFetchHotspots}
          disabled={!userLocation || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wifi className="w-4 h-4 mr-2" />
          )}
          {isLoading ? "Scanning..." : "Find Nearby WiFi Hotspots"}
        </Button>

        {/* Results Summary */}
        {hotspots.length > 0 && (
          <div className="text-sm text-center text-muted-foreground">
            Found {hotspots.length} WiFi hotspots nearby
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Location Status */}
        {!userLocation && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              Enable location access to scan for nearby hotspots
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeWiFiControls;
