
import { useState } from 'react';
import { MapPin, Locate, Search } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="location-address">Address</Label>
        <div className="flex space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="location-address"
              placeholder="Enter the location address"
              value={addressInput}
              onChange={handleAddressChange}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            type="button"
            onClick={handleAddressSubmit}
            disabled={!addressInput.trim()}
            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-2 text-primary" />
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
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 py-6"
        >
          <Locate className={`h-4 w-4 mr-2 ${isGettingLocation ? 'animate-pulse text-primary' : ''}`} />
          {isGettingLocation ? 'Getting your location...' : 'Use my current location'}
        </Button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-start">
          <div className="h-5 w-5 text-red-500 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <span>{errorMessage}</span>
        </div>
      )}

      {selectedLocation && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-start space-x-2">
            <MapPin className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div>
              <p className="font-medium text-green-700 dark:text-green-300">Selected Location:</p>
              <p className="text-sm text-green-600 dark:text-green-400">
                {selectedLocation.address || `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Google Maps would be embedded here in a real application */}
      <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/public/lovable-uploads/0226b9ce-2f88-46a7-a0d1-e110d45956ca.png')] bg-cover bg-center opacity-30"></div>
        <div className="relative z-10 bg-white/80 dark:bg-gray-900/80 py-2 px-4 rounded-full shadow-md">
          <p className="text-gray-600 dark:text-gray-300">
            {selectedLocation ? 'Location selected' : 'Select a location on the map'}
          </p>
        </div>
      </div>
    </div>
  );
}
