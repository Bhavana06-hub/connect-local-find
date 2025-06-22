
import React from 'react';
import { WiFiLocation } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Star, Navigation, Wifi, Heart } from 'lucide-react';

interface LocationDetailsModalProps {
  location: WiFiLocation | null;
  isOpen: boolean;
  onClose: () => void;
  distance?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (locationId: number) => void;
}

const LocationDetailsModal: React.FC<LocationDetailsModalProps> = ({
  location,
  isOpen,
  onClose,
  distance,
  isFavorite,
  onToggleFavorite
}) => {
  if (!location) return null;

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, "_blank");
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(location.id);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl font-bold pr-8">{location.name}</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFavorite}
              className={isFavorite ? "text-red-500" : "text-gray-400"}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            {location.address}
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
            {location.hours || "Hours not specified"}
          </div>
          
          {distance && (
            <div className="flex items-center text-sm text-primary font-medium">
              <Navigation className="w-4 h-4 mr-2 flex-shrink-0" />
              {distance} km away
            </div>
          )}
          
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-amber-500" />
            <span className="font-bold">{location.rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">rating</span>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={location.isFree ? "default" : "secondary"} 
              className={location.isFree ? "bg-green-500 text-white" : "bg-amber-400 text-amber-900"}
            >
              <Wifi className="w-3 h-3 mr-1" />
              {location.isFree ? "Free WiFi" : "Paid WiFi"}
            </Badge>
            <Badge variant="outline">{location.type}</Badge>
          </div>
          
          {location.amenities && location.amenities.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2">Amenities</h4>
              <div className="flex gap-1 flex-wrap">
                {location.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <Button onClick={handleGetDirections} className="w-full">
            <Navigation className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDetailsModal;
