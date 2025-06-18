
import { useState, useCallback } from 'react';
import { getCurrentLocation, UserLocation } from '@/lib/geolocation';

export interface GeolocationState {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: false,
    error: null,
  });

  const requestLocation = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const location = await getCurrentLocation();
      setState({ location, isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState({ location: null, isLoading: false, error: errorMessage });
    }
  }, []);

  const clearLocation = useCallback(() => {
    setState({ location: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    requestLocation,
    clearLocation,
  };
}
