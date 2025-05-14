import { useLocation } from '@/context/LocationContext';

interface InfoPanelProps {
  onGetLocation: () => void;
}

export default function InfoPanel({ onGetLocation }: InfoPanelProps) {
  const { 
    currentLocation, 
    isLoading
  } = useLocation();

  return (
    <div className="w-full md:w-80 bg-white shadow-lg z-10 overflow-y-auto">
      <div className="p-4">
        {/* GPS Data Card */}
        <div className="bg-neutral-100 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-neutral-400">Current GPS Data</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-neutral-300">Latitude:</span>
              <span className="font-medium">
                {currentLocation ? `${currentLocation.lat.toFixed(6)}° ${currentLocation.lat >= 0 ? 'N' : 'S'}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-300">Longitude:</span>
              <span className="font-medium">
                {currentLocation ? `${currentLocation.lng.toFixed(6)}° ${currentLocation.lng >= 0 ? 'E' : 'W'}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className={`w-full bg-primary hover:bg-primary-light text-white py-3 px-4 rounded-lg shadow flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          onClick={onGetLocation}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <i className="material-icons animate-spin mr-1">refresh</i>
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <i className="material-icons mr-1">gps_fixed</i>
              <span>Get Location</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
