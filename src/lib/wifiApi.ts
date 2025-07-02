
export interface RealWiFiHotspot {
  ssid: string;
  bssid: string;
  latitude: number;
  longitude: number;
  encryption: string;
  signal: number;
  lastSeen: string;
  source: 'wigle' | 'openwifimap' | 'user';
  venue?: string;
  address?: string;
}

// This service is now simplified to just provide the interface
// All real-time functionality has been removed
class WiFiApiService {
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}

export const wifiApiService = new WiFiApiService();
