
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Heart } from 'lucide-react';

interface AdvancedFiltersProps {
  distanceRange: number;
  onDistanceChange: (distance: number) => void;
  minRating: number;
  onRatingChange: (rating: number) => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  hasUserLocation: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  distanceRange,
  onDistanceChange,
  minRating,
  onRatingChange,
  showFavoritesOnly,
  onToggleFavoritesOnly,
  hasUserLocation
}) => {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasUserLocation && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Distance
              </label>
              <Badge variant="outline">{distanceRange}km</Badge>
            </div>
            <Slider
              value={[distanceRange]}
              onValueChange={(value) => onDistanceChange(value[0])}
              max={20}
              min={0.5}
              step={0.5}
              className="w-full"
            />
          </div>
        )}
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Min Rating
            </label>
            <Badge variant="outline">{minRating}+</Badge>
          </div>
          <Slider
            value={[minRating]}
            onValueChange={(value) => onRatingChange(value[0])}
            max={5}
            min={1}
            step={0.5}
            className="w-full"
          />
        </div>
        
        <div>
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={onToggleFavoritesOnly}
            className="w-full"
          >
            <Heart className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            {showFavoritesOnly ? "Showing Favorites" : "Show Favorites Only"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
