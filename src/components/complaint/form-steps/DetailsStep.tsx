
import { FileUploader } from '@/components/complaint/file-uploader';
import { VoiceTextInput } from '@/components/complaint/voice-text-input';

interface DetailsStepProps {
  description: string;
  setDescription: (value: string) => void;
  handleFileSelection: (files: File[]) => void;
  error: string | null;
  isFileUploadDisabled?: boolean;
}

export function DetailsStep({ 
  description, 
  setDescription, 
  handleFileSelection, 
  error,
  isFileUploadDisabled = false 
}: DetailsStepProps) {
  return (
    <div className="space-y-8">
      <VoiceTextInput
        onTextChange={setDescription}
        initialText={description}
        label="Complaint Description"
        placeholder="Describe the issue in detail. What is the problem? How urgent is it? How is it affecting the community?"
      />
      
      <div className="space-y-3 pt-4">
        <FileUploader
          onFilesSelected={handleFileSelection}
          maxFiles={3}
          disabled={isFileUploadDisabled}
        />
        {isFileUploadDisabled && (
          <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Note: Due to a current issue with Supabase, images cannot be uploaded directly through the citizen complaint form
          </p>
        )}
      </div>

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
