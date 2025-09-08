import { LocationData } from '../types/Quest';

/**
 * Calculate the great-circle distance between two points on Earth using the Haversine formula
 * 
 * The Haversine formula calculates the shortest distance between two points on a sphere
 * (in this case, Earth) given their latitude and longitude coordinates.
 * 
 * Formula: d = 2R * arcsin(√(sin²(Δφ/2) + cos(φ₁) * cos(φ₂) * sin²(Δλ/2)))
 * 
 * Where:
 * - R = Earth's radius (6,371,000 meters)
 * - φ₁, φ₂ = latitudes of the two points
 * - λ₁, λ₂ = longitudes of the two points
 * - Δφ = difference in latitudes (φ₂ - φ₁)
 * - Δλ = difference in longitudes (λ₂ - λ₁)
 * 
 * @param latitude1 - First point's latitude in decimal degrees
 * @param longitude1 - First point's longitude in decimal degrees
 * @param latitude2 - Second point's latitude in decimal degrees
 * @param longitude2 - Second point's longitude in decimal degrees
 * @returns Distance between the two points in meters
 */
export function calculateDistance(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number {
  // Earth's mean radius in meters (WGS84 ellipsoid)
  const EARTH_RADIUS_METERS = 6371000;
  
  // Convert latitude and longitude differences from degrees to radians
  const latitudeDifferenceRadians = ((latitude2 - latitude1) * Math.PI) / 180;
  const longitudeDifferenceRadians = ((longitude2 - longitude1) * Math.PI) / 180;
  
  // Convert individual latitudes to radians for trigonometric calculations
  const latitude1Radians = (latitude1 * Math.PI) / 180;
  const latitude2Radians = (latitude2 * Math.PI) / 180;
  
  // Calculate the haversine of the central angle between the two points
  // This is the core of the Haversine formula: a = sin²(Δφ/2) + cos(φ₁) * cos(φ₂) * sin²(Δλ/2)
  const haversineOfCentralAngle = 
    Math.sin(latitudeDifferenceRadians / 2) * Math.sin(latitudeDifferenceRadians / 2) +
    Math.cos(latitude1Radians) * Math.cos(latitude2Radians) *
    Math.sin(longitudeDifferenceRadians / 2) * Math.sin(longitudeDifferenceRadians / 2);
  
  // Calculate the central angle using the inverse haversine function
  // c = 2 * atan2(√a, √(1-a)) where a is the haversine of the central angle
  const centralAngleRadians = 2 * Math.atan2(
    Math.sqrt(haversineOfCentralAngle), 
    Math.sqrt(1 - haversineOfCentralAngle)
  );
  
  // Calculate the great-circle distance: d = R * c
  const greatCircleDistanceMeters = EARTH_RADIUS_METERS * centralAngleRadians;
  
  return greatCircleDistanceMeters;
}

/**
 * Check if the current location is within the target quest area
 * 
 * This function determines whether a player is close enough to a quest target
 * by considering both the GPS accuracy and the quest's acceptable radius.
 * 
 * @param currentLocation - The player's current GPS location with accuracy
 * @param targetLocation - The quest target location with acceptable radius
 * @returns True if the player is within the acceptable range, false otherwise
 */
export function isWithinTarget(
  currentLocation: LocationData,
  targetLocation: { latitude: number; longitude: number; accuracy: number }
): boolean {
  // Calculate the straight-line distance between current and target locations
  const distanceToTarget = calculateDistance(
    currentLocation.latitude,
    currentLocation.longitude,
    targetLocation.latitude,
    targetLocation.longitude
  );
  
  // Combine both accuracy tolerances to account for GPS uncertainty
  // This ensures the quest is completable even with GPS inaccuracy
  const combinedAccuracyTolerance = targetLocation.accuracy + currentLocation.accuracy;
  
  return distanceToTarget <= combinedAccuracyTolerance;
}

/**
 * Format distance in meters to a human-readable string with appropriate units
 * 
 * Converts meters to either meters (m) or kilometers (km) based on the distance.
 * For distances under 1km, shows meters rounded to the nearest whole number.
 * For distances 1km and above, shows kilometers with one decimal place.
 * 
 * @param meters - Distance in meters
 * @returns Formatted distance string (e.g., "250m" or "1.2km")
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * Calculate the compass direction from current location to target location
 * 
 * This function determines which of the 8 cardinal directions (N, NE, E, SE, S, SW, W, NW)
 * the player should head to reach the target location. It uses basic trigonometry
 * to calculate the bearing angle and converts it to a compass direction.
 * 
 * @param currentLatitude - Current location's latitude in decimal degrees
 * @param currentLongitude - Current location's longitude in decimal degrees
 * @param targetLatitude - Target location's latitude in decimal degrees
 * @param targetLongitude - Target location's longitude in decimal degrees
 * @returns Compass direction as a string (N, NE, E, SE, S, SW, W, NW)
 */
export function getDirectionHint(
  currentLatitude: number,
  currentLongitude: number,
  targetLatitude: number,
  targetLongitude: number
): string {
  // Calculate the differences in coordinates
  const latitudeDifference = targetLatitude - currentLatitude;
  const longitudeDifference = targetLongitude - currentLongitude;
  
  // Calculate the bearing angle using atan2 (returns angle in radians)
  // atan2(longitude_diff, latitude_diff) gives us the angle from north
  const bearingAngleRadians = Math.atan2(longitudeDifference, latitudeDifference);
  
  // Convert from radians to degrees and normalize to 0-360 range
  const bearingAngleDegrees = (bearingAngleRadians * 180 / Math.PI + 360) % 360;
  
  // Define the 8 cardinal directions in order (starting from North, going clockwise)
  const compassDirections = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  
  // Each direction covers 45 degrees (360° / 8 directions = 45°)
  // Round to the nearest 45-degree increment to get the direction index
  const directionIndex = Math.round(bearingAngleDegrees / 45) % 8;
  
  return compassDirections[directionIndex];
}
