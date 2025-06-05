
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  description: string;
}

export function SimplifiedComplaintForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const categories: Category[] = [
    { id: 'road', name: 'Road', description: 'Potholes, damaged roads, traffic issues' },
    { id: 'garbage', name: 'Garbage', description: 'Waste collection, dumping issues, cleanliness' },
    { id: 'water', name: 'Water', description: 'Water supply, leakage, quality issues' },
    { id: 'electricity', name: 'Electricity', description: 'Power outages, street lights, electrical hazards' },
    { id: 'property', name: 'Property', description: 'Illegal construction, encroachment, property disputes' },
    { id: 'environment', name: 'Environment', description: 'Air pollution, noise pollution, tree cutting' },
    { id: 'other', name: 'Other', description: 'Other civic issues not listed above' }
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('SimplifiedComplaintForm: Title changed:', e.target.value);
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log('SimplifiedComplaintForm: Description changed:', e.target.value.length);
    setDescription(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    console.log('SimplifiedComplaintForm: Category changed:', value);
    setCategoryId(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('SimplifiedComplaintForm: Submit started');
    
    if (!title.trim()) {
      console.log('SimplifiedComplaintForm: Validation failed - no title');
      setError('Please provide a title for your complaint');
      return;
    }
    
    if (!description.trim()) {
      console.log('SimplifiedComplaintForm: Validation failed - no description');
      setError('Please provide a description of the issue');
      return;
    }
    
    if (!categoryId) {
      console.log('SimplifiedComplaintForm: Validation failed - no category');
      setError('Please select a category for your complaint');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      console.log('SimplifiedComplaintForm: Checking authentication');
      
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        console.log('SimplifiedComplaintForm: No session found');
        setError("Please log in to submit your complaint.");
        toast.error("Authentication required", { 
          description: "Please log in to submit your complaint" 
        });
        setIsSubmitting(false);
        navigate("/auth", { state: { redirectTo: "/citizen-dashboard" } });
        return;
      }

      // Get the selected category name
      const selectedCategory = categories.find(cat => cat.id === categoryId);
      
      console.log('SimplifiedComplaintForm: Submitting to database');
      
      // Submit complaint to Supabase
      const { data, error: insertError } = await supabase
        .from("complaints")
        .insert({
          user_id: sessionData.session.user.id,
          category: selectedCategory?.name || categoryId,
          description: description.trim(),
          status: "Pending",
        })
        .select();

      if (insertError) {
        console.error('SimplifiedComplaintForm: Database error:', insertError);
        throw new Error("Failed to submit complaint: " + insertError.message);
      }

      console.log('SimplifiedComplaintForm: Submission successful:', data);
      toast.success("Complaint submitted successfully!");
      setTitle('');
      setDescription('');
      setCategoryId('');
      
      // Redirect to dashboard or detailed view
      navigate('/citizen-dashboard');
    } catch (error: any) {
      console.error('SimplifiedComplaintForm: Submission error:', error);
      toast.error("Submission Failed", {
        description: error.message ?? 'There was an error submitting your complaint'
      });
      setError(error.message ?? 'There was an error submitting your complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Submit a Complaint</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-complaint-title">Title</Label>
            <Input
              id="quick-complaint-title"
              placeholder="Enter a brief title for your complaint"
              value={title}
              onChange={handleTitleChange}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quick-complaint-description">Description</Label>
            <Textarea
              id="quick-complaint-description"
              placeholder="Describe the issue in detail"
              value={description}
              onChange={handleDescriptionChange}
              rows={4}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quick-complaint-category">Category</Label>
            <Select 
              value={categoryId} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="quick-complaint-category" className="w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-gray-900 dark:text-gray-100">
                    {cat.name} - {cat.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-100 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <CardFooter className="px-0 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-600 hover:to-violet-600 transition-all duration-300 text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
