import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format coordinates to show N/S/E/W direction
 */
export function formatCoordinate(value: number, type: 'lat' | 'lng'): string {
  const direction = type === 'lat' 
    ? (value >= 0 ? 'N' : 'S')
    : (value >= 0 ? 'E' : 'W');
  
  const absValue = Math.abs(value);
  return `${absValue.toFixed(6)}° ${direction}`;
}

/**
 * Generate a unique client ID for MQTT connection
 */
export function generateClientId(prefix: string): string {
  return `${prefix}-${Math.random().toString(16).substring(2, 8)}-${Date.now().toString(36)}`;
}

/**
 * Calculate distance between two points using the Haversine formula
 * @param lat1 Latitude of point 1 (in degrees)
 * @param lon1 Longitude of point 1 (in degrees)
 * @param lat2 Latitude of point 2 (in degrees)
 * @param lon2 Longitude of point 2 (in degrees)
 * @returns Distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Check if a point is inside a geofence
 */
export function isPointInGeofence(
  point: { lat: number; lng: number },
  geofence: { lat: number; lng: number; radius: number }
): boolean {
  const distance = calculateDistance(
    point.lat,
    point.lng,
    geofence.lat,
    geofence.lng
  );
  return distance <= geofence.radius;
}
