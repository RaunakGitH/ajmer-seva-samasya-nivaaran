
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { CategorySelector } from '@/components/complaint/category-selector';
import { FileUploader } from '@/components/complaint/file-uploader';
import { LocationPicker } from '@/components/complaint/location-picker';
import { VoiceTextInput } from '@/components/complaint/voice-text-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Steps,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
} from "@/components/ui/stepper";
import { useSupabaseSession } from "@/utils/supabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950/40">
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6 rounded-full hover:bg-white/80 backdrop-blur-sm flex items-center gap-2 group transition-all duration-300 dark:hover:bg-gray-800/80"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back</span>
          </Button>
          
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="relative mb-6 inline-block">
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-violet-500 mb-4 tracking-tight">
                  Submit a Complaint
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600/70 to-violet-500/70 rounded-full"></div>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                Help us improve our community by reporting civic issues that need attention
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-1">
                <Card className="sticky top-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg shadow-purple-500/5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent"></div>
                  <CardContent className="p-4 relative">
                    <Stepper orientation="vertical" activeStep={activeStep} className="min-h-72">
                      {steps.map((step, index) => (
                        <Step key={index} onClick={() => setActiveStep(index)} className="cursor-pointer">
                          <StepIndicator>
                            <StepStatus
                              complete={<StepIcon />}
                              incomplete={<StepNumber />}
                              active={<StepNumber />}
                            />
                          </StepIndicator>
                          <div className="ml-3">
                            <StepTitle>{step.title}</StepTitle>
                            <StepDescription>{step.description}</StepDescription>
                          </div>
                          {index < steps.length - 1 && <StepSeparator />}
                        </Step>
                      ))}
                    </Stepper>
                  </CardContent>
                </Card>
              </div>
              
              <div className="md:col-span-3">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-xl shadow-purple-500/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                  <CardHeader className="space-y-2 border-b dark:border-gray-700/50 pb-4 relative">
                    <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">{steps[activeStep].title}</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      {steps[activeStep].description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6 px-6">
                    {activeStep === 0 && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label htmlFor="complaint-title" className="text-base">Complaint Title</Label>
                          <Input
                            id="complaint-title"
                            placeholder="Enter a brief title for your complaint"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-gray-200 dark:border-gray-700 focus:border-purple-300 dark:focus:border-purple-400"
                          />
                        </div>
                        
                        <div className="space-y-3 mt-8">
                          <Label className="text-base">Select Category</Label>
                          <CategorySelector
                            onSelect={handleCategorySelection}
                            selectedCategoryId={category?.id || null}
                          />
                        </div>
                      </div>
                    )}
                    
                    {activeStep === 1 && (
                      <div className="space-y-8">
                        <VoiceTextInput
                          onTextChange={setDescription}
                          initialText={description}
                          label="Complaint Description"
                          placeholder="Describe the issue in detail. What is the problem? How urgent is it? How is it affecting the community?"
                        />
                        
                        <div className="space-y-3 pt-4">
                          <Label className="text-base">Upload Photos or Videos (Optional)</Label>
                          <FileUploader
                            onFilesSelected={handleFileSelection}
                            maxFiles={3}
                          />
                        </div>
                      </div>
                    )}
                    
                    {activeStep === 2 && (
                      <div className="space-y-6">
                        <LocationPicker
                          onLocationSelected={handleLocationSelection}
                          selectedLocation={location}
                        />
                      </div>
                    )}
                    
                    {activeStep === 3 && (
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
                      </div>
                    )}
                    
                    {submitError && (
                      <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg flex items-start">
                        <div className="h-5 w-5 text-red-500 mr-2 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12" y2="16"></line>
                          </svg>
                        </div>
                        <span>{submitError}</span>
                      </div>
                    )}
                    
                    {activeStep !== 3 && (
                      <div className="mt-8 flex justify-between">
                        <Button
                          variant="outline"
                          onClick={prevStep}
                          disabled={activeStep === 0}
                          className="border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                        >
                          Previous
                        </Button>
                        <Button 
                          onClick={nextStep}
                          className="min-w-[100px] bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-600 hover:to-violet-600 transition-all duration-300"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmitComplaint;
