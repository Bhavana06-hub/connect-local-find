import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { WiFiLocation } from "@/lib/types";
import L from "leaflet";
import { Wifi, Utensils, Library, Building2, Trees, Star, MapPin } from 'lucide-react';
import { Button } from "./ui/button";

const typeIconClasses = {
    Cafe: 'bg-orange-500',
    Restaurant: 'bg-red-500',
    Library: 'bg-blue-500',
    Mall: 'bg-purple-500',
    Park: 'bg-green-500',
    Other: 'bg-gray-500',
    'Community Center': 'bg-indigo-500',
};

const createCustomIcon = (location: WiFiLocation) => {
    const iconColorClass = location.isFree ? typeIconClasses[location.type] : 'bg-yellow-500';
    let icon;
    switch(location.type) {
        case 'Cafe': icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`; break;
        case 'Restaurant': icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-utensils"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/></svg>`; break;
        case 'Library': icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-library"><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>`; break;
        default: icon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`;
    }
    
    return L.divIcon({
        html: `<div class="${iconColorClass} text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg">${icon}</div>`,
        className: 'bg-transparent border-0',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });
}

const getDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
};

const MapWrapper = ({ locations, selectedLocation }: { locations: WiFiLocation[], selectedLocation: WiFiLocation | null }) => {
  const position: [number, number] = selectedLocation 
    ? [selectedLocation.latitude, selectedLocation.longitude] 
    : [17.3850, 78.4867];
  const zoom = selectedLocation ? 16 : 12;

  const mapKey = selectedLocation ? selectedLocation.id : 'default-map';

  return (
    <div className="h-[calc(100vh-12rem)] md:h-full w-full rounded-lg">
      <MapContainer key={mapKey} center={position} zoom={zoom} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker key={location.id} position={[location.latitude, location.longitude]} icon={createCustomIcon(location)}>
            <Popup>
              <div className="w-64">
                <h3 className="font-bold text-md mb-1">{location.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center mb-2"><MapPin className="w-3 h-3 mr-1" />{location.address}</p>
                <div className="flex items-center justify-between text-xs mb-2">
                    <span className={`font-semibold px-2 py-1 rounded-full text-white ${location.isFree ? 'bg-green-500' : 'bg-yellow-500'}`}>{location.isFree ? 'Free' : 'Paid'}</span>
                    <span className="flex items-center font-semibold"><Star className="w-3 h-3 mr-1 text-yellow-400" /> {location.rating}</span>
                </div>
                <Button size="sm" className="w-full mt-2" onClick={() => getDirections(location.latitude, location.longitude)}>Get Directions</Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapWrapper;
