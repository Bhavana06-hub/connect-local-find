
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LocationsHeaderProps {
  locationCount: number;
}

const LocationsHeader = ({ locationCount }: LocationsHeaderProps) => {
  return (
    <CardHeader className="pb-6">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            WiFi Locations
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Discover free and premium WiFi spots near you
          </p>
        </div>
        <Badge variant="secondary" className="text-sm font-semibold px-4 py-2 bg-blue-100 text-blue-800 border-0 rounded-xl">
          {locationCount} location{locationCount !== 1 ? 's' : ''}
        </Badge>
      </div>
    </CardHeader>
  );
};

export default LocationsHeader;
