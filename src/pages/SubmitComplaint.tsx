
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseSession } from "@/utils/supabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Import layout and step components
import { ComplaintFormLayout } from '@/components/complaint/ComplaintFormLayout';
import { BasicInfoStep } from '@/components/complaint/form-steps/BasicInfoStep';
import { DetailsStep } from '@/components/complaint/form-steps/DetailsStep';
import { LocationStep } from '@/components/complaint/form-steps/LocationStep';
import { ReviewStep } from '@/components/complaint/form-steps/ReviewStep';
import { StepNavigation } from '@/components/complaint/StepNavigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Import validation and utilities
import { useFormValidation } from '@/hooks/useFormValidation';
import { complaintSchema, validateFiles } from '@/utils/validation';
import { uploadFiles, handleSupabaseError, checkStorageHealth } from '@/utils/supabaseHelpers';
import { COMPLAINT_CATEGORIES } from '@/utils/constants';

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

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { session } = useSupabaseSession();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);

  // Form validation
  const { errors, validate, clearErrors } = useFormValidation(complaintSchema);

  // Define step titles and descriptions
  const steps = [
    { title: 'Basic Info', description: 'Category & Title' },
    { title: 'Details', description: 'Description & Media' },
    { title: 'Location', description: 'Pinpoint Issue Location' },
    { title: 'Review', description: 'Submit Complaint' }
  ];

  // Debug logging
  useEffect(() => {
    console.log('SubmitComplaint: Component mounted');
    console.log('SubmitComplaint: Session state:', session ? 'authenticated' : 'not authenticated');
  }, [session]);

  useEffect(() => {
    console.log('SubmitComplaint: Form state updated:', {
      title: title.length,
      description: description.length,
      category: category?.name || 'none',
      location: location ? 'set' : 'not set',
      files: files.length,
      activeStep,
      errors
    });
  }, [title, description, category, location, files, activeStep, errors]);

  // Check storage availability on mount
  useEffect(() => {
    const checkStorage = async () => {
      console.log('SubmitComplaint: Checking storage health');
      const isAvailable = await checkStorageHealth('complaints-media');
      console.log('SubmitComplaint: Storage available:', isAvailable);
      setIsStorageAvailable(isAvailable);
      
      if (!isAvailable) {
        toast.warning("File upload temporarily unavailable", {
          description: "You can still submit complaints without attachments."
        });
      }
    };
    
    checkStorage();
  }, []);

  const handleFileSelection = useCallback((selectedFiles: File[]) => {
    console.log('SubmitComplaint: File selection:', selectedFiles.length);
    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      console.log('SubmitComplaint: File validation error:', validationError);
      toast.error(validationError);
      return;
    }
    setFiles(selectedFiles);
  }, []);

  const handleLocationSelection = useCallback((selectedLocation: Location) => {
    console.log('SubmitComplaint: Location selected:', selectedLocation);
    setLocation(selectedLocation);
  }, []);

  const handleCategorySelection = useCallback((selectedCategory: Category) => {
    console.log('SubmitComplaint: Category selected:', selectedCategory.name);
    setCategory(selectedCategory);
  }, []);

  const handleTitleChange = (value: string) => {
    console.log('SubmitComplaint: Title changed:', value.length);
    setTitle(value);
    if (errors.title) clearErrors();
  };

  const nextStep = () => {
    console.log('SubmitComplaint: Next step clicked, current step:', activeStep);
    
    // Simplified validation for step progression
    if (activeStep === 0) {
      if (!category) {
        console.log('SubmitComplaint: Step 0 validation failed - no category');
        toast.error('Please select a category');
        return;
      }
      if (!title.trim()) {
        console.log('SubmitComplaint: Step 0 validation failed - no title');
        toast.error('Please provide a title');
        return;
      }
    }
    
    if (activeStep === 1) {
      if (!description.trim()) {
        console.log('SubmitComplaint: Step 1 validation failed - no description');
        toast.error('Please provide a description');
        return;
      }
    }
    
    if (activeStep === 2) {
      if (!location) {
        console.log('SubmitComplaint: Step 2 validation failed - no location');
        toast.error('Please specify the location');
        return;
      }
    }
    
    console.log('SubmitComplaint: Moving to next step');
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    console.log('SubmitComplaint: Previous step clicked');
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index: number) => {
    console.log('SubmitComplaint: Step clicked:', index);
    if (index <= activeStep) {
      setActiveStep(index);
    }
  };

  const handleSubmit = async () => {
    console.log('SubmitComplaint: Submit started');
    
    if (!session?.user) {
      console.log('SubmitComplaint: No session, redirecting to auth');
      toast.error("Please log in to submit your complaint");
      navigate("/auth");
      return;
    }

    // Basic validation
    if (!category) {
      console.log('SubmitComplaint: Submit failed - no category');
      toast.error("Please select a category");
      return;
    }

    if (!title.trim()) {
      console.log('SubmitComplaint: Submit failed - no title');
      toast.error("Please provide a title");
      return;
    }

    if (!description.trim()) {
      console.log('SubmitComplaint: Submit failed - no description');
      toast.error("Please provide a description");
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('SubmitComplaint: Starting submission process');

      // Upload files if available and storage is working
      let mediaUrls: string[] = [];
      if (files.length > 0 && isStorageAvailable) {
        try {
          console.log('SubmitComplaint: Uploading files:', files.length);
          mediaUrls = await uploadFiles(files, 'complaints-media', session.user.id);
          console.log('SubmitComplaint: Files uploaded:', mediaUrls.length);
          if (mediaUrls.length !== files.length) {
            toast.warning("Some files could not be uploaded");
          }
        } catch (error) {
          console.error("SubmitComplaint: File upload failed:", error);
          toast.warning("Files could not be uploaded, submitting without attachments");
        }
      }

      // Prepare complaint data with proper typing
      const complaintData = {
        user_id: session.user.id,
        category: category.name,
        description: description.trim(),
        location_lat: location?.lat || null,
        location_lng: location?.lng || null,
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        status: "Pending" as const, // Fix TypeScript error by using const assertion
      };

      console.log('SubmitComplaint: Submitting to database:', complaintData);

      // Submit complaint
      const { data, error } = await supabase
        .from("complaints")
        .insert(complaintData)
        .select();

      if (error) {
        console.error('SubmitComplaint: Database error:', error);
        handleSupabaseError(error, 'complaint submission');
        return;
      }

      console.log('SubmitComplaint: Submission successful:', data);
      toast.success("Complaint submitted successfully!");
      navigate('/citizen-dashboard');
    } catch (error: any) {
      console.error('SubmitComplaint: Submission error:', error);
      handleSupabaseError(error, 'complaint submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicInfoStep
            title={title}
            setTitle={handleTitleChange}
            category={category}
            onCategorySelect={handleCategorySelection}
            error={errors.title || errors.category}
          />
        );
      case 1:
        return (
          <DetailsStep
            description={description}
            setDescription={setDescription}
            handleFileSelection={handleFileSelection}
            error={errors.description}
            isFileUploadDisabled={!isStorageAvailable}
          />
        );
      case 2:
        return (
          <LocationStep
            location={location}
            onLocationSelected={handleLocationSelection}
            error={errors.location_lat || errors.location_lng}
          />
        );
      case 3:
        return (
          <ReviewStep
            title={title}
            description={description}
            category={category}
            location={location}
            files={files}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            error={null}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <ErrorBoundary>
        <ComplaintFormLayout
          activeStep={activeStep}
          steps={steps}
          onStepClick={handleStepClick}
        >
          {renderStepContent()}
          
          {activeStep !== 3 && (
            <StepNavigation
              activeStep={activeStep}
              totalSteps={steps.length}
              onNextClick={nextStep}
              onPreviousClick={prevStep}
            />
          )}
        </ComplaintFormLayout>
      </ErrorBoundary>
    </AuthGuard>
  );
};

export default SubmitComplaint;
