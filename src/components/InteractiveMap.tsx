
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
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map centered on user location or default location
    const initialCenter = userLocation ? [userLocation.latitude, userLocation.longitude] : [17.6868, 83.2185];
    const map = L.map(mapRef.current).setView(initialCenter as [number, number], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = [];

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>',
        className: 'user-location-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .addTo(map)
        .bindPopup('Your Location');

      markersRef.current.push(userMarker);

      // Center map on user location
      map.setView([userLocation.latitude, userLocation.longitude], 14);
    }

    // Add WiFi location markers in red
    locations.forEach(location => {
      const icon = L.divIcon({
        html: `<div style="background-color: #dc2626; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'wifi-location-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const marker = L.marker([location.latitude, location.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-sm mb-1">${location.name}</h3>
            <p class="text-xs text-gray-600 mb-1">${location.type}</p>
            <p class="text-xs text-gray-500 mb-2">${location.address}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2 py-1 rounded ${location.isFree ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}">
                ${location.isFree ? 'Free WiFi' : 'Paid WiFi'}
              </span>
              <span class="text-xs text-yellow-600">
                ★ ${location.rating}
              </span>
            </div>
            <p class="text-xs text-gray-400">
              ${location.hours || 'Hours not specified'}
            </p>
          </div>
        `);

      marker.on('click', () => {
        if (onLocationSelect) {
          onLocationSelect(location);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if we have locations
    if (locations.length > 0) {
      const group = new L.FeatureGroup([...markersRef.current]);
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [locations, userLocation, onLocationSelect]);

  return <div ref={mapRef} className="h-full w-full rounded-xl" />;
};

export default InteractiveMap;
