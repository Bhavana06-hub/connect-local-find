
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationsHeaderProps {
  locationCount: number;
}

const LocationsHeader = ({ locationCount }: LocationsHeaderProps) => {
  return (
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            WiFi Locations
          </CardTitle>
          <p className="text-muted-foreground mt-1">
            Discover free and premium WiFi spots near you
          </p>
        </div>
        <Badge variant="secondary" className="text-sm font-semibold px-3 py-1 bg-primary/10 text-primary border-primary/20">
          {locationCount} location{locationCount !== 1 ? 's' : ''}
        </Badge>
      </div>
    </CardHeader>
  );
};

export default LocationsHeader;
