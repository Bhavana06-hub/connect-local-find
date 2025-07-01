
import { useState, useCallback } from 'react';
import { wifiApiService, RealWiFiHotspot } from '@/lib/wifiApi';
import { useToast } from '@/hooks/use-toast';

export interface RealTimeWiFiState {
  hotspots: RealWiFiHotspot[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export function useRealTimeWiFi() {
  const [state, setState] = useState<RealTimeWiFiState>({
    hotspots: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
  });
  
  const { toast } = useToast();

  const fetchNearbyHotspots = useCallback(async (latitude: number, longitude: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const hotspots = await wifiApiService.fetchNearbyHotspots(latitude, longitude);
      
      setState({
        hotspots,
        isLoading: false,
        error: null,
        lastUpdated: new Date(),
      });

      toast({
        title: "WiFi Hotspots Updated",
        description: `Found ${hotspots.length} nearby WiFi hotspots`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch WiFi hotspots';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const clearHotspots = useCallback(() => {
    setState({
      hotspots: [],
      isLoading: false,
      error: null,
      lastUpdated: null,
    });
  }, []);

  const configureWigleApi = useCallback((apiKey: string) => {
    wifiApiService.setWigleApiKey(apiKey);
    toast({
      title: "API Key Configured",
      description: "Wigle.net API key has been saved",
    });
  }, [toast]);

  return {
    ...state,
    fetchNearbyHotspots,
    clearHotspots,
    configureWigleApi,
    hasWigleApiKey: wifiApiService.hasWigleApiKey(),
  };
}
