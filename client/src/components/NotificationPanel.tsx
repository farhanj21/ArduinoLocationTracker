import { useNotification } from "@/context/NotificationContext";
import { formatDistance } from 'date-fns';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, markAllAsRead, clearAll, markAsRead } = useNotification();

  // Format notification time
  const formatTime = (timestamp: number) => {
    try {
      return formatDistance(new Date(timestamp), new Date(), { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'anomaly':
        return { icon: 'warning', bgColor: 'bg-error bg-opacity-10', textColor: 'text-error' };
      case 'geofence':
        return { icon: 'fence', bgColor: 'bg-warning bg-opacity-10', textColor: 'text-warning' };
      case 'connection':
        return { icon: 'wifi', bgColor: 'bg-success bg-opacity-10', textColor: 'text-success' };
      default:
        return { icon: 'info', bgColor: 'bg-primary bg-opacity-10', textColor: 'text-primary' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background overlay */}
        <div 
          className="absolute inset-0 bg-neutral-400 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        />
        
        <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
              {/* Header */}
              <div className="px-4 py-6 bg-primary sm:px-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-white" id="slide-over-title">Notifications</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button 
                      onClick={onClose}
                      className="bg-primary text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    >
                      <span className="sr-only">Close panel</span>
                      <i className="material-icons">close</i>
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <p className="text-sm text-white text-opacity-80">GPS tracking alerts and updates</p>
                </div>
              </div>
              
              {/* Notification List */}
              <div className="flex-1 divide-y divide-neutral-200 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 flex flex-col items-center justify-center text-center">
                    <i className="material-icons text-4xl text-neutral-300 mb-2">notifications_none</i>
                    <p className="text-neutral-400 font-medium">No notifications</p>
                    <p className="text-neutral-300 text-sm mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notification) => {
                    const { icon, bgColor, textColor } = getNotificationIcon(notification.type);
                    
                    return (
                      <div key={notification.id} className="p-4 hover:bg-neutral-50">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 pt-0.5">
                            <span className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${bgColor}`}>
                              <i className={`material-icons ${textColor}`}>{icon}</i>
                            </span>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-neutral-400">
                              {notification.title}
                            </p>
                            <p className="mt-1 text-sm text-neutral-300">
                              {notification.message}
                            </p>
                            <div className="mt-2 text-xs text-neutral-300 flex justify-between items-center">
                              <span>{formatTime(notification.timestamp)}</span>
                              <button 
                                className="text-primary hover:text-primary-dark"
                                onClick={() => markAsRead(notification.id)}
                              >
                                {notification.read ? 'Dismiss' : 'Mark as read'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Actions */}
              {notifications.length > 0 && (
                <div className="border-t border-neutral-200 p-4">
                  <div className="flex justify-between">
                    <button 
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                      onClick={markAllAsRead}
                    >
                      Mark all as read
                    </button>
                    <button 
                      className="text-neutral-300 hover:text-neutral-400 text-sm"
                      onClick={clearAll}
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
