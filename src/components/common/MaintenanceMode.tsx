
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MaintenanceModeProps {
  message?: string;
  estimatedTime?: string;
}

export const MaintenanceMode: React.FC<MaintenanceModeProps> = ({
  message = "We're currently performing maintenance to improve our services.",
  estimatedTime
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <CardTitle className="text-2xl text-gray-800">
            Maintenance Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {message}
          </p>
          {estimatedTime && (
            <p className="text-sm text-gray-500">
              Estimated completion time: {estimatedTime}
            </p>
          )}
          <p className="text-sm text-gray-500">
            We apologize for any inconvenience. Please try again later.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
