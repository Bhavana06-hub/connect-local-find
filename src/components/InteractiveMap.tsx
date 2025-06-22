
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { WiFiLocation } from '@/lib/types';
import { UserLocation } from '@/lib/geolocation';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  locations: WiFiLocation[];
  userLocation?: UserLocation | null;
  onLocationSelect?: (location: WiFiLocation) => void;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  locations, 
  userLocation, 
  onLocationSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([17.6868, 83.2185], 12); // Visakhapatnam coordinates

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        html: '<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
        className: 'user-location-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('Your Location');
    }

    // Add WiFi location markers
    locations.forEach(location => {
      const markerColor = location.isFree ? '#10b981' : '#f59e0b';
      const icon = L.divIcon({
        html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
        className: 'wifi-location-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${location.name}</h3>
            <p class="text-xs text-gray-600">${location.address}</p>
            <p class="text-xs ${location.isFree ? 'text-green-600' : 'text-amber-600'}">${location.isFree ? 'Free WiFi' : 'Paid WiFi'}</p>
            <p class="text-xs">★ ${location.rating}</p>
          </div>
        `);

      marker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [locations, userLocation, onLocationSelect]);

  return <div ref={mapRef} className="h-full w-full rounded-xl" />;
};

export default InteractiveMap;
