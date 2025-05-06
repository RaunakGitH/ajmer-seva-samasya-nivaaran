
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorDisplay } from '@/components/complaint/ErrorDisplay';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface ReviewStepProps {
  title: string;
  description: string;
  category: Category | null;
  location: Location | null;
  files: File[];
  handleSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}

export function ReviewStep({
  title,
  description,
  category,
  location,
  files,
  handleSubmit,
  isSubmitting,
  error
}: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-5 flex items-center text-gray-800 dark:text-gray-100">
        <span className="w-1.5 h-6 bg-purple-500 rounded-full block mr-2.5"></span>
        Complaint Summary
      </h3>
      
      <div className="grid gap-6 p-6 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-100 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="font-medium text-gray-600 dark:text-gray-400">Category</p>
            <p className="text-lg font-semibold">{category?.name || 'Not specified'}</p>
          </div>
          
          <div className="space-y-2">
            <p className="font-medium text-gray-600 dark:text-gray-400">Title</p>
            <p className="text-lg font-semibold">{title}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-gray-600 dark:text-gray-400">Description</p>
          <p className="text-base whitespace-pre-line">{description}</p>
        </div>
        
        <div className="space-y-2">
          <p className="font-medium text-gray-600 dark:text-gray-400">Location</p>
          <p className="text-base">
            {location?.address || (location ? `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}` : 'Not specified')}
          </p>
        </div>
        
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-gray-600 dark:text-gray-400">Attachments</p>
            <ul className="list-disc list-inside text-base">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="pt-6 border-t dark:border-gray-700/50">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          By submitting this complaint, you confirm that all the information provided is accurate to the best of your knowledge.
        </p>
        
        <Button 
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-600 hover:to-violet-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" />
              Submit Complaint
            </>
          )}
        </Button>
      </div>

      {error && <ErrorDisplay error={error} />}
    </div>
  );
}
