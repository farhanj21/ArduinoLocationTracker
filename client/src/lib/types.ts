// Location Data
export interface LocationData {
  lat: number;
  lng: number;
}

// Geofence Definition
export interface Geofence {
  lat: number;
  lng: number;
  radius: number; // in meters
}

// Device Status
export interface DeviceStatus {
  battery: number; // percentage
  signalStrength: 'good' | 'medium' | 'poor';
  deviceId: string;
  speed: number; // km/h
}

// MQTT Message Formats
export interface LocationMessage {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
}

export interface StatusMessage {
  battery: number;
  signalStrength: 'good' | 'medium' | 'poor';
  deviceId: string;
}

export interface AlertMessage {
  type: 'anomaly' | 'geofence' | 'connection' | 'info';
  title: string;
  message: string;
  severity?: 'low' | 'medium' | 'high';
  timestamp?: number;
}

// Notification
export interface Notification {
  id: string;
  type: 'anomaly' | 'geofence' | 'connection' | 'info';
  title: string;
  message: string;
  read: boolean;
  timestamp: number;
}

// Alert History
export interface AlertHistory {
  id: string;
  type: 'anomaly' | 'geofence' | 'connection' | 'info';
  message: string;
  timestamp: number;
}
