import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useMqtt } from '@/hooks/useMqtt';
import { useToast } from "@/hooks/use-toast";
import { DeviceStatus, Geofence, LocationData } from '@/lib/types';

// MQTT Configuration
const MQTT_CONFIG = {
  // Use a public broker for testing purposes (no auth required)
  brokerUrl: import.meta.env.VITE_MQTT_BROKER_URL || 'wss://test.mosquitto.org:8081',
  clientId: `gps-tracker-web-${Math.random().toString(16).substr(2, 8)}`,
  topics: [
    'location_tracker/device/location',
    'location_tracker/device/location/latitude',
    'location_tracker/device/location/longitude',
    'location_tracker/device/status',
    'location_tracker/device/alerts',
    'location_tracker/device/alerts/geofence',
    'location_tracker/device/alerts/anomaly'
  ]
};

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

interface LocationContextType {
  currentLocation: LocationData | null;
  locationTimestamp: number | null;
  geofence: Geofence | null;
  deviceStatus: DeviceStatus | null;
  connectionStatus: ConnectionStatus;
  mqttStatus: string; // Allow any string value from the MQTT hook
  isLoading: boolean;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [locationTimestamp, setLocationTimestamp] = useState<number | null>(null);
  const [geofence, setGeofence] = useState<Geofence | null>({
    lat: 24.8607,
    lng: 67.0011,
    radius: 500 // 500 meters
  });
  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus | null>({
    battery: 85,
    signalStrength: 'good',
    deviceId: 'ESP32-GPS-01',
    speed: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  
  // Use MQTT hook to connect to the broker
  const { status: mqttStatus, messages, publish } = useMqtt(MQTT_CONFIG);

  // Map MQTT status to connection status
  const connectionStatus: ConnectionStatus = 
    mqttStatus === 'connected' ? 'connected' :
    mqttStatus === 'connecting' ? 'connecting' : 
    'disconnected'; // All other states (idle, error, disconnected) map to 'disconnected'

  // Process incoming MQTT messages - using refs to avoid infinite loops
  const prevMessagesRef = useRef<Record<string, any>>({});
  
  useEffect(() => {
    // Skip processing if messages are the same object (no changes)
    if (messages === prevMessagesRef.current) {
      return;
    }
    
    // Process location data
    const locationData = messages['location_tracker/device/location'];
    const prevLocationData = prevMessagesRef.current['location_tracker/device/location'];
    
    if (locationData && locationData !== prevLocationData) {
      try {
        // Expected format: { latitude: number, longitude: number, timestamp: number, speed: number }
        setCurrentLocation({
          lat: parseFloat(locationData.latitude),
          lng: parseFloat(locationData.longitude)
        });
        setLocationTimestamp(locationData.timestamp || Date.now());
        
        // Update speed if available
        if (deviceStatus && locationData.speed !== undefined) {
          setDeviceStatus(prev => ({
            ...prev!,
            speed: parseFloat(locationData.speed)
          }));
        }
      } catch (e) {
        console.error('Error processing location data:', e);
      }
    }
    
    // Process device status
    const statusData = messages['location_tracker/device/status'];
    const prevStatusData = prevMessagesRef.current['location_tracker/device/status'];
    
    if (statusData && statusData !== prevStatusData) {
      try {
        setDeviceStatus(prev => ({
          ...prev!,
          battery: statusData.battery !== undefined ? statusData.battery : prev?.battery,
          signalStrength: statusData.signalStrength || prev?.signalStrength,
          deviceId: statusData.deviceId || prev?.deviceId
        }));
      } catch (e) {
        console.error('Error processing device status data:', e);
      }
    }
    
    // Update the ref to current messages
    prevMessagesRef.current = messages;
  }, [messages]);

  // Function to request current location
  const requestLocation = () => {
    setIsLoading(true);
    
    // Check if MQTT is connected
    if (mqttStatus !== 'connected') {
      toast({
        title: "Connection Error",
        description: "Not connected to MQTT broker. Cannot request location.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Publish location request
    publish('location_tracker/device/command', { action: 'get_location' });
    
    // Simulate response time (in a real app, we'd wait for the response from the device)
    setTimeout(() => {
      // If we haven't received a location update by this time, consider it failed
      if (locationTimestamp && Date.now() - locationTimestamp > 10000) {
        toast({
          title: "Location Request Failed",
          description: "Device did not respond with location data.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Location Updated",
          description: "Successfully received latest location data.",
        });
      }
      setIsLoading(false);
    }, 3000);
  };

  // Provide location context
  const value: LocationContextType = {
    currentLocation,
    locationTimestamp,
    geofence,
    deviceStatus,
    connectionStatus,
    mqttStatus,
    isLoading,
    requestLocation
  };

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
