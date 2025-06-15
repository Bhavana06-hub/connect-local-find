
import { MapPin } from 'lucide-react';

const MapPlaceholder = () => {
  return (
    <div 
      className="h-full w-full rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center text-center p-8 shadow-inner border border-white/20"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2148&auto=format&fit=crop)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg">
        <MapPin className="w-16 h-16 text-white/80 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white">Map of Visakhapatnam</h3>
        <p className="text-white/70 mt-2 max-w-sm">
          Use the list on the left to find WiFi spots. Click "Get Directions" on any location card to open navigation in Google Maps.
        </p>
      </div>
    </div>
  );
};

const MapWrapper = () => {
  return (
    <div className="h-[calc(100vh-12rem)] md:h-full w-full rounded-xl shadow-lg">
      <MapPlaceholder />
    </div>
  );
};

export default MapWrapper;
