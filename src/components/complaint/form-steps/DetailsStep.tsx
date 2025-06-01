
import { FileUploader } from '@/components/complaint/file-uploader';
import { VoiceTextInput } from '@/components/complaint/voice-text-input';
import { ErrorDisplay } from '@/components/complaint/ErrorDisplay';

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
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-lg text-sm">
            <p className="font-medium">File upload temporarily disabled</p>
            <p>Due to storage configuration issues, file uploads are currently unavailable. You can still submit your complaint without attachments.</p>
          </div>
        )}
      </div>

      <ErrorDisplay error={error} />
    </div>
  );
}
