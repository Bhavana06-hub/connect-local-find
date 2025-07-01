import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Wifi, MapPin, Key, Loader2, Satellite, Clock } from "lucide-react";
import { useRealTimeWiFi } from "@/hooks/useRealTimeWiFi";
import { UserLocation } from "@/lib/geolocation";

interface RealTimeWiFiControlsProps {
  userLocation: UserLocation | null;
  onHotspotsUpdate: (hotspots: any[]) => void;
}

const RealTimeWiFiControls = ({ userLocation, onHotspotsUpdate }: RealTimeWiFiControlsProps) => {
  const [apiKey, setApiKey] = useState("");
  const { 
    hotspots, 
    isLoading, 
    error, 
    lastUpdated,
    fetchNearbyHotspots, 
    configureWigleApi, 
    hasWigleApiKey 
  } = useRealTimeWiFi();

  const handleConfigureApi = () => {
    if (apiKey.trim()) {
      configureWigleApi(apiKey.trim());
      setApiKey("");
    }
  };

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
        {/* API Configuration */}
        {!hasWigleApiKey && (
          <div className="space-y-3">
            <Label htmlFor="wigle-api">
              Wigle.net API Key (Optional - for more data)
            </Label>
            <div className="flex gap-2">
              <Input
                id="wigle-api"
                type="password"
                placeholder="Enter your Wigle.net API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <Button onClick={handleConfigureApi} size="sm">
                <Key className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your free API key from{" "}
              <a 
                href="https://wigle.net/account" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                wigle.net/account
              </a>
            </p>
            <Separator />
          </div>
        )}

        {/* Status */}
        <div className="flex items-center gap-4">
          <Badge variant={hasWigleApiKey ? "default" : "secondary"}>
            {hasWigleApiKey ? "Wigle API: Connected" : "Using OpenWiFiMap only"}
          </Badge>
          {lastUpdated && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              {lastUpdated.toLocaleTimeString()}
            </div>
          )}
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
