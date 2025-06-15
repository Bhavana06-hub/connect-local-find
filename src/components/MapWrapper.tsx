
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { WiFiLocation } from '@/lib/types';
import 'mapbox-gl/dist/mapbox-gl.css';

// IMPORTANT: You need to replace this with your own Mapbox public access token.
// You can get a free one from https://www.mapbox.com/
mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const typeIconClasses = {
    Cafe: 'bg-orange-500',
    Restaurant: 'bg-red-500',
    Library: 'bg-blue-500',
    Mall: 'bg-purple-500',
    Park: 'bg-green-500',
    Other: 'bg-gray-500',
    'Community Center': 'bg-indigo-500',
};

const MapWrapper = ({ locations, selectedLocation }: { locations: WiFiLocation[], selectedLocation: WiFiLocation | null }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({});

  // This function will be attached to the window object to be called from the popup
  const getDirections = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };
  
  (window as any).getDirectionsMapbox = getDirections;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    if (!mapContainer.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [78.4867, 17.3850], // Default: Hyderabad
      zoom: 11
    });
  });

  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    locations.forEach((location) => {
      const el = document.createElement('div');
      const iconColorClass = location.isFree ? typeIconClasses[location.type] : 'bg-yellow-500';
      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>`;
      el.innerHTML = `<div class="${iconColorClass} text-white rounded-full w-8 h-8 flex items-center justify-center border-2 border-white shadow-lg cursor-pointer">${iconSvg}</div>`;

      const popupHtml = `
        <div class="p-1 font-sans">
          <h3 class="font-bold text-md mb-1">${location.name}</h3>
          <p class="text-xs text-gray-500 flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            ${location.address}
          </p>
          <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-semibold px-2 py-1 rounded-full text-white ${location.isFree ? 'bg-green-500' : 'bg-yellow-500'}">${location.isFree ? 'Free' : 'Paid'}</span>
              <span class="flex items-center font-semibold text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="rgb(250 204 21)" stroke="rgb(250 204 21)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline-block mr-1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ${location.rating}
              </span>
          </div>
          <button class="w-full mt-2 h-9 px-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium" onclick="window.getDirectionsMapbox(${location.latitude}, ${location.longitude})">Get Directions</button>
        </div>
      `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      markers.current[location.id] = marker;
    });
  }, [locations]);

  useEffect(() => {
    if (map.current && selectedLocation) {
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15
      });
      markers.current[selectedLocation.id]?.togglePopup();
    }
  }, [selectedLocation]);
  
  return (
    <div className="h-[calc(100vh-12rem)] md:h-full w-full rounded-lg">
      <div ref={mapContainer} className="h-full w-full rounded-lg shadow-lg" />
    </div>
  );
};

export default MapWrapper;
