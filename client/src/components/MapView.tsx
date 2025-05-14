import { useEffect, useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Need to explicitly define the icon paths for Leaflet
// This is a workaround for an issue with webpack/vite and Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41], 
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to update marker and center when location changes
function MarkerWithUpdates({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.panTo(position);
  }, [map, position]);
  
  return <Marker position={position} />;
}

// Component to handle map layer changes
function MapLayerControl({ mapType, setMapType }: { 
  mapType: string;
  setMapType: (type: string) => void;
}) {
  const map = useMap();
  
  useEffect(() => {
    // This effect runs when mapType changes
    // Here you could add logic to change tile layers if needed
  }, [map, mapType]);
  
  return null;
}

interface MapViewProps {
  onCurrentLocationClick: () => void;
}

export default function MapView({ onCurrentLocationClick }: MapViewProps) {
  const { currentLocation, geofence } = useLocation();
  const [mapType, setMapType] = useState<string>('streets');
  
  // Default position (Karachi)
  const defaultPosition: [number, number] = [24.8607, 67.0011];
  
  // Current position
  const position: [number, number] = currentLocation 
    ? [currentLocation.lat, currentLocation.lng]
    : defaultPosition;
  
  // Handle zoom in
  const handleZoomIn = () => {
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      const leafletInstance = (mapElement as any)._leaflet_map;
      if (leafletInstance) {
        leafletInstance.setZoom(leafletInstance.getZoom() + 1);
      }
    }
  };
  
  // Handle zoom out
  const handleZoomOut = () => {
    const mapElement = document.querySelector('.leaflet-container');
    if (mapElement) {
      const leafletInstance = (mapElement as any)._leaflet_map;
      if (leafletInstance) {
        leafletInstance.setZoom(leafletInstance.getZoom() - 1);
      }
    }
  };
  
  // Toggle map types
  const toggleLayers = () => {
    setMapType(mapType === 'streets' ? 'satellite' : 'streets');
  };

  return (
    <div className="flex-1 relative">
      {/* Map Container */}
      <div className="w-full relative" style={{ height: '500px' }}>
        <MapContainer 
          center={position} 
          zoom={15} 
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          key={`map-${position[0]}-${position[1]}`}
        >
          {/* Base Map Layer */}
          {mapType === 'streets' ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          
          {/* Marker for current location */}
          <MarkerWithUpdates position={position} />
          
          {/* Geofence circle */}
          {geofence && (
            <Circle 
              center={[geofence.lat, geofence.lng] as [number, number]}
              pathOptions={{
                color: '#1976D2',
                fillColor: '#1976D2',
                fillOpacity: 0.1,
              }}
              radius={geofence.radius}
            />
          )}
          
          {/* Controller for map layer changes */}
          <MapLayerControl mapType={mapType} setMapType={setMapType} />
        </MapContainer>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button 
          onClick={onCurrentLocationClick}
          className="bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary" 
          title="Get Current Location"
        >
          <i className="material-icons text-primary">my_location</i>
        </button>
        <button 
          onClick={handleZoomIn}
          className="bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary" 
          title="Zoom In"
        >
          <i className="material-icons text-neutral-400">add</i>
        </button>
        <button 
          onClick={handleZoomOut}
          className="bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary" 
          title="Zoom Out"
        >
          <i className="material-icons text-neutral-400">remove</i>
        </button>
        <button 
          onClick={toggleLayers}
          className="bg-white rounded-full w-10 h-10 shadow-lg flex items-center justify-center hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary" 
          title="Toggle Layers"
        >
          <i className="material-icons text-neutral-400">layers</i>
        </button>
      </div>
    </div>
  );
}
