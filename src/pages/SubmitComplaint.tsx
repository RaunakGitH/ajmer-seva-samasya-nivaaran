
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

  // Check storage availability on mount
  useEffect(() => {
    const checkStorage = async () => {
      const isAvailable = await checkStorageHealth('complaints-media');
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
    const validationError = validateFiles(selectedFiles);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setFiles(selectedFiles);
  }, []);

  const handleLocationSelection = useCallback((selectedLocation: Location) => {
    setLocation(selectedLocation);
  }, []);

  const handleCategorySelection = useCallback((selectedCategory: Category) => {
    setCategory(selectedCategory);
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (errors.title) clearErrors();
  };

  const nextStep = () => {
    // Validate current step
    if (activeStep === 0) {
      const isValid = validate({
        title: title.trim(),
        category: category?.name || '',
        description: description.trim(),
        location_lat: location?.lat,
        location_lng: location?.lng,
      });
      
      if (!category || !title.trim()) {
        toast.error('Please select a category and provide a title');
        return;
      }
      
      if (!isValid) return;
    }
    
    if (activeStep === 1 && !description.trim()) {
      toast.error('Please provide a description of the issue');
      return;
    }
    
    if (activeStep === 2 && !location) {
      toast.error('Please specify the location of the issue');
      return;
    }
    
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index: number) => {
    if (index <= activeStep) {
      setActiveStep(index);
    }
  };

  const handleSubmit = async () => {
    if (!session?.user) {
      toast.error("Please log in to submit your complaint");
      navigate("/auth");
      return;
    }

    try {
      setIsSubmitting(true);

      // Final validation
      const formData = {
        title: title.trim(),
        description: description.trim(),
        category: category?.name || '',
        location_lat: location?.lat,
        location_lng: location?.lng,
      };

      if (!validate(formData)) {
        toast.error("Please check your form data");
        setIsSubmitting(false);
        return;
      }

      // Upload files if available and storage is working
      let mediaUrls: string[] = [];
      if (files.length > 0 && isStorageAvailable) {
        try {
          mediaUrls = await uploadFiles(files, 'complaints-media', session.user.id);
          if (mediaUrls.length !== files.length) {
            toast.warning("Some files could not be uploaded");
          }
        } catch (error) {
          console.error("File upload failed:", error);
          toast.warning("Files could not be uploaded, submitting without attachments");
        }
      }

      // Submit complaint
      const { error } = await supabase
        .from("complaints")
        .insert({
          user_id: session.user.id,
          category: formData.category,
          description: formData.description,
          location_lat: formData.location_lat || null,
          location_lng: formData.location_lng || null,
          media_urls: mediaUrls.length > 0 ? mediaUrls : null,
          status: "Pending",
        });

      if (error) {
        handleSupabaseError(error, 'complaint submission');
        return;
      }

      toast.success("Complaint submitted successfully!");
      navigate('/complaint-success');
    } catch (error: any) {
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
