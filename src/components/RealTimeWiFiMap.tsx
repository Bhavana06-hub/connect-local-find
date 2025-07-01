
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RealWiFiHotspot } from '@/lib/wifiApi';
import { UserLocation } from '@/lib/geolocation';

interface RealTimeWiFiMapProps {
  hotspots: RealWiFiHotspot[];
  userLocation?: UserLocation | null;
  onHotspotSelect?: (hotspot: RealWiFiHotspot) => void;
}

const RealTimeWiFiMap: React.FC<RealTimeWiFiMapProps> = ({ 
  hotspots, 
  userLocation, 
  onHotspotSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([17.6868, 83.2185], 12);

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

      // Center map on user location if we have hotspots
      if (hotspots.length > 0) {
        map.setView([userLocation.latitude, userLocation.longitude], 14);
      }
    }

    // Add real-time WiFi hotspot markers
    hotspots.forEach(hotspot => {
      const markerColor = getHotspotColor(hotspot);
      const icon = L.divIcon({
        html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'wifi-hotspot-marker',
        iconSize: [18, 18],
        iconAnchor: [9, 9]
      });

      const marker = L.marker([hotspot.latitude, hotspot.longitude], { icon })
        .addTo(map)
        .bindPopup(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-bold text-sm mb-1">${hotspot.ssid}</h3>
            <p class="text-xs text-gray-600 mb-1">${hotspot.venue || 'WiFi Hotspot'}</p>
            <p class="text-xs text-gray-500 mb-2">${hotspot.address}</p>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xs px-2 py-1 rounded ${getEncryptionBadge(hotspot.encryption)}">
                ${hotspot.encryption === 'none' ? 'Open' : 'Secured'}
              </span>
              <span class="text-xs text-gray-500">
                ${getSignalStrength(hotspot.signal)}
              </span>
            </div>
            <p class="text-xs text-gray-400">
              Source: ${hotspot.source === 'wigle' ? 'Wigle.net' : 'OpenWiFiMap'}
            </p>
            <p class="text-xs text-gray-400">
              Last seen: ${new Date(hotspot.lastSeen).toLocaleDateString()}
            </p>
          </div>
        `);

      marker.on('click', () => {
        if (onHotspotSelect) {
          onHotspotSelect(hotspot);
        }
      });

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if we have hotspots
    if (hotspots.length > 0 && userLocation) {
      const group = new L.FeatureGroup([...markersRef.current]);
      map.fitBounds(group.getBounds().pad(0.1));
    }

  }, [hotspots, userLocation, onHotspotSelect]);

  const getHotspotColor = (hotspot: RealWiFiHotspot) => {
    if (hotspot.encryption === 'none' || hotspot.encryption === 'None') {
      return '#10b981'; // Green for open networks
    }
    return '#f59e0b'; // Orange for secured networks
  };

  const getEncryptionBadge = (encryption: string) => {
    if (encryption === 'none' || encryption === 'None') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-orange-100 text-orange-800';
  };

  const getSignalStrength = (signal: number) => {
    if (signal >= 8) return 'Excellent';
    if (signal >= 6) return 'Good';
    if (signal >= 4) return 'Fair';
    return 'Weak';
  };

  return <div ref={mapRef} className="h-full w-full rounded-xl" />;
};

export default RealTimeWiFiMap;
