import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom icon for pickup (green)
const pickupIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom icon for destination (red)
const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to auto-fit map bounds
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions.length >= 2) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);

  return null;
}

// Calculate distance between two points using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

interface TripMapProps {
  pickupLat: number | string | null;
  pickupLng: number | string | null;
  pickupAddress: string;
  destinationLat: number | string | null;
  destinationLng: number | string | null;
  destinationAddress: string;
}

const TripMap = ({
  pickupLat,
  pickupLng,
  pickupAddress,
  destinationLat,
  destinationLng,
  destinationAddress,
}: TripMapProps) => {
  // Convert to numbers if they're strings
  const numPickupLat = typeof pickupLat === 'string' ? Number(pickupLat) : pickupLat;
  const numPickupLng = typeof pickupLng === 'string' ? Number(pickupLng) : pickupLng;
  const numDestinationLat = typeof destinationLat === 'string' ? Number(destinationLat) : destinationLat;
  const numDestinationLng = typeof destinationLng === 'string' ? Number(destinationLng) : destinationLng;

  const hasValidCoordinates = 
    numPickupLat !== null && 
    numPickupLng !== null && 
    numDestinationLat !== null && 
    numDestinationLng !== null &&
    !isNaN(numPickupLat) &&
    !isNaN(numPickupLng) &&
    !isNaN(numDestinationLat) &&
    !isNaN(numDestinationLng);

  const positions = useMemo(() => {
    if (!hasValidCoordinates) return [];
    return [
      [numPickupLat!, numPickupLng!] as [number, number],
      [numDestinationLat!, numDestinationLng!] as [number, number],
    ];
  }, [numPickupLat, numPickupLng, numDestinationLat, numDestinationLng, hasValidCoordinates]);

  const distance = useMemo(() => {
    if (!hasValidCoordinates) return null;
    return calculateDistance(numPickupLat!, numPickupLng!, numDestinationLat!, numDestinationLng!);
  }, [numPickupLat, numPickupLng, numDestinationLat, numDestinationLng, hasValidCoordinates]);

  const centerPosition = useMemo(() => {
    if (!hasValidCoordinates) return [0, 0] as [number, number];
    return [
      (numPickupLat! + numDestinationLat!) / 2,
      (numPickupLng! + numDestinationLng!) / 2,
    ] as [number, number];
  }, [numPickupLat, numPickupLng, numDestinationLat, numDestinationLng, hasValidCoordinates]);

  if (!hasValidCoordinates) {
    return (
      <Box className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
        <Typography variant="body2" className="!text-gray-500">
          Map unavailable - Location coordinates missing
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg">
      {/* Distance Display */}
      {distance !== null && (
        <Box className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <Box className="flex items-center justify-between">
            <Box>
              <Typography variant="caption" className="!text-blue-100 !block !mb-1">
                Total Distance
              </Typography>
              <Typography variant="h5" className="!font-bold">
                {distance.toFixed(2)} km
              </Typography>
            </Box>
            <Box className="text-right">
              <Typography variant="caption" className="!text-blue-100 !block !mb-1">
                Estimated Duration
              </Typography>
              <Typography variant="h6" className="!font-semibold">
                ~{Math.round(distance * 2)} min
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Map */}
      <Box className="w-full h-96 relative">
        <MapContainer
          center={centerPosition}
          zoom={10}
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Fit bounds to show both markers */}
          <FitBounds positions={positions} />

          {/* Pickup Marker */}
          <Marker position={[numPickupLat!, numPickupLng!]} icon={pickupIcon}>
            <Popup>
              <Box>
                <Typography variant="subtitle2" className="!font-bold !text-green-700 !mb-1">
                  Pickup Location
                </Typography>
                <Typography variant="body2" className="!text-gray-700">
                  {pickupAddress}
                </Typography>
              </Box>
            </Popup>
          </Marker>

          {/* Destination Marker */}
          <Marker position={[numDestinationLat!, numDestinationLng!]} icon={destinationIcon}>
            <Popup>
              <Box>
                <Typography variant="subtitle2" className="!font-bold !text-red-700 !mb-1">
                  Destination
                </Typography>
                <Typography variant="body2" className="!text-gray-700">
                  {destinationAddress}
                </Typography>
              </Box>
            </Popup>
          </Marker>

          {/* Route Line */}
          <Polyline
            positions={positions}
            pathOptions={{
              color: "#3b82f6",
              weight: 4,
              opacity: 0.7,
            }}
          />
        </MapContainer>
      </Box>
    </Box>
  );
};

export default TripMap;
