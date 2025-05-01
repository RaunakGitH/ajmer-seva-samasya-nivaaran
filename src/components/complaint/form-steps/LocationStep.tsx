
import { LocationPicker } from '@/components/complaint/location-picker';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationStepProps {
  location: Location | null;
  onLocationSelected: (location: Location) => void;
  error: string | null;
}

export function LocationStep({ location, onLocationSelected, error }: LocationStepProps) {
  return (
    <div className="space-y-6">
      <LocationPicker
        onLocationSelected={onLocationSelected}
        selectedLocation={location}
      />

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-start">
          <div className="h-5 w-5 text-red-500 mr-2 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12" y2="16"></line>
            </svg>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
