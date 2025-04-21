
import { useState } from 'react';
import { MapPin, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationPickerProps {
  onLocationSelected: (location: Location) => void;
  selectedLocation: Location | null;
}

export function LocationPicker({ onLocationSelected, selectedLocation }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGetCurrentLocation = () => {
    setIsGettingLocation(true);
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Here you would typically reverse geocode the coordinates to get the address
        // For now, we'll just use the coordinates as a placeholder
        fetchAddress(location.lat, location.lng)
          .then(address => {
            onLocationSelected({ ...location, address });
            setAddressInput(address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
          })
          .catch(() => {
            onLocationSelected(location);
            setAddressInput(`${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
          })
          .finally(() => {
            setIsGettingLocation(false);
          });
      },
      (error) => {
        setErrorMessage(`Error getting location: ${error.message}`);
        setIsGettingLocation(false);
      }
    );
  };

  // This would be implemented with a real geocoding service
  const fetchAddress = async (lat: number, lng: number): Promise<string> => {
    // Simulate an API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, you would use Google Maps Geocoding API or similar
        resolve(`Mock Address near ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }, 1000);
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressInput(e.target.value);
  };

  const handleAddressSubmit = () => {
    // In a real app, you would geocode the address to coordinates
    // For now, we'll just use it as is
    if (addressInput.trim()) {
      setErrorMessage(null);
      // Mock coordinates for the entered address
      const mockLocation = {
        lat: 26.4498 + Math.random() * 0.01,
        lng: 74.6399 + Math.random() * 0.01,
        address: addressInput
      };
      onLocationSelected(mockLocation);
    } else {
      setErrorMessage('Please enter an address');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="location-address">Address</Label>
        <div className="flex space-x-2">
          <Input
            id="location-address"
            placeholder="Enter the location address"
            value={addressInput}
            onChange={handleAddressChange}
          />
          <Button 
            variant="outline" 
            type="button"
            onClick={handleAddressSubmit}
            disabled={!addressInput.trim()}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Set
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="w-full"
        >
          <Locate className="h-4 w-4 mr-2" />
          {isGettingLocation ? 'Getting location...' : 'Use my current location'}
        </Button>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm">{errorMessage}</p>
      )}

      {selectedLocation && (
        <Card className="p-4 bg-gray-50">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Selected Location:</p>
              <p className="text-sm text-gray-600">
                {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Google Maps would be embedded here in a real application */}
      <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">
          {selectedLocation ? 'Location selected' : 'Select a location on the map'}
        </p>
      </div>
    </div>
  );
}
