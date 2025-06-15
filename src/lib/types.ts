
export interface WiFiLocation {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'Library' | 'Cafe' | 'Restaurant' | 'Park' | 'Community Center' | 'Mall' | 'Other';
  isFree: boolean;
  hours: string;
  amenities: string[];
  rating: number;
}
