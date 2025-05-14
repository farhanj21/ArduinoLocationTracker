import { useState, useEffect, useCallback } from 'react';
import mqtt from 'mqtt';
import { useToast } from "@/hooks/use-toast";

type MqttStatus = 'idle' | 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseMqttOptions {
  brokerUrl: string;
  clientId: string;
  username?: string;
  password?: string;
  topics: string[];
}

export function useMqtt({ brokerUrl, clientId, username, password, topics }: UseMqttOptions) {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [status, setStatus] = useState<MqttStatus>('idle');
  const [messages, setMessages] = useState<Record<string, any>>({});
  const { toast } = useToast();

  // Connect to MQTT
  const connect = useCallback(() => {
    if (client) return;
    
    setStatus('connecting');
    
    const mqttOptions: mqtt.IClientOptions = {
      clientId,
      clean: true,
      reconnectPeriod: 5000,
    };
    
    if (username && password) {
      mqttOptions.username = username;
      mqttOptions.password = password;
    }
    
    console.log("Connecting to MQTT broker:", brokerUrl);
    
    // First, set a timeout to avoid hanging indefinitely
    const connectionTimeout = setTimeout(() => {
      console.error("MQTT connection timeout");
      setStatus('error');
      toast({
        title: "Connection Timeout",
        description: "Failed to connect to MQTT broker in a reasonable time",
        variant: "destructive"
      });
    }, 5000);
    
    try {
      console.log(`Connecting to MQTT broker at ${brokerUrl}`);
      const mqttClient = mqtt.connect(brokerUrl, mqttOptions);
      
      mqttClient.on('connect', () => {
        clearTimeout(connectionTimeout);
        console.log("MQTT connected successfully");
        setStatus('connected');
        
        // Subscribe to all topics
        topics.forEach(topic => {
          mqttClient.subscribe(topic, (err) => {
            if (err) {
              console.error(`Error subscribing to ${topic}:`, err);
              toast({
                title: "Subscription Error",
                description: `Failed to subscribe to ${topic}`,
                variant: "destructive"
              });
            } else {
              console.log(`Successfully subscribed to ${topic}`);
            }
          });
        });
        
        toast({
          title: "Connected to MQTT broker",
          description: "Now receiving real-time location updates",
        });
      });
      
      mqttClient.on('message', (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          setMessages(prev => ({
            ...prev,
            [topic]: payload
          }));
        } catch (e) {
          console.error('Error parsing MQTT message:', e);
          setMessages(prev => ({
            ...prev,
            [topic]: message.toString()
          }));
        }
      });
      
      mqttClient.on('error', (err) => {
        console.error('MQTT Error:', err);
        setStatus('error');
        toast({
          title: "Connection Error",
          description: "Failed to connect to MQTT broker",
          variant: "destructive"
        });
      });
      
      mqttClient.on('offline', () => {
        setStatus('disconnected');
        toast({
          title: "Connection Lost",
          description: "MQTT connection is offline. Reconnecting...",
          variant: "destructive"
        });
      });
      
      setClient(mqttClient);
    } catch (error) {
      console.error('MQTT Connection error:', error);
      setStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to connect to MQTT broker",
        variant: "destructive"
      });
    }
  }, [brokerUrl, clientId, username, password, topics, toast]);

  // Disconnect from MQTT
  const disconnect = useCallback(() => {
    if (client) {
      client.end();
      setClient(null);
      setStatus('disconnected');
    }
  }, [client]);

  // Publish message to topic
  const publish = useCallback((topic: string, message: any) => {
    if (!client || status !== 'connected') {
      console.warn('Cannot publish: MQTT client not connected');
      return false;
    }
    
    try {
      const messageStr = typeof message === 'object' ? JSON.stringify(message) : message.toString();
      client.publish(topic, messageStr);
      return true;
    } catch (e) {
      console.error('Error publishing MQTT message:', e);
      return false;
    }
  }, [client, status]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    client,
    status,
    messages,
    connect,
    disconnect,
    publish,
    isConnected: status === 'connected'
  };
}
