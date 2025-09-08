import { LocationData } from '../types/Quest';

/**
 * Calculate distance between two points using Haversine formula
 * More accurate than simple approximation for GPS coordinates
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Check if location is within target area
 */
export function isWithinTarget(
  currentLocation: LocationData,
  targetLocation: { latitude: number; longitude: number; accuracy: number }
): boolean {
  const distance = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude
  );
  
  // Consider both the target accuracy and current location accuracy
  const totalAccuracy = targetLocation.accuracy + currentLocation.accuracy;
  return distance <= totalAccuracy;
}

/**
 * Get distance with appropriate unit formatting
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * Get direction hint (N, NE, E, SE, S, SW, W, NW)
 */
export function getDirectionHint(
  currentLat: number,
  currentLon: number,
  targetLat: number,
  targetLon: number
): string {
  const latDiff = targetLat - currentLat;
  const lonDiff = targetLon - currentLon;
  
  const angle = Math.atan2(lonDiff, latDiff) * 180 / Math.PI;
  const normalizedAngle = (angle + 360) % 360;
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(normalizedAngle / 45) % 8;
  
  return directions[index];
}
