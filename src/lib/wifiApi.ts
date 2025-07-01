
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

export interface WigleResponse {
  success: boolean;
  totalResults: number;
  search: Array<{
    trilat: number;
    trilong: number;
    ssid: string;
    netid: string;
    type: string;
    comment: string;
    wep: string;
    bcninterval: number;
    freenet: string;
    dhcp: string;
    paynet: string;
    userfound: boolean;
    channel: number;
    encryption: string;
    lasttime: string;
    lastupdt: string;
    nettype: string;
    qos: number;
    transid: string;
    firsttime: string;
  }>;
}

class WiFiApiService {
  private wigleApiKey: string | null = null;
  
  constructor() {
    // Get API key from localStorage if available
    this.wigleApiKey = localStorage.getItem('wigle_api_key');
  }

  setWigleApiKey(apiKey: string) {
    this.wigleApiKey = apiKey;
    localStorage.setItem('wigle_api_key', apiKey);
  }

  hasWigleApiKey(): boolean {
    return !!this.wigleApiKey;
  }

  async fetchWigleHotspots(latitude: number, longitude: number, radius: number = 0.01): Promise<RealWiFiHotspot[]> {
    if (!this.wigleApiKey) {
      throw new Error('Wigle API key not configured');
    }

    const url = `https://api.wigle.net/api/v2/network/search`;
    const params = new URLSearchParams({
      latrange1: (latitude - radius).toString(),
      latrange2: (latitude + radius).toString(),
      longrange1: (longitude - radius).toString(),
      longrange2: (longitude + radius).toString(),
      freenet: 'true', // Only free networks
      paynet: 'false'
    });

    try {
      const response = await fetch(`${url}?${params}`, {
        headers: {
          'Authorization': `Basic ${btoa(this.wigleApiKey)}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Wigle API error: ${response.status}`);
      }

      const data: WigleResponse = await response.json();
      
      return data.search?.map(hotspot => ({
        ssid: hotspot.ssid || 'Unknown Network',
        bssid: hotspot.netid,
        latitude: hotspot.trilat,
        longitude: hotspot.trilong,
        encryption: hotspot.encryption || hotspot.wep,
        signal: hotspot.qos || 0,
        lastSeen: hotspot.lasttime,
        source: 'wigle' as const,
        venue: hotspot.comment || undefined,
        address: `${hotspot.trilat.toFixed(6)}, ${hotspot.trilong.toFixed(6)}`
      })) || [];
    } catch (error) {
      console.error('Error fetching Wigle data:', error);
      return [];
    }
  }

  async fetchOpenWiFiMapHotspots(latitude: number, longitude: number): Promise<RealWiFiHotspot[]> {
    // OpenWiFiMap API (alternative/fallback)
    const bbox = {
      south: latitude - 0.01,
      north: latitude + 0.01,
      west: longitude - 0.01,
      east: longitude + 0.01
    };

    try {
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="wifi"]["wifi"="free"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
          node["internet_access"="wlan"]["internet_access:fee"="no"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
        );
        out geom;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      if (!response.ok) {
        throw new Error(`OpenStreetMap Overpass API error: ${response.status}`);
      }

      const data = await response.json();
      
      return data.elements?.map((element: any) => ({
        ssid: element.tags?.name || element.tags?.['wifi:ssid'] || 'Free WiFi',
        bssid: `osm_${element.id}`,
        latitude: element.lat,
        longitude: element.lon,
        encryption: 'none',
        signal: 5, // Default signal strength
        lastSeen: new Date().toISOString(),
        source: 'openwifimap' as const,
        venue: element.tags?.name || element.tags?.amenity || 'Public WiFi',
        address: element.tags?.['addr:full'] || `${element.lat.toFixed(6)}, ${element.lon.toFixed(6)}`
      })) || [];
    } catch (error) {
      console.error('Error fetching OpenWiFiMap data:', error);
      return [];
    }
  }

  async fetchNearbyHotspots(latitude: number, longitude: number): Promise<RealWiFiHotspot[]> {
    const results: RealWiFiHotspot[] = [];

    try {
      // Try Wigle first if API key is available
      if (this.hasWigleApiKey()) {
        const wigleResults = await this.fetchWigleHotspots(latitude, longitude);
        results.push(...wigleResults);
      }

      // Always try OpenWiFiMap as fallback/additional data
      const openWiFiResults = await this.fetchOpenWiFiMapHotspots(latitude, longitude);
      results.push(...openWiFiResults);

      // Remove duplicates based on proximity (within 50 meters)
      const uniqueResults: RealWiFiHotspot[] = [];
      results.forEach(hotspot => {
        const isDuplicate = uniqueResults.some(existing => {
          const distance = this.calculateDistance(
            hotspot.latitude, hotspot.longitude,
            existing.latitude, existing.longitude
          );
          return distance < 0.05; // 50 meters
        });
        
        if (!isDuplicate) {
          uniqueResults.push(hotspot);
        }
      });

      return uniqueResults;
    } catch (error) {
      console.error('Error fetching nearby hotspots:', error);
      return [];
    }
  }

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
