
import { MapPin } from 'lucide-react';

const MapPlaceholder = () => {
  return (
    <div className="h-full w-full rounded-lg bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-center p-8 shadow-inner border border-slate-200 dark:border-slate-700">
      <MapPin className="w-16 h-16 text-slate-400 dark:text-slate-500 mb-4" />
      <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300">Map of Hyderabad</h3>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
        Use the list on the left to find WiFi spots. Click "Get Directions" on any location card to open navigation in Google Maps.
      </p>
    </div>
  );
};

const MapWrapper = () => {
  return (
    <div className="h-[calc(100vh-12rem)] md:h-full w-full rounded-lg">
      <MapPlaceholder />
    </div>
  );
};

export default MapWrapper;
