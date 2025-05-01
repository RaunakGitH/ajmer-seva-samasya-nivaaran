
import { useState, useCallback } from 'react';
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
  const [submitError, setSubmitError] = useState<string | null>(null);

  const steps = [
    { title: 'Basic Info', description: 'Category & Title' },
    { title: 'Details', description: 'Description & Media' },
    { title: 'Location', description: 'Pinpoint Issue Location' },
    { title: 'Review', description: 'Submit Complaint' }
  ];

  const handleFileSelection = useCallback((selectedFiles: File[]) => {
    setFiles(selectedFiles);
  }, []);

  const handleLocationSelection = useCallback((selectedLocation: Location) => {
    setLocation(selectedLocation);
  }, []);

  const handleCategorySelection = useCallback((selectedCategory: Category) => {
    setCategory(selectedCategory);
  }, []);

  const nextStep = () => {
    if (activeStep === 0 && (!category || !title.trim())) {
      setSubmitError('Please select a category and provide a title for your complaint');
      return;
    }
    
    if (activeStep === 1 && !description.trim()) {
      setSubmitError('Please provide a description of the issue');
      return;
    }
    
    if (activeStep === 2 && !location) {
      setSubmitError('Please specify the location of the issue');
      return;
    }
    
    setSubmitError(null);
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleStepClick = (index: number) => {
    // Only allow going to completed steps or current step
    if (index <= activeStep) {
      setActiveStep(index);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (!session?.user) {
        setSubmitError("Please log in to submit your complaint.");
        setIsSubmitting(false);
        return;
      }

      // 1. Upload files, if any, to Supabase Storage "complaints-media"
      let mediaUrls: string[] = [];
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const newFileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from("complaints-media")
            .upload(newFileName, file);

          if (error) {
            throw new Error("Failed to upload attachment: " + error.message);
          }
          // Build the public URL for the file
          const { data: publicUrlData } = supabase.storage
            .from("complaints-media")
            .getPublicUrl(newFileName);

          mediaUrls.push(publicUrlData.publicUrl);
        }
      }

      // 2. Store complaint in "complaints" table
      const { error: insertError } = await supabase
        .from("complaints")
        .insert({
          user_id: session.user.id,
          category: category?.name ?? "",
          description,
          location_lat: location?.lat ?? null,
          location_lng: location?.lng ?? null,
          media_urls: mediaUrls.length > 0 ? mediaUrls : null,
          status: "Pending",
          // created_at and updated_at are handled by defaults
        });

      if (insertError) {
        throw new Error("Failed to submit complaint: " + insertError.message);
      }

      toast.success("Complaint submitted successfully!");
      navigate('/complaint-success');
    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      toast.error(error.message ?? 'There was an error submitting your complaint');
      setSubmitError(error.message ?? 'There was an error submitting your complaint. Please try again.');
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
            setTitle={setTitle}
            category={category}
            onCategorySelect={handleCategorySelection}
            error={submitError}
          />
        );
      case 1:
        return (
          <DetailsStep
            description={description}
            setDescription={setDescription}
            handleFileSelection={handleFileSelection}
            error={submitError}
          />
        );
      case 2:
        return (
          <LocationStep
            location={location}
            onLocationSelected={handleLocationSelection}
            error={submitError}
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
            error={submitError}
          />
        );
      default:
        return null;
    }
  };

  return (
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
  );
};

export default SubmitComplaint;
