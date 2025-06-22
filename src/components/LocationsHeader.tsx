
import { CardHeader, CardTitle } from "@/components/ui/card";

interface LocationsHeaderProps {
  locationCount: number;
}

const LocationsHeader = ({ locationCount }: LocationsHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="text-2xl font-bold tracking-tight">WiFi Locations</CardTitle>
      <p className="text-muted-foreground">
        Found {locationCount} location{locationCount !== 1 ? 's' : ''}
      </p>
    </CardHeader>
  );
};

export default LocationsHeader;
