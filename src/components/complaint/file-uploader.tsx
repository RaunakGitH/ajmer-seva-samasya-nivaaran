
import { useState, useCallback } from 'react';
import { FileImage, FileVideo, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
}

export function FileUploader({
  onFilesSelected,
  maxFiles = 3,
  acceptedFileTypes = "image/*,video/*"
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    if (selectedFiles.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    onFilesSelected([...selectedFiles, ...newFiles]);
    
    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [selectedFiles, maxFiles, onFilesSelected]);

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    onFilesSelected(newFiles);
    
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    if (selectedFiles.length + newFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files.`);
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...newFiles]);
    onFilesSelected([...selectedFiles, ...newFiles]);
    
    // Generate previews
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviews(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }, [selectedFiles, maxFiles, onFilesSelected]);

  const isVideo = (file: File) => file.type.startsWith('video/');

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
          isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary/50",
          selectedFiles.length >= maxFiles ? "opacity-50 pointer-events-none" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Input
          id="file-upload"
          type="file"
          accept={acceptedFileTypes}
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={selectedFiles.length >= maxFiles}
        />
        <Label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center justify-center">
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-lg font-medium mb-1">
              Drag and drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Upload up to {maxFiles} images or videos
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: JPG, PNG, MP4, MOV (Max 10MB per file)
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              type="button"
              disabled={selectedFiles.length >= maxFiles}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select Files
            </Button>
          </div>
        </Label>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                {isVideo(selectedFiles[index]) ? (
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <FileVideo className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-500">
                      {selectedFiles[index].name}
                    </span>
                  </div>
                ) : (
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                type="button"
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mt-1 text-xs text-gray-500 truncate">
                {selectedFiles[index].name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
