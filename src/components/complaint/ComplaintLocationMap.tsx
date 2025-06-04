
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ComplaintLocationMapProps {
  latitude: number;
  longitude: number;
}

interface AddressDetails {
  road?: string;
  house_number?: string;
  suburb?: string;
  city?: string;
  state?: string;
  postcode?: string;
  country?: string;
  formatted?: string;
}

export const ComplaintLocationMap: React.FC<ComplaintLocationMapProps> = ({
  latitude,
  longitude
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Fetch address details using reverse geocoding
  useEffect(() => {
    const fetchAddressDetails = async () => {
      try {
        setIsLoadingAddress(true);
        
        // Using OpenStreetMap Nominatim for reverse geocoding (free service)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          setAddressDetails({
            road: data.address?.road,
            house_number: data.address?.house_number,
            suburb: data.address?.suburb || data.address?.neighbourhood,
            city: data.address?.city || data.address?.town || data.address?.village,
            state: data.address?.state,
            postcode: data.address?.postcode,
            country: data.address?.country,
            formatted: data.display_name
          });
        }
      } catch (error) {
        console.error('Error fetching address details:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddressDetails();
  }, [latitude, longitude]);

  // Initialize map when token is provided
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [longitude, latitude],
        zoom: 15
      });

      // Add marker
      new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      setMapError(null);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to load map. Please check your Mapbox token.');
    }

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, mapboxToken]);

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Location Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="Enter your Mapbox public token"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Get your token from{' '}
              <a 
                href="https://mapbox.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          
          {addressDetails && (
            <div className="space-y-3">
              <h4 className="font-medium">Address Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {addressDetails.road && (
                  <div>
                    <span className="font-medium text-gray-600">Road:</span>
                    <span className="ml-2">{addressDetails.house_number} {addressDetails.road}</span>
                  </div>
                )}
                {addressDetails.suburb && (
                  <div>
                    <span className="font-medium text-gray-600">Area:</span>
                    <span className="ml-2">{addressDetails.suburb}</span>
                  </div>
                )}
                {addressDetails.city && (
                  <div>
                    <span className="font-medium text-gray-600">City:</span>
                    <span className="ml-2">{addressDetails.city}</span>
                  </div>
                )}
                {addressDetails.state && (
                  <div>
                    <span className="font-medium text-gray-600">State:</span>
                    <span className="ml-2">{addressDetails.state}</span>
                  </div>
                )}
                {addressDetails.postcode && (
                  <div>
                    <span className="font-medium text-gray-600">Postcode:</span>
                    <span className="ml-2">{addressDetails.postcode}</span>
                  </div>
                )}
                {addressDetails.country && (
                  <div>
                    <span className="font-medium text-gray-600">Country:</span>
                    <span className="ml-2">{addressDetails.country}</span>
                  </div>
                )}
              </div>
              
              {addressDetails.formatted && (
                <div className="pt-2 border-t">
                  <span className="font-medium text-gray-600">Full Address:</span>
                  <p className="text-sm mt-1 text-gray-700">{addressDetails.formatted}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-sm text-gray-500">
            <p><strong>Coordinates:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="mr-2 h-5 w-5" />
          Location Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mapError ? (
          <div className="text-red-600 text-sm">{mapError}</div>
        ) : (
          <div ref={mapContainer} className="h-64 w-full rounded-lg border" />
        )}
        
        {isLoadingAddress ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm text-gray-500">Loading address details...</span>
          </div>
        ) : addressDetails ? (
          <div className="space-y-3">
            <h4 className="font-medium">Address Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {addressDetails.road && (
                <div>
                  <span className="font-medium text-gray-600">Road:</span>
                  <span className="ml-2">{addressDetails.house_number} {addressDetails.road}</span>
                </div>
              )}
              {addressDetails.suburb && (
                <div>
                  <span className="font-medium text-gray-600">Area:</span>
                  <span className="ml-2">{addressDetails.suburb}</span>
                </div>
              )}
              {addressDetails.city && (
                <div>
                  <span className="font-medium text-gray-600">City:</span>
                  <span className="ml-2">{addressDetails.city}</span>
                </div>
              )}
              {addressDetails.state && (
                <div>
                  <span className="font-medium text-gray-600">State:</span>
                  <span className="ml-2">{addressDetails.state}</span>
                </div>
              )}
              {addressDetails.postcode && (
                <div>
                  <span className="font-medium text-gray-600">Postcode:</span>
                  <span className="ml-2">{addressDetails.postcode}</span>
                </div>
              )}
              {addressDetails.country && (
                <div>
                  <span className="font-medium text-gray-600">Country:</span>
                  <span className="ml-2">{addressDetails.country}</span>
                </div>
              )}
            </div>
            
            {addressDetails.formatted && (
              <div className="pt-2 border-t">
                <span className="font-medium text-gray-600">Full Address:</span>
                <p className="text-sm mt-1 text-gray-700">{addressDetails.formatted}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No address details available</div>
        )}
        
        <div className="text-sm text-gray-500 pt-2 border-t">
          <p><strong>Coordinates:</strong> {latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
