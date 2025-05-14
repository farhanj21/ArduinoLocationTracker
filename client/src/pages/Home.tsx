import { useState } from 'react';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import InfoPanel from '@/components/InfoPanel';
import NotificationPanel from '@/components/NotificationPanel';
import { useLocation } from '@/context/LocationContext';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { requestLocation } = useLocation();
  const { toast } = useToast();

  const handleGetLocation = () => {
    requestLocation();
    toast({
      title: "Requesting Location",
      description: "Getting the latest GPS coordinates...",
    });
  };

  return (
    <div className="font-sans bg-neutral-100 text-neutral-400 overflow-hidden flex flex-col h-screen">
      {/* Header */}
      <Header onNotificationsClick={() => setNotificationPanelOpen(true)} />

      {/* Main Content */}
      <main className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Map View */}
        <MapView onCurrentLocationClick={handleGetLocation} />
        
        {/* Info Panel */}
        <InfoPanel onGetLocation={handleGetLocation} />
      </main>

      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />
    </div>
  );
}
