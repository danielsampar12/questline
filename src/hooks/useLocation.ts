import { useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { LocationData } from '../types/Quest';

interface UseLocationReturn {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<LocationData | null>;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const granted = status === 'granted';
      setHasPermission(granted);
      
      if (!granted) {
        setError('Permissão de localização é necessária para nossa história');
      }
      
      return granted;
    } catch (err) {
      setError('Falha ao solicitar permissão de localização');
      return false;
    }
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<LocationData | null> => {
    if (!hasPermission) {
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        return null;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use high accuracy options for better precision
      const locationResult = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const locationData: LocationData = {
        latitude: locationResult.coords.latitude,
        longitude: locationResult.coords.longitude,
        accuracy: locationResult.coords.accuracy || 10, // Default to 10m if not provided
        timestamp: Date.now(),
      };

      setLocation(locationData);
      return locationData;
    } catch (err) {
      let errorMessage = 'Falha ao obter localização atual';
      
      if (err instanceof Error) {
        if (err.message.includes('timeout')) {
          errorMessage = 'Solicitação de localização expirou. Tente novamente.';
        } else if (err.message.includes('denied')) {
          errorMessage = 'Acesso à localização negado. Ative os serviços de localização.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission, requestPermission]);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    hasPermission,
    requestPermission,
  };
};
