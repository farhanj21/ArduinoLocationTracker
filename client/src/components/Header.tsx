import { useNotification } from "@/context/NotificationContext";
import { useLocation } from "@/context/LocationContext";

type HeaderProps = {
  onNotificationsClick: () => void;
};

export default function Header({ onNotificationsClick }: HeaderProps) {
  const { notifications } = useNotification();
  const { connectionStatus } = useLocation();
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Determine connection status indicator
  const connectionStatusClass = connectionStatus === 'connected' 
    ? 'bg-success' 
    : connectionStatus === 'connecting' 
      ? 'bg-warning'
      : 'bg-error';
  
  const connectionStatusText = connectionStatus === 'connected' 
    ? 'Connected' 
    : connectionStatus === 'connecting' 
      ? 'Connecting'
      : 'Disconnected';

  return (
    <header className="bg-primary shadow-md z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <i className="material-icons text-white mr-2">location_on</i>
            <h1 className="text-xl font-semibold text-white">GPS Location Tracker</h1>
          </div>
          
          <div className="flex items-center">
            {/* Connection Status */}
            <div className="hidden sm:flex items-center mr-4 text-white">
              <span className={`inline-block h-2 w-2 rounded-full ${connectionStatusClass} mr-2 animate-pulse-custom`}></span>
              <span className="text-sm">{connectionStatusText}</span>
            </div>
            
            {/* Notifications Button */}
            <div className="relative mr-2">
              <button 
                onClick={onNotificationsClick}
                className="p-2 rounded-full text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-white"
              >
                <span className="sr-only">View notifications</span>
                <i className="material-icons">notifications</i>
                {unreadCount > 0 && (
                  <span className="notification-badge bg-accent text-white">{unreadCount}</span>
                )}
              </button>
            </div>
            
            {/* Settings Button */}
            <div>
              <button className="p-2 rounded-full text-white hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-white">
                <span className="sr-only">Settings</span>
                <i className="material-icons">settings</i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
