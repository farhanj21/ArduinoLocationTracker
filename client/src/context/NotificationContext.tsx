import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { useMqtt } from '@/hooks/useMqtt';
import { Notification } from '@/lib/types';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// MQTT Configuration (using the same as LocationContext)
const MQTT_CONFIG = {
  // Use a public broker for testing purposes (no auth required)
  brokerUrl: import.meta.env.VITE_MQTT_BROKER_URL || 'wss://test.mosquitto.org:8081',
  clientId: `notification-client-${Math.random().toString(16).substr(2, 8)}`,
  topics: [
    'location_tracker/device/alerts',
    'location_tracker/device/alerts/geofence',
    'location_tracker/device/alerts/anomaly'
  ]
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  // Use MQTT for real-time notifications
  const { messages } = useMqtt(MQTT_CONFIG);

  // Process incoming MQTT alert messages - we'll use refs to avoid infinite loops
  const prevMessagesRef = useRef<Record<string, any>>({});
  
  useEffect(() => {
    // Skip processing if messages are the same object (no changes)
    if (messages === prevMessagesRef.current) {
      return;
    }
    
    // Process general alerts if the data changed
    const alertData = messages['location_tracker/device/alerts'];
    const prevAlertData = prevMessagesRef.current['location_tracker/device/alerts'];
    if (alertData && alertData !== prevAlertData) {
      try {
        addNotification({
          type: alertData.type || 'info',
          title: alertData.title || 'Alert',
          message: alertData.message || 'An alert was received.'
        });
      } catch (e) {
        console.error('Error processing alert data:', e);
      }
    }
    
    // Update the ref to current messages
    prevMessagesRef.current = messages;
  }, [messages]);

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Add some sample notifications on mount (for demo purposes)
  useEffect(() => {
    // Sample notifications
    const sampleNotifications: Omit<Notification, 'id' | 'read' | 'timestamp'>[] = [
      {
        type: 'anomaly',
        title: 'Anomaly Detected',
        message: 'Unusual movement pattern detected. The device showed a sudden speed increase from 0 to a 50 km/h.'
      },
      {
        type: 'geofence',
        title: 'Geofence Breach',
        message: 'Device has exited the designated safe zone "Home Area".'
      },
      {
        type: 'connection',
        title: 'Connection Restored',
        message: 'MQTT connection to HiveMQ has been restored after a temporary disconnection.'
      }
    ];
    
    // Add sample notifications with time offsets
    sampleNotifications.forEach((notification, index) => {
      const timestamp = Date.now() - (index + 1) * 10 * 60 * 1000; // 10, 20, 30 minutes ago
      setNotifications(prev => [
        ...prev,
        {
          ...notification,
          id: `sample-${index}`,
          read: false,
          timestamp
        }
      ]);
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      clearAll 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
