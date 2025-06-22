
import InteractiveMap from './InteractiveMap';
import { WiFiLocation } from '@/lib/types';
import { UserLocation } from '@/lib/geolocation';

interface MapWrapperProps {
  locations?: WiFiLocation[];
  userLocation?: UserLocation | null;
  onLocationSelect?: (location: WiFiLocation) => void;
}

const MapWrapper = ({ locations = [], userLocation, onLocationSelect }: MapWrapperProps) => {
  return (
    <div className="h-[calc(100vh-12rem)] md:h-full w-full rounded-xl shadow-lg">
      <InteractiveMap
        locations={locations}
        userLocation={userLocation}
        onLocationSelect={onLocationSelect}
      />
    </div>
  );
};

export default MapWrapper;
